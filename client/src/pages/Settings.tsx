import { useDispatch, useSelector } from "react-redux";
import { Form } from "../components/molecules/actions/Form";
import type { RootState, AppDispatch } from "../app/store/store";
import type { FieldConfig } from "../app/interfaces/componentInterfaces";
import { updateUserDetails } from "../features/auth/thunks/updateUser";
import { addToast } from "../features/global/globalSlice";
import { selectUserTheme } from "../features/auth/selectors/authSelectors";
import { emailRegex, passwordRegex, zipCodeRegex } from "../assets/authRegexes";
import { useNavigate } from "react-router";

function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { general } = useSelector((state: RootState) => state.auth.user);
  const currentTheme = useSelector(selectUserTheme); 
  const settingsFields: FieldConfig[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: general.username,
      gridClass: "grid-col-6",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: general.email,
      gridClass: "grid-col-6",
    },
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: general.firstName || "Enter first name",
      gridClass: "grid-col-6",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: general.lastName || "Enter last name",
      gridClass: "grid-col-6",
    },
    {
      name: "address",
      label: "Street Address",
      type: "text",
      placeholder: general.address || "123 Civic Way",
      gridClass: "grid-col-12",
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: general.city || "City",
      gridClass: "grid-col-8",
    },
    {
      name: "zipCode",
      label: "Zip Code",
      type: "text",
      placeholder: general.zipCode || "12345",
      gridClass: "grid-col-4",
    },
    {
      name: "theme",
      label: "Preferred Theme",
      type: "select",
      placeholder: currentTheme,
      options: [
        { label: "Light Mode", value: "light" },
        { label: "Dark Mode", value: "dark" },
        { label: "System Default", value: "system" },
      ],
      gridClass: "grid-col-12",
    },
    {
      name: "password",
      label: "New Password (Leave blank to keep current)",
      type: "password",
      placeholder: "••••••••",
      gridClass: "grid-col-12",
    },
  ];

  const handleSettingsSubmit = async (formValues: Record<string, string>) => {
    // Filter out empty strings
    const updates = Object.fromEntries(
      Object.entries(formValues).filter((entry) => entry[1].trim() !== ""),
    );

    if (Object.keys(updates).length === 0) {
      dispatch(addToast({ message: "No changes to save.", type: "info" }));
      navigate("/dashboard");
      return;
    }

    // --- FRONTEND GUARDS ---
    if (updates.email && !emailRegex.test(updates.email.trim())) {
      dispatch(addToast({ message: "Invalid email format.", type: "error" }));
      return;
    }

    if (updates.zipCode && !zipCodeRegex.test(updates.zipCode.trim())) {
      dispatch(
        addToast({ message: "Invalid US Zip Code format.", type: "error" }),
      );
      return;
    }

    if (updates.password && !passwordRegex.test(updates.password)) {
      dispatch(
        addToast({
          message: "Password does not meet requirements.",
          type: "error",
        }),
      );
      return;
    }

    try {
      await dispatch(updateUserDetails(updates)).unwrap();
      dispatch(
        addToast({ message: "Profile updated successfully!", type: "success" }),
      );
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Update failed";
      dispatch(addToast({ message: errorMessage, type: "error" }));
    }
  };

  return (
    <div className="settings-page-container">
      <Form
        title="Update Personal Information"
        fields={settingsFields}
        submitButtonText="Save Changes"
        onSubmit={handleSettingsSubmit}
        className="civic-lens-settings"
      />
    </div>
  );
}

export default Settings;
