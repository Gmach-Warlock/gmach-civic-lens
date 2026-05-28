import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks/generalHooks";
import { registerUser } from "../features/auth/thunks/registerUser";
import type { UserGeneralInfoInterface } from "../app/interfaces/authInterfaces";
import type { FieldConfig } from "../app/interfaces/componentInterfaces";
import { useNavigate } from "react-router";
import {
  selectAccessToken,
  selectUser,
} from "../features/auth/selectors/authSelectors";
import { addToast } from "../features/global/globalSlice";
import { Form } from "../components/molecules/actions/Form";
import Button from "../components/atoms/controls/Button";

// Import your frontend validation regex utilities here 👇
import { emailRegex, passwordRegex, zipCodeRegex } from "../assets/authRegexes";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [accessToken, navigate]);

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
      type: "text" as const,
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
    const cleanedEmail = values.email.trim();
    const cleanedZip = values.zipCode.trim();
    const rawPassword = values.password;

    // --- FRONTEND GUARDS ---

    // 1. Validate Email
    if (!emailRegex.test(cleanedEmail)) {
      dispatch(
        addToast({
          message:
            "Please enter a valid email address (e.g., user@example.com).",
          type: "error",
        }),
      );
      return; // Stop form submission
    }

    // 2. Validate Zip Code
    if (!zipCodeRegex.test(cleanedZip)) {
      dispatch(
        addToast({
          message:
            "Please enter a valid US Zip Code (5-digit or 9-digit format).",
          type: "error",
        }),
      );
      return;
    }

    // 3. Validate Strong Password
    if (!passwordRegex.test(rawPassword)) {
      dispatch(
        addToast({
          message:
            "Password must be at least 8 characters long, including an uppercase letter, lowercase letter, number, and special character (@$!%*?&).",
          type: "error",
        }),
      );
      return;
    }

    // -----------------------

    const registrationPayload: UserGeneralInfoInterface = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      username: values.username.trim(),
      email: cleanedEmail,
      password: rawPassword,
      address: values.address.trim(),
      city: values.city.trim(),
      zipCode: cleanedZip,
    };

    try {
      await dispatch(registerUser(registrationPayload)).unwrap();

      dispatch(
        addToast({
          message: `Welcome aboard, ${registrationPayload.firstName}!`,
          type: "success",
        }),
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to register:", error);
      alert(
        "Please make sure you have filled out all of the fields correctly.",
      );
      // Optional: Add a toast handling backend execution rejection errors here
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
