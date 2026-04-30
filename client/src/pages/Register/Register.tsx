import { useState } from "react";
import "./Register.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks/generalHooks";
import { createUser } from "../../features/user/thunks/createUser";
import type { UserInterface } from "../../app/interfaces/userInterfaces";
import { useNavigate } from "react-router";
import {
  selectToken,
  selectUser,
} from "../../features/user/selectors/userSelectors";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    address: "", // Added to state
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUserObject: UserInterface = {
      user: {
        general: {
          firstName: `${formData.firstName}`.trim(),
          lastName: `${formData.lastName}`.trim(),
          username: formData.username,
          email: formData.email,
          password: formData.password,
          address: formData.address,
        },
        meta: {
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isAdmin: false,
          token: "",
        },
      },
      activity: { requests: [], comments: [] },
      loadingState: { state: "idle", message: "" },
    };
    try {
      await dispatch(createUser(newUserObject)).unwrap();

      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        address: "",
      });

      console.log("Success! Form cleared.");
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const formClassName = `register__form ${
    user ? "register__form--success" : ""
  }`;
  return (
    <div className="register__page">
      <div className="page__card">
        <h2 className="register__title">
          {token ? `Welcome, ${user.general.firstName}!` : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} className={formClassName}>
          <div className="form__row">
            <div className="form__group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jane"
                required
              />
            </div>
            <div className="form__group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

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
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="civic@lens.com"
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Civic Way"
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

          <button type="submit" className="register__button">
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
