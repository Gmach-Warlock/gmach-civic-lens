import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks/generalHooks";
import "./Login.css";
import {
  selectToken,
  selectUser,
} from "../../features/user/selectors/userSelectors";
import { loginUser } from "../../features/user/thunks/loginUser";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      console.log(result);
      if (result.token) {
        localStorage.setItem("token", result.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const formClassName = `login__form ${token ? "login__form--success" : ""}`;
  return (
    <div className="login page">
      <div className="page__card">
        <h2 className="page__title">
          {token ? `Welcome, ${user.general.firstName}!` : "Login "}
        </h2>
        <form onSubmit={handleSubmit} className={formClassName}>
          <div className="form__row"></div>

          <div className="form__group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn--login">
            Register
          </button>
        </form>
        {token && (
          <div className="success-overlay">
            <p>Your account is ready.</p>
            <button type="button" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
