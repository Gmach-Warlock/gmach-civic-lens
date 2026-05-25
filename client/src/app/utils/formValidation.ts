import {
  emailRegex,
  passwordRegex,
  zipCodeRegex,
  phoneRegex,
  urlRegex,
} from "../../assets/authRegexes";

export const validators = {
  required: (label: string) => (val: string) =>
    val.trim() ? "" : `${label} is required.`,

  email: (val: string) =>
    emailRegex.test(val)
      ? ""
      : "Invalid email address format (e.g., name@domain.com).",

  password: (val: string) =>
    passwordRegex.test(val)
      ? ""
      : "Password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&).",

  zipCode: (val: string) =>
    zipCodeRegex.test(val)
      ? ""
      : "Invalid Zip Code format. Use 5 digits (12345) or Zip+4 (12345-6789).",

  phone: (val: string) =>
    phoneRegex.test(val)
      ? ""
      : "Invalid phone number format. Please provide a valid 10-digit number.",

  url: (val: string) => (urlRegex.test(val) ? "" : "Invalid URL link format."),
};
