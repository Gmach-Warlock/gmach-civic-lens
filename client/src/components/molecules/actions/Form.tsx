import { useState } from "react";
import type { FormProps } from "../../../app/interfaces/componentInterfaces";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import type { AuthStateInterface } from "../../../app/interfaces/authInterfaces";
import Input from "../../atoms/controls/Input";
import { registerUser } from "../../../features/auth/thunks/registerUser";
import Button from "../../atoms/controls/Button";
import type { IssueInterface } from "../../../app/interfaces/issuesInterfaces";
import { selectUser } from "../../../features/auth/selectors/authSelectors";
import type { CategoryType } from "../../../app/types/issuesTypes";

function Form({ formType, ...props }: FormProps) {
  const user = useAppSelector(selectUser);

  const [formData, setFormData] = useState({
    auth: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      address: "",
      city: "",
      zipCode: "",
    },
    issues: {
      title: "",
      description: "",
      category: "",
      locationName: "",
      comment: "",
    },
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
          firstName: `${formData.auth.firstName}`.trim(),
          lastName: `${formData.auth.lastName}`.trim(),
          username: formData.auth.username,
          email: formData.auth.email,
          password: formData.auth.password,
          address: formData.auth.address,
          city: formData.auth.city,
          zipCode: formData.auth.zipCode,
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

    const newIssueObject: IssueInterface = {
      meta: {
        id: "",
        authorId: "",
        authorName: user.general.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      general: {
        title: formData.issues.title,
        description: formData.issues.description,
        category: formData.issues.category as CategoryType,
      },
      location: {
        address: formData.issues.locationName,
        city: formData.issues.locationName,
        zipCode: "",
        coords: { lat: 0, lng: 0 },
      },
      status: {
        isOpen: true,
        current: "tbd",
        urgency: "low",
        lastActionDate: new Date().toISOString(),
      },
      social: {
        upvotes: 0,
        tags: [],
        comments: [],
      },
    };

    try {
      await dispatch(registerUser(newAuthStateObject.user)).unwrap();

      setFormData({
        auth: {
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          address: "",
          city: "",
          zipCode: "",
        },
        issues: {
          title: "",
          description: "",
          category: "",
          locationName: "",
          comment: "",
        },
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
            value={formData.auth.firstName}
            onChange={handleChange}
            placeholder="Jane"
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.auth.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
          />
        </div>
        <Input
          label="Username"
          name="username"
          value={formData.auth.username}
          onChange={handleChange}
          placeholder="Enter your username"
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.auth.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        <Input
          label="Address"
          name="address"
          value={formData.auth.address}
          onChange={handleChange}
          placeholder="Enter your address"
          required
        />
        <Input
          label="City"
          name="city"
          value={formData.auth.city}
          onChange={handleChange}
          placeholder="Enter City"
        />
        <Input
          label="Zip Code"
          name="zipCode"
          value={formData.auth.zipCode}
          onChange={handleChange}
          placeholder="Enter Zip Code"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.auth.password}
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
        <select name="category" id="category" title="category">
          <option value="infrastructure">Infrastructure</option>
          <option value="sanitation">Sanitation</option>
          <option value="safety">Safety</option>
          <option value="other">Other</option>
        </select>
        <Input name="city" label="Please give use the city of the Issue" />
        <Button
          name="issueSubmit"
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
