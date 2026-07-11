"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
  type AddressInsert,
  type AddressRow,
  type AddressUpdate,
} from "@/src/services/address.service";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function useAddresses() {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const refreshAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const rows = await getAddresses();
      setAddresses(rows);
    } catch (error) {
      setError(getErrorMessage(error, "We could not load your addresses."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await Promise.resolve();
      if (!cancelled) {
        await refreshAddresses();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshAddresses]);

  const defaultAddressId = useMemo(() => addresses.find((item) => item.is_default)?.id ?? addresses[0]?.id ?? null, [addresses]);

  const createAddress = useCallback(
    async (values: Omit<AddressInsert, "user_id">) => {
      setIsSaving(true);
      setError(null);

      try {
        await addAddress(values);
        await refreshAddresses();
        toast({ title: "Address saved", description: "Your shipping address has been added.", variant: "success" });
        return { success: true as const };
      } catch (error) {
        const message = getErrorMessage(error, "We could not save this address.");
        setError(message);
        toast({ title: "Address error", description: message, variant: "error" });
        return { success: false as const, message };
      } finally {
        setIsSaving(false);
      }
    },
    [refreshAddresses, toast],
  );

  const editAddress = useCallback(
    async (addressId: string, values: Omit<AddressUpdate, "user_id">) => {
      setIsSaving(true);
      setError(null);

      try {
        await updateAddress(addressId, values);
        await refreshAddresses();
        toast({ title: "Address updated", description: "Your address has been updated.", variant: "success" });
        return { success: true as const };
      } catch (error) {
        const message = getErrorMessage(error, "We could not update this address.");
        setError(message);
        toast({ title: "Address error", description: message, variant: "error" });
        return { success: false as const, message };
      } finally {
        setIsSaving(false);
      }
    },
    [refreshAddresses, toast],
  );

  const removeAddress = useCallback(
    async (addressId: string) => {
      setProcessingIds((current) => (current.includes(addressId) ? current : [...current, addressId]));
      setError(null);

      try {
        await deleteAddress(addressId);
        await refreshAddresses();
        toast({ title: "Address deleted", variant: "info" });
        return { success: true as const };
      } catch (error) {
        const message = getErrorMessage(error, "We could not delete this address.");
        setError(message);
        toast({ title: "Address error", description: message, variant: "error" });
        return { success: false as const, message };
      } finally {
        setProcessingIds((current) => current.filter((id) => id !== addressId));
      }
    },
    [refreshAddresses, toast],
  );

  const chooseDefaultAddress = useCallback(
    async (addressId: string) => {
      setProcessingIds((current) => (current.includes(addressId) ? current : [...current, addressId]));
      setError(null);

      try {
        await setDefaultAddress(addressId);
        await refreshAddresses();
        toast({ title: "Default address set", variant: "success" });
        return { success: true as const };
      } catch (error) {
        const message = getErrorMessage(error, "We could not set your default address.");
        setError(message);
        toast({ title: "Address error", description: message, variant: "error" });
        return { success: false as const, message };
      } finally {
        setProcessingIds((current) => current.filter((id) => id !== addressId));
      }
    },
    [refreshAddresses, toast],
  );

  return {
    addresses,
    loading,
    isSaving,
    error,
    processingIds,
    defaultAddressId,
    refreshAddresses,
    createAddress,
    editAddress,
    removeAddress,
    chooseDefaultAddress,
  };
}
