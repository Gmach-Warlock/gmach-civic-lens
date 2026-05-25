import type { FieldConfig } from "../app/interfaces/componentInterfaces";
import { validators } from "../app/utils/formValidation";

export const registerFields: FieldConfig[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text" as const,
    placeholder: "Jane",
    required: true,
    gridClass: "grid-span-1",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text" as const,
    placeholder: "Doe",
    required: true,
    gridClass: "grid-span-1",
  },
  {
    name: "username",
    label: "Username",
    type: "text" as const,
    placeholder: "Enter your username",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email" as const,
    placeholder: "civic@lens.com",
    required: true,
    validate: validators.email,
  },
  {
    name: "address",
    label: "Address",
    type: "text" as const,
    placeholder: "123 Civic Way",
    required: true,
  },
  {
    name: "city",
    label: "City",
    type: "text" as const,
    placeholder: "Metropolis",
    required: true,
  },
  {
    name: "zipCode",
    label: "Zip Code",
    type: "text" as const,
    placeholder: "12345",
    required: true,
    validate: validators.zipCode,
  },
  {
    name: "password",
    label: "Password",
    type: "password" as const,
    placeholder: "••••••••",
    required: true,
    validate: validators.password,
  },
];
