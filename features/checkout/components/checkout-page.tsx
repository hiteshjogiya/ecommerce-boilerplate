"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, MapPinHouse, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckout } from "@/features/checkout/hooks/use-checkout";
import { SHIPPING_METHODS } from "@/features/checkout/constants";
import { addressSchema, checkoutSchema, type AddressFormValues } from "@/features/checkout/schemas/checkout-schema";
import type { AddressRow } from "@/src/services/address.service";
import { formatCurrency } from "@/src/constants/order";

function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  isProcessing,
}: {
  address: AddressRow;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isProcessing: boolean;
}) {
  return (
    <article className={`rounded-3xl border p-4 shadow-sm transition ${selected ? "border-blue-600 bg-blue-50/40" : "border-slate-200 bg-white"}`}>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="radio"
          name="selected-address"
          checked={selected}
          onChange={onSelect}
          className="mt-1 h-4 w-4 border-slate-300 text-blue-600"
          aria-label={`Select ${address.full_name} address`}
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900">{address.full_name}</p>
            {address.is_default ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">Default</span>
            ) : null}
          </div>
          <p className="text-sm text-slate-600">{address.phone}</p>
          <p className="text-sm text-slate-600">{address.email}</p>
          <p className="text-sm text-slate-700">
            {address.address_line_1}
            {address.address_line_2 ? `, ${address.address_line_2}` : ""}, {address.city}, {address.state}, {address.country} {address.postal_code}
          </p>
        </div>
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="ghost" size="sm" className="border border-slate-200" onClick={onEdit} disabled={isProcessing}>
          Edit
        </Button>
        {!address.is_default ? (
          <Button type="button" variant="ghost" size="sm" className="border border-slate-200" onClick={onSetDefault} disabled={isProcessing}>
            Set default
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="border border-rose-200 text-rose-600 hover:bg-rose-50"
          onClick={onDelete}
          disabled={isProcessing}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}

export function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    userId,
    cartTotals,
    tax,
    discount,
    shippingCost,
    grandTotal,
    selectedAddressId,
    selectedShippingMethodId,
    billingSameAsShipping,
    setSelectedAddressId,
    setSelectedShippingMethodId,
    setBillingSameAsShipping,
    validateCheckout,
    addressesApi,
    placeOrderApi,
  } = useCheckout();

  const [editingAddress, setEditingAddress] = useState<AddressRow | null>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const addressForm = useForm<AddressFormValues>({
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

  useEffect(() => {
    if (addressesApi.defaultAddressId && !selectedAddressId) {
      setSelectedAddressId(addressesApi.defaultAddressId);
    }
  }, [addressesApi.defaultAddressId, selectedAddressId, setSelectedAddressId]);

  const emptyCart = !items.length;
  const initialLoading = addressesApi.loading;

  const openCreateAddress = () => {
    setEditingAddress(null);
    addressForm.reset({
      full_name: "",
      phone: "",
      email: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      is_default: addressesApi.addresses.length === 0,
    });
    setIsAddressFormOpen(true);
  };

  const openEditAddress = (address: AddressRow) => {
    setEditingAddress(address);
    addressForm.reset({
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
    setIsAddressFormOpen(true);
  };

  const onSubmitAddress = addressForm.handleSubmit(async (values) => {
    if (editingAddress) {
      const result = await addressesApi.editAddress(editingAddress.id, values);
      if (result.success) {
        setIsAddressFormOpen(false);
        setEditingAddress(null);
      }
      return;
    }

    const result = await addressesApi.createAddress(values);
    if (result.success) {
      setIsAddressFormOpen(false);
    }
  });

  const selectedShippingMethod = useMemo(
    () => SHIPPING_METHODS.find((method) => method.id === selectedShippingMethodId) ?? SHIPPING_METHODS[0],
    [selectedShippingMethodId],
  );

  const handlePlaceOrder = async () => {
    setCheckoutError(null);

    if (!userId) {
      router.push(`/login?returnTo=${encodeURIComponent("/checkout")}`);
      return;
    }

    if (emptyCart) {
      setCheckoutError("Your cart is empty. Add products before checkout.");
      return;
    }

    if (!selectedAddressId) {
      setCheckoutError("Please select a shipping address.");
      return;
    }

    const parsed = checkoutSchema.safeParse({
      addressId: selectedAddressId,
      shippingMethodId: selectedShippingMethod.id,
      billingSameAsShipping,
      billingAddress: undefined,
    });

    if (!parsed.success) {
      setCheckoutError(parsed.error.issues[0]?.message ?? "Please review your checkout details.");
      return;
    }

    const validated = validateCheckout(parsed.data);

    if (!validated.success) {
      setCheckoutError(validated.error.issues[0]?.message ?? "Please review your checkout details.");
      return;
    }

    const result = await placeOrderApi.submitOrder(validated.data, selectedShippingMethod, tax, discount);

    if (!result.success) {
      setCheckoutError(result.message);
    }
  };

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            <CreditCard className="h-4 w-4" />
            Checkout
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Complete your order</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Confirm your shipping address, choose delivery speed, and place your order securely. Payment integration will be added in a later phase.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          {emptyCart ? (
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-6">
              <h2 className="text-lg font-semibold text-amber-900">Your cart is empty</h2>
              <p className="mt-2 text-sm text-amber-800">Add products to your cart before proceeding to checkout.</p>
              <Link href="/products" className="mt-4 inline-flex h-10 items-center rounded-full border border-amber-300 px-4 text-sm font-medium text-amber-900">
                Browse products
              </Link>
            </div>
          ) : null}

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm" aria-label="Shipping address">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Shipping address</h2>
                <p className="mt-1 text-sm text-slate-600">Select the delivery address for this order.</p>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={openCreateAddress}>
                Add address
              </Button>
            </div>

            {addressesApi.error ? (
              <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{addressesApi.error}</p>
            ) : null}

            {initialLoading ? (
              <p className="mt-4 text-sm text-slate-600">Loading addresses...</p>
            ) : addressesApi.addresses.length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">No addresses found. Add a shipping address to continue.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {addressesApi.addresses.map((address) => {
                  const isProcessing = addressesApi.processingIds.includes(address.id);
                  return (
                    <AddressCard
                      key={address.id}
                      address={address}
                      selected={selectedAddressId === address.id}
                      onSelect={() => setSelectedAddressId(address.id)}
                      onEdit={() => openEditAddress(address)}
                      onDelete={() => {
                        void addressesApi.removeAddress(address.id);
                      }}
                      onSetDefault={() => {
                        void addressesApi.chooseDefaultAddress(address.id);
                      }}
                      isProcessing={isProcessing}
                    />
                  );
                })}
              </div>
            )}

            {isAddressFormOpen ? (
              <form className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4" onSubmit={onSubmitAddress}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Full name</label>
                    <Input {...addressForm.register("full_name")} aria-label="Full name" />
                    {addressForm.formState.errors.full_name ? <p className="text-xs text-rose-600">{addressForm.formState.errors.full_name.message}</p> : null}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Phone number</label>
                    <Input {...addressForm.register("phone")} aria-label="Phone number" />
                    {addressForm.formState.errors.phone ? <p className="text-xs text-rose-600">{addressForm.formState.errors.phone.message}</p> : null}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <Input type="email" {...addressForm.register("email")} aria-label="Email" />
                  {addressForm.formState.errors.email ? <p className="text-xs text-rose-600">{addressForm.formState.errors.email.message}</p> : null}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Address line 1</label>
                  <Input {...addressForm.register("address_line_1")} aria-label="Address line 1" />
                  {addressForm.formState.errors.address_line_1 ? <p className="text-xs text-rose-600">{addressForm.formState.errors.address_line_1.message}</p> : null}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Address line 2</label>
                  <Input {...addressForm.register("address_line_2")} aria-label="Address line 2" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">City</label>
                    <Input {...addressForm.register("city")} aria-label="City" />
                    {addressForm.formState.errors.city ? <p className="text-xs text-rose-600">{addressForm.formState.errors.city.message}</p> : null}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">State</label>
                    <Input {...addressForm.register("state")} aria-label="State" />
                    {addressForm.formState.errors.state ? <p className="text-xs text-rose-600">{addressForm.formState.errors.state.message}</p> : null}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Country</label>
                    <Input {...addressForm.register("country")} aria-label="Country" />
                    {addressForm.formState.errors.country ? <p className="text-xs text-rose-600">{addressForm.formState.errors.country.message}</p> : null}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Postal code</label>
                    <Input {...addressForm.register("postal_code")} aria-label="Postal code" />
                    {addressForm.formState.errors.postal_code ? <p className="text-xs text-rose-600">{addressForm.formState.errors.postal_code.message}</p> : null}
                  </div>
                </div>
                <label className="mt-1 inline-flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" {...addressForm.register("is_default")} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                  Set as default address
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button type="submit" variant="secondary" size="sm" disabled={addressesApi.isSaving || addressForm.formState.isSubmitting}>
                    {editingAddress ? "Update address" : "Save address"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="border border-slate-200"
                    onClick={() => {
                      setIsAddressFormOpen(false);
                      setEditingAddress(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : null}
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm" aria-label="Shipping methods">
            <h2 className="text-xl font-semibold text-slate-900">Shipping method</h2>
            <p className="mt-1 text-sm text-slate-600">Choose your preferred delivery speed.</p>
            <div className="mt-4 space-y-3">
              {SHIPPING_METHODS.map((method) => (
                <label key={method.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${selectedShippingMethodId === method.id ? "border-blue-600 bg-blue-50/40" : "border-slate-200"}`}>
                  <input
                    type="radio"
                    name="shipping-method"
                    checked={selectedShippingMethodId === method.id}
                    onChange={() => setSelectedShippingMethodId(method.id)}
                    className="mt-1 h-4 w-4 border-slate-300 text-blue-600"
                    aria-label={`Select ${method.name}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{method.name}</p>
                      <p className="font-medium text-slate-900">{formatCurrency(method.price)}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">Estimated delivery: {method.estimatedDelivery}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm" aria-label="Billing address">
            <h2 className="text-xl font-semibold text-slate-900">Billing address</h2>
            <label className="mt-3 inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={billingSameAsShipping}
                onChange={(event) => setBillingSameAsShipping(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
                aria-label="Billing address same as shipping"
              />
              Billing address is the same as shipping address
            </label>
            {!billingSameAsShipping ? (
              <p className="mt-3 text-sm text-slate-600">
                Separate billing address collection is enabled. Payment capture is not part of this phase, so billing data is validated and held only in checkout state.
              </p>
            ) : null}
          </section>
        </div>

        <aside className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm" aria-label="Order summary">
          <h2 className="text-xl font-semibold text-slate-900">Order summary</h2>
          <p className="mt-1 text-sm text-slate-600">Review your items and totals before placing the order.</p>

          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Item total</span>
              <span className="font-medium text-slate-900">{formatCurrency(cartTotals.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-medium text-slate-900">{formatCurrency(shippingCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax (placeholder)</span>
              <span className="font-medium text-slate-900">{formatCurrency(tax)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount (placeholder)</span>
              <span className="font-medium text-slate-900">{formatCurrency(discount)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base">
              <span className="font-semibold text-slate-900">Grand total</span>
              <span className="font-semibold text-slate-900">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          {checkoutError || placeOrderApi.error ? (
            <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{checkoutError ?? placeOrderApi.error}</p>
          ) : null}

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="mt-6 w-full"
            onClick={handlePlaceOrder}
            disabled={placeOrderApi.isSubmitting || emptyCart || addressesApi.loading}
            aria-label="Place order"
          >
            {placeOrderApi.isSubmitting ? "Placing order..." : "Place order"}
          </Button>

          <div className="mt-4 space-y-2 text-xs text-slate-500">
            <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Secure checkout session</p>
            <p className="flex items-center gap-2"><Truck className="h-3.5 w-3.5" /> {selectedShippingMethod.name} selected</p>
            <p className="flex items-center gap-2"><MapPinHouse className="h-3.5 w-3.5" /> {selectedAddressId ? "Shipping address selected" : "No shipping address selected"}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
