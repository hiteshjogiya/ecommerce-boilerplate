import { z } from "zod";

export const addressSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required."),
  phone: z.string().trim().min(6, "Phone number is required."),
  email: z.string().trim().email("Please enter a valid email."),
  address_line_1: z.string().trim().min(3, "Address line 1 is required."),
  address_line_2: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required."),
  state: z.string().trim().min(2, "State is required."),
  country: z.string().trim().min(2, "Country is required."),
  postal_code: z.string().trim().min(3, "Postal code is required."),
  is_default: z.boolean().optional(),
});

const billingAddressSchema = z.object({
  full_name: z.string().trim().min(2, "Billing full name is required."),
  phone: z.string().trim().min(6, "Billing phone is required."),
  email: z.string().trim().email("Please enter a valid billing email."),
  address_line_1: z.string().trim().min(3, "Billing address line 1 is required."),
  address_line_2: z.string().trim().optional(),
  city: z.string().trim().min(2, "Billing city is required."),
  state: z.string().trim().min(2, "Billing state is required."),
  country: z.string().trim().min(2, "Billing country is required."),
  postal_code: z.string().trim().min(3, "Billing postal code is required."),
});

export const checkoutSchema = z
  .object({
    addressId: z.string().uuid("Please select a shipping address."),
    shippingMethodId: z.string().min(1, "Please select a shipping method."),
    billingSameAsShipping: z.boolean(),
    billingAddress: billingAddressSchema.partial().optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.billingSameAsShipping) {
      const parsed = billingAddressSchema.safeParse(values.billingAddress ?? {});

      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["billingAddress", ...(issue.path ?? [])],
            message: issue.message,
          });
        }
      }
    }
  });

export type AddressFormValues = z.infer<typeof addressSchema>;
export type CheckoutValues = z.infer<typeof checkoutSchema>;
