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
import { isValidCoordinate } from "../assets/authHelpers";

// Import your toast slice action and your text security guard 👇
import { addToast } from "../features/global/globalSlice";
import { noHtmlRegex } from "../assets/authRegexes";

function Report() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as CategoryType,
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

    // --- FRONTEND SECURITY GUARDS ---
    // Check for malicious HTML tags or basic script strings in user inputs
    if (
      noHtmlRegex.test(formData.title) ||
      noHtmlRegex.test(formData.description)
    ) {
      dispatch(
        addToast({
          message:
            "HTML or script tags are not allowed in the title or description text.",
          type: "error",
        }),
      );
      return; // Stop form submission early
    }

    // 2. New Coordinate Range Guard 🌐
    const coordCheck = isValidCoordinate(formData.lat, formData.lng);
    if (!coordCheck.isValid) {
      dispatch(
        addToast({
          message: coordCheck.error || "Invalid coordinates.",
          type: "error",
        }),
      );
      return; // Short-circuit submission
    }
    // ---------------------------------

    const issuePayload: CreateIssueRequestInterface = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      crossStreets: formData.crossStreets.trim() || undefined,
      lat: formData.lat ? Number(formData.lat) : null,
      lng: formData.lng ? Number(formData.lng) : null,
    };

    dispatch(createIssue(issuePayload))
      .unwrap()
      .then(() => {
        // 1. Fire off success notice
        dispatch(
          addToast({
            message: "Infrastructure report successfully submitted!",
            type: "success",
          }),
        );

        // 2. Clear state fields out
        setFormData({
          title: "",
          description: "",
          category: "" as CategoryType,
          cityName: "",
          crossStreets: "",
          lat: "",
          lng: "",
        });

        // 3. Move back to the feed view
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Failed to create issue:", error.message || error);

        // Fire off failure notice to inform user something went wrong on the server layer
        dispatch(
          addToast({
            message:
              error.message || "Failed to submit report. Please try again.",
            type: "error",
          }),
        );
      });
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
