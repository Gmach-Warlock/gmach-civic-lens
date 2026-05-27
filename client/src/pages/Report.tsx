import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks/generalHooks";
import { selectUser } from "../features/auth/selectors/authSelectors";
import { createIssue } from "../features/issues/thunks/createIssue";
import { FormGroup } from "../components/atoms/layout/FormGroup";
import Input from "../components/atoms/controls/Input";
import Button from "../components/atoms/controls/Button";
import type React from "react";
import type { CreateIssueRequestInterface } from "../app/interfaces/issuesInterfaces";
import type { CategoryType } from "../app/types/issuesTypes";
import { useNavigate } from "react-router";

function Report() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as CategoryType, // Explicitly typed to allow blank initial state safely
    cityName: "",
    crossStreets: "",
    lat: "",
    lng: "",
  });

  const categoryOptions = [
    { value: "Infrastructure", label: "Infrastructure" },
    { value: "Roads", label: "Roads & Potholes" },
    { value: "Utilities", label: "Utilities" },
    { value: "Sanitation", label: "Sanitation" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    const stateKey =
      name === "city-name"
        ? "cityName"
        : name === "cross-streets"
          ? "crossStreets"
          : name;

    setFormData((prev) => ({
      ...prev,
      [stateKey]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Correct type structure contract matching the thunk data layer requirements
    const issuePayload: CreateIssueRequestInterface = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      crossStreets: formData.crossStreets.trim() || undefined,
      lat: formData.lat ? Number(formData.lat) : null,
      lng: formData.lng ? Number(formData.lng) : null,
    };

    // Cleaned up the incorrect array type-casting error here:
    dispatch(createIssue(issuePayload))
      .unwrap()
      .then(() => {
        setFormData({
          title: "",
          description: "",
          category: "" as CategoryType,
          cityName: "",
          crossStreets: "",
          lat: "",
          lng: "",
        });
      })
      .catch((error) => {
        console.error("Failed to create issue:", error.message || error);
      });
    navigate("/dashboard");
  };

  return (
    <div className="report card--form">
      <form className="report__form form" onSubmit={handleSubmit}>
        <h2>Report an issue in your area</h2>
        <p>Zip: {user.general.zipCode}</p>

        <Input
          name="title"
          label="Please input Title of Issue"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Input
          type="textarea"
          name="description"
          label="Please give a brief description of the problem."
          value={formData.description}
          onChange={handleChange}
          required
        />

        <Input
          type="select"
          name="category"
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={handleChange}
          required
        />

        <FormGroup columns={2}>
          <Input
            name="city-name"
            label="City of the Issue"
            value={formData.cityName}
            onChange={handleChange}
          />
          <Input
            name="cross-streets"
            label="Cross streets"
            value={formData.crossStreets}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup columns={2}>
          <Input
            name="lat"
            label="Latitude (Optional)"
            value={formData.lat}
            onChange={handleChange}
          />
          <Input
            name="lng"
            label="Longitude (Optional)"
            value={formData.lng}
            onChange={handleChange}
          />
        </FormGroup>

        <Button
          name="issue-submit"
          content="Submit"
          className="btn--submit-form"
          type="submit"
        />
      </form>
    </div>
  );
}

export default Report;
