import { useLocation, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks/generalHooks";
import {
  selectAccessToken,
  selectUser,
} from "../features/auth/selectors/authSelectors";
import { loginUser } from "../features/auth/thunks/loginUser";
import type { FieldConfig } from "../app/interfaces/componentInterfaces";

import { Form } from "../components/molecules/actions/Form";
import Button from "../components/atoms/controls/Button";

// Import your global toast action and your email regex utility 👇
import { addToast } from "../features/global/globalSlice";
import { emailRegex } from "../assets/authRegexes";
import Icon from "../components/atoms/controls/Icon";
import { useEscapeNavigation } from "../app/hooks/useEscapeNavigation";
import { selectTheme } from "../features/global/globalSelectors";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  console.log("Current Location State:", location.state);
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const theme = useAppSelector(selectTheme);
  const from = location.state?.from || "/dashboard";
  // 1. Define fields
  const loginFields: FieldConfig[] = [
    {
      name: "email",
      label: "Email",
      type: "email" as const,
      placeholder: "john.doe@example.com",
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

  const { handleCancel } = useEscapeNavigation();

  // 2. Extract values from the reusable Form engine
  const handleFormSubmit = async (values: Record<string, string>) => {
    const cleanedEmail = values.email.trim();

    // --- FRONTEND EMAIL GUARD ---
    if (!emailRegex.test(cleanedEmail)) {
      dispatch(
        addToast({
          message: "Please enter a valid email address.",
          type: "error",
        }),
      );
      return; // Stop form submission early
    }
    // ----------------------------

    const loginPayload = {
      email: cleanedEmail,
      password: values.password,
    };

    try {
      const result = await dispatch(loginUser(loginPayload)).unwrap();
      console.log("Login successful:", result);

      if (result.token) {
        localStorage.setItem("token", result.token);

        // Trigger a friendly toast notification using the user's name from the response payload
        dispatch(
          addToast({
            message: `Welcome back, ${result.user?.firstName || "User"}!`,
            type: "success",
          }),
        );

        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
      // Optional: Add an error toast for invalid login credentials here
      dispatch(
        addToast({
          message: "Invalid email or password. Please try again.",
          type: "error",
        }),
      );
    }
  };

  return (
    <div className={`login page page--${theme}`}>
      <div className="page__card form">
        <Icon name="x" onClick={handleCancel} className="icon--close" />
        <h2 className="page__title">
          {accessToken ? `Welcome back, ${user.general.firstName}!` : "Login"}
        </h2>

        {!accessToken ? (
          <Form
            fields={loginFields}
            submitButtonText="Login"
            onSubmit={handleFormSubmit}
            className="login__form"
          />
        ) : (
          <div className="success-overlay">
            <p>You are logged in.</p>
            <Button
              type="button"
              name="goto-dashboard"
              content="Go to Dashboard"
              variant="success"
              onClick={() => navigate(from, { replace: true })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
