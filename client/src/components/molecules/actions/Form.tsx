import { useState } from "react";
import type { FormProps } from "../../../app/interfaces/componentInterfaces";
import { useAppDispatch } from "../../../app/hooks/generalHooks";
import type { AuthStateInterface } from "../../../app/interfaces/authInterfaces";
import Input from "../../atoms/controls/Input";
import { createUser } from "../../../features/auth/thunks/createUser";
import Button from "../../atoms/controls/Button";

function Form({ formType, ...props }: FormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    address: "",
    zipCode: "",
  });

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        zipCode: "",
      });

      console.log("Success! Form cleared.");
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  const renderFormMap = {
    auth: () => (
      <form onSubmit={handleSubmit} className="register__form">
        <div className="form__row">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Jane"
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>
        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter your username"
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="civic@lens.com"
          required
        />
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Civic Way"
          required
        />
        <Input
          label="Zip Code"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          placeholder="Enter Zip Code"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
        <Button name="register button" content="Register" />
        <button type="submit" className="register__button">
          Register
        </button>
      </form>
    ),
    issue: () => (
      <form action="" onSubmit={handleSubmit} className="issue__form form">
        <h2>Report an issue in your area</h2>

        <Input name="title" label="Please input Title of Issue" />
        <Input
          name="description"
          label="Please give a brief description of the problem."
        />
        <Input
          name="location_name"
          label="Please give use the location of the Issue"
        />
        <Button
          name="issue-submit"
          content="Submit"
          className="btn--submit-form"
        />
      </form>
    ),
    comment: () => (
      <form {...props} action="">
        <div className="auth__username field ">
          <Input name="comment_name" />
        </div>
      </form>
    ),
  };

  return renderFormMap[formType];
}

export default Form;
