import type { CheckoutCustomer } from "@/lib/api/orders";

const fieldClass =
  "h-11 w-full border border-[#E8D0DA] bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#A02C68]";

export const checkoutFieldClass = fieldClass;

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function toE164Phone(value: string) {
  const digits = digitsOnly(value);
  const ten = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return `+91${ten}`;
}

export function validateCheckout(customer: CheckoutCustomer) {
  const errors: Partial<Record<keyof CheckoutCustomer, string>> = {};
  const name = customer.name.trim();
  const email = customer.email.trim();
  const address = customer.address.trim();
  const city = customer.city.trim();
  const state = customer.state.trim();
  const phone = digitsOnly(customer.phone);
  const phoneTen =
    phone.length === 12 && phone.startsWith("91") ? phone.slice(2) : phone;
  const pincode = digitsOnly(customer.pincode);

  if (name.length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email.";
  }
  if (!/^[6-9]\d{9}$/.test(phoneTen)) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }
  if (address.length < 8) errors.address = "Please enter your full address.";
  if (city.length < 2) errors.city = "Please enter your city.";
  if (state.length < 2) errors.state = "Please enter your state.";
  if (!/^\d{6}$/.test(pincode)) errors.pincode = "Enter a 6-digit pincode.";

  return errors;
}

export function razorpayAmountPaise(amount: number, totalRupees: number) {
  const paise = Math.round(totalRupees * 100);
  if (!amount) return paise;
  if (Math.abs(amount - paise) <= 1) return Math.round(amount);
  if (Math.abs(amount - totalRupees) <= 1) return paise;
  return Math.round(amount);
}
