"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addressSchema, type AddressFormValues } from "@/features/checkout/schemas/checkout-schema";
import { useAddresses } from "@/features/checkout/hooks/use-addresses";
import type { AddressRow } from "@/src/services/address.service";
import { AccountEmptyState } from "@/features/account/components/account-empty-state";

export function AddressesManager() {
  const { addresses, loading, error, isSaving, processingIds, createAddress, editAddress, removeAddress, chooseDefaultAddress } = useAddresses();
  const [editing, setEditing] = useState<AddressRow | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      email: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      is_default: false,
    },
  });

  const startCreate = () => {
    setEditing(null);
    form.reset({
      full_name: "",
      phone: "",
      email: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      is_default: addresses.length === 0,
    });
    setOpen(true);
  };

  const startEdit = (address: AddressRow) => {
    setEditing(address);
    form.reset({
      full_name: address.full_name,
      phone: address.phone,
      email: address.email,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 ?? "",
      city: address.city,
      state: address.state,
      country: address.country,
      postal_code: address.postal_code,
      is_default: address.is_default,
    });
    setOpen(true);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (editing) {
      const result = await editAddress(editing.id, values);
      if (result.success) {
        setOpen(false);
        setEditing(null);
      }
      return;
    }

    const result = await createAddress(values);
    if (result.success) {
      setOpen(false);
    }
  });

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Addresses</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your shipping addresses.</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={startCreate}>Add address</Button>
      </div>

      {error ? <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {loading ? <p className="mt-4 text-sm text-slate-600">Loading addresses...</p> : null}

      {!loading && addresses.length === 0 ? (
        <div className="mt-4">
          <AccountEmptyState title="No addresses yet" description="Save your first shipping address for faster checkout." />
        </div>
      ) : null}

      {!loading && addresses.length > 0 ? (
        <div className="mt-4 space-y-3">
          {addresses.map((address) => {
            const processing = processingIds.includes(address.id);
            return (
              <article key={address.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{address.full_name}</p>
                  {address.is_default ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Default</span> : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">{address.email} • {address.phone}</p>
                <p className="mt-1 text-sm text-slate-700">{address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ""}, {address.city}, {address.state}, {address.country} {address.postal_code}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="ghost" className="border border-slate-200" onClick={() => startEdit(address)} disabled={processing}>Edit</Button>
                  {!address.is_default ? <Button type="button" size="sm" variant="ghost" className="border border-slate-200" onClick={() => { void chooseDefaultAddress(address.id); }} disabled={processing}>Set default</Button> : null}
                  <Button type="button" size="sm" variant="ghost" className="border border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => { void removeAddress(address.id); }} disabled={processing}>Delete</Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {open ? (
        <form className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input {...form.register("full_name")} placeholder="Full name" />
            <Input {...form.register("phone")} placeholder="Phone number" />
          </div>
          <Input {...form.register("email")} placeholder="Email" type="email" />
          <Input {...form.register("address_line_1")} placeholder="Address line 1" />
          <Input {...form.register("address_line_2")} placeholder="Address line 2" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input {...form.register("city")} placeholder="City" />
            <Input {...form.register("state")} placeholder="State" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input {...form.register("country")} placeholder="Country" />
            <Input {...form.register("postal_code")} placeholder="Postal code" />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" {...form.register("is_default")} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
            Set as default
          </label>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="secondary" size="sm" disabled={isSaving}>{editing ? "Update" : "Save"}</Button>
            <Button type="button" variant="ghost" size="sm" className="border border-slate-200" onClick={() => { setOpen(false); setEditing(null); }}>Cancel</Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
