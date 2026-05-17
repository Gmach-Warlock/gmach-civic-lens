import { useState } from "react";
import Input from "../../atoms/controls/Input";
import Button from "../../atoms/controls/Button";
import type { GenericFormProps } from "../../../app/interfaces/componentInterfaces";

export function GenericForm({
  fields,
  submitButtonText,
  onSubmit,
  title,
  className = "",
}: GenericFormProps) {
  // Initialize state dynamically based on the field names provided
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      initial[field.name] = "";
    });
    return initial;
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(values);

    // Clear form upon completion
    const cleared: Record<string, string> = {};
    fields.forEach((field) => {
      cleared[field.name] = "";
    });
    setValues(cleared);
  };

  return (
    <form onSubmit={handleFormSubmit} className={`c-form ${className}`}>
      {title && <h2>{title}</h2>}

      <div className="c-form__fields-grid">
        {fields.map((field) => {
          // If the field is a select box
          if (field.type === "select") {
            return (
              <div
                key={field.name}
                className={`c-form__field-wrapper ${field.gridClass || ""}`}
              >
                <label htmlFor={field.name}>{field.label}</label>
                <select
                  id={field.name}
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  title={field.label}
                  required={field.required}
                >
                  <option value="" disabled>
                    Select an option...
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          // 2. NEW: Intercept Textarea elements so they don't break your <Input /> types
          if (field.type === "textarea") {
            return (
              <div
                key={field.name}
                className={`c-form__field-wrapper ${field.gridClass || ""}`}
              >
                <label htmlFor={field.name}>{field.label}</label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={values[field.name]}
                  // Casting the event type if your handleChange expects HTMLInputElement
                  onChange={
                    handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                />
              </div>
            );
          }
          // Default fallback to your Atom custom Input component
          return (
            <div key={field.name} className={`${field.gridClass || ""}`}>
              <Input
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={values[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
              />
            </div>
          );
        })}
      </div>

      <Button
        name={`${submitButtonText}-submit`}
        content={submitButtonText}
        className="btn--submit-form"
      />
    </form>
  );
}
