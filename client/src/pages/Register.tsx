import { useAppDispatch, useAppSelector } from "../app/hooks/generalHooks";
import { registerUser } from "../features/auth/thunks/registerUser";
import type { UserGeneralInfoInterface } from "../app/interfaces/authInterfaces"; // 👈 Imported your flat interface
import type { FieldConfig } from "../app/interfaces/componentInterfaces";
import { useNavigate } from "react-router";
import {
  selectAccessToken,
  selectUser,
} from "../features/auth/selectors/authSelectors";

import { Form } from "../components/molecules/actions/Form";
import Button from "../components/atoms/controls/Button";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);

  const registerFields: FieldConfig[] = [
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
      type: "number" as const,
      placeholder: "12345",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password" as const,
      placeholder: "••••••••",
      required: true,
    },
  ];

  const handleFormSubmit = async (values: Record<string, string>) => {
    // 1. Construct the flat payload using your existing interface
    const registrationPayload: UserGeneralInfoInterface = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      username: values.username,
      email: values.email,
      password: values.password,
      address: values.address,
      city: values.city,
      zipCode: values.zipCode,
    };

    try {
      // 2. Pass the flat data directly to your thunk
      await dispatch(registerUser(registrationPayload)).unwrap();
      console.log("Success! Form cleared by engine.");
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  return (
    <div className="register__page">
      <div className="card--form">
        <h2 className="register__title">
          {accessToken
            ? `Welcome, ${user.general.firstName}!`
            : "Create Account"}
        </h2>

        {!accessToken ? (
          <Form
            fields={registerFields}
            submitButtonText="Register"
            onSubmit={handleFormSubmit}
            className="register__form"
          />
        ) : (
          <div className="success-overlay">
            <p>Your account is ready.</p>
            <Button
              type="button"
              name="goto-dashboard"
              content="Go to Dashboard"
              variant="success"
              onClick={() => navigate("/dashboard")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
