import { Form } from "../components/molecules/actions/Form";
import type { FieldConfig } from "../app/interfaces/componentInterfaces";

function Settings() {
  const settingsFields: FieldConfig[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter your username",
      required: true,
      gridClass: "grid-col-6",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "you@example.com",
      required: true,
      gridClass: "grid-col-6",
    },
    {
      name: "theme",
      label: "Preferred Theme",
      type: "select",
      required: true,
      options: [
        { label: "Light Mode", value: "light" },
        { label: "Dark Mode", value: "dark" },
        { label: "System Default", value: "system" },
      ],
      gridClass: "grid-col-12",
    },
    {
      name: "bio",
      label: "Bio / Description",
      type: "textarea",
      placeholder: "Tell us about yourself...",
      gridClass: "grid-col-12",
    },
  ];

  const handleSettingsSubmit = async (formValues: Record<string, string>) => {
    try {
      console.log("Settings submitted successfully:", formValues);
      // Your API request goes here
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  return (
    <div className="settings-page-container">
      <Form
        title="Account Settings"
        fields={settingsFields}
        submitButtonText="Save Changes"
        onSubmit={handleSettingsSubmit}
        className="civic-lens-settings"
      />
    </div>
  );
}

export default Settings;
