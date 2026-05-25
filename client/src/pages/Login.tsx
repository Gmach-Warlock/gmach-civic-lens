import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks/generalHooks";
import {
  selectAccessToken,
  selectUser,
} from "../features/auth/selectors/authSelectors";
import { loginUser } from "../features/auth/thunks/loginUser";
import type { FieldConfig } from "../app/interfaces/componentInterfaces";

import { Form } from "../components/molecules/actions/Form";
import Button from "../components/atoms/controls/Button";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);

  // 1. Define fields expecting email instead of username
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

  // 2. Extract values from the reusable Form engine
  const handleFormSubmit = async (values: Record<string, string>) => {
    const loginPayload = {
      email: values.email.trim(),
      password: values.password,
    };

    try {
      const result = await dispatch(loginUser(loginPayload)).unwrap();
      console.log("Login successful:", result);

      // Note: If loginUser updates your Redux state and triggers selectAccessToken,
      // you might not even need the manual localStorage step here anymore.
      if (result.token) {
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login page">
      <div className="page__card">
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
              onClick={() => navigate("/dashboard")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
