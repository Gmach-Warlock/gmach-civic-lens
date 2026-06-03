import { useLocation, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks/generalHooks";
import { loginUser } from "../features/auth/thunks/loginUser";
import type { FieldConfig } from "../app/interfaces/componentInterfaces";
import Icon from "../components/atoms/controls/Icon";
import Button from "../components/atoms/controls/Button";
import { Form } from "../components/molecules/actions/Form";
import { addToast } from "../features/global/globalSlice";
import { emailRegex } from "../assets/authRegexes";
import ImpulseLine from "../components/atoms/elements/ImpulseLine";
import { selectTheme } from "../features/global/globalSelectors";
import { useFormEscape } from "../app/hooks/useFormEscape";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const from = location.state?.from || "/dashboard";
  const theme = useAppSelector(selectTheme);
  const { handleCancel } = useFormEscape();

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

  const handleFormSubmit = async (values: Record<string, string>) => {
    const cleanedEmail = values.email.trim();

    if (!emailRegex.test(cleanedEmail)) {
      dispatch(
        addToast({
          message: "Please enter a valid email address.",
          type: "error",
        }),
      );
      return;
    }

    try {
      const result = await dispatch(
        loginUser({ email: cleanedEmail, password: values.password }),
      ).unwrap();
      if (result.token) {
        localStorage.setItem("token", result.token);
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
      dispatch(
        addToast({ message: "Invalid email or password.", type: "error" }),
      );
    }
  };

  return (
    <div className={`login page--${theme}`}>
      <div className="page__card card--form">
        <Icon name="x" className="icon--close" onClick={handleCancel} />
        <h2 className="page__title">Login</h2>

        {/* Animated Subtitle Hook */}
        <div className="login__subtitle">
          <p className="login__subtitle-text">Empowering civic action.</p>
        </div>

        <Form
          fields={loginFields}
          submitButtonText="Login"
          onSubmit={handleFormSubmit}
          className="login__form"
        />

        {/* CTA for New Users */}
        <div className="login__register-cta">
          <ImpulseLine
            message="New to Civic Lens?"
            className="login__cta-text"
            delay={0.6}
            animation={{
              opacity: 0,
              y: 10,
              // This function runs for every letter (index i)
              color: (i: number) => {
                const colors = [
                  "#FF5733",
                  "#33FF57",
                  "#3357FF",
                  "#F333FF",
                  "#FF33A1",
                  "#33FFF5",
                ];
                return colors[i % colors.length];
              },
              duration: 1.2,
              ease: "back.out(2)",
            }}
          />
          <Button
            type="button"
            name="register-redirect"
            variant="secondary" // Or whatever variant fits your "ghost" style
            onClick={() => navigate("/register")}
            className="login__register-btn"
          >
            Create an account
          </Button>
        </div>
      </div>
    </div>
  );
}
