import { useState } from "react";
import type { FormProps } from "../../../app/interfaces/componentInterfaces";
import { useAppDispatch } from "../../../app/hooks/generalHooks";
import type { AuthStateInterface } from "../../../app/interfaces/authInterfaces";
import Input from "../../atoms/controls/Input";
import { createUser } from "../../../features/auth/thunks/createUser";

function Form({ formType, isRegistering = false, ...props }: FormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    address: "",
    zipCode: 0,
  });

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /*   const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Define actions based on formType
  const submitActions: Record<string, () => Promise<void>> = {
    auth: async () => {
      const payload = {
        general: { ...formData }, // simplify mapping
        meta: { createdAt: new Date().toISOString() }
      };
      await dispatch(createUser(payload)).unwrap();
    },
    issue: async () => {
      // await dispatch(createIssue(formData)).unwrap();
    },
    comment: async () => {
      // await dispatch(postComment(formData)).unwrap();
    }
  };

  try {
    const action = submitActions[formType];
    if (action) {
      await action();
      // Optional: Success logic (toast, clear form, etc.)
      console.log(`${formType} submitted successfully`);
    }
  } catch (error) {
    console.error(`Error submitting ${formType}:`, error);
  }
}; */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newAuthStateObject: AuthStateInterface = {
      user: {
        general: {
          firstName: `${formData.firstName}`.trim(),
          lastName: `${formData.lastName}`.trim(),
          username: formData.username,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          zipCode: formData.zipCode,
        },
        meta: {
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          isAdmin: false,
          accessToken: "",
          refreshToken: "",
        },
        comments: [],
      },
      activity: { requests: [], comments: [] },
      loadingState: { state: "idle", message: "" },
    };
    try {
      await dispatch(createUser(newAuthStateObject.user)).unwrap();

      setFormData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        address: "",
        zipCode: 0,
      });

      console.log("Success! Form cleared.");
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  const renderFormMap = {
    auth: () => (
      <form onSubmit={handleSubmit} className={`register__form `}>
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
          <label htmlFor="zipCode">Zip Code</label>
          <input
            type="number"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
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
    ),
    issue: () => (
      <form {...props} action="">
        <div className="auth__username field ">
          <Input type="text" name="username" />
          {isRegistering && <Input type="email" name="email" />}
          <Input type="password" name="password" />
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </div>
      </form>
    ),
    comment: () => (
      <form {...props} action="">
        <div className="auth__username field ">
          <Input type="text" name="username" />
          {isRegistering && <Input type="email" name="email" />}
          <Input type="password" name="password" />
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </div>
      </form>
    ),
  };

  return renderFormMap[formType];
}

export default Form;
