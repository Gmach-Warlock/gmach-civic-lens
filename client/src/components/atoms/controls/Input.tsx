import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";
import type { InputType } from "../../../app/types/componentTypes";

// 1. Match your FieldConfig options interface
interface SelectOption {
  value: string;
  label: string;
}

// 2. Extend ComponentPropsWithoutRef safely by omitting overlapping attributes
interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  type?: InputType;
  name: string;
  label?: string;
  options?: SelectOption[]; // Added the strongly-typed options property
}

// Keep the ref type as a union so containers can pass a single ref type down
const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputProps
>(
  (
    { type = "text", name, label, placeholder, className, options, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const bemName = `${name}--${type}`;
    const uniqueId = props.id || `${bemName}--${generatedId}`;

    const baseClass = "input-field";
    const typeModifier = `input-field--${type}`;
    const nameModifier = `input-field--${name}`;
    const fullClassName = `${baseClass} ${typeModifier} ${nameModifier} ${className ?? ""}`;

    return (
      <div className="form__group">
        {label && (
          <label htmlFor={uniqueId} className="input-label">
            {label}
          </label>
        )}

        {/* 1. Handle Textareas */}
        {type === "textarea" && (
          <textarea
            {...(props as unknown as ComponentPropsWithoutRef<"textarea">)}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={uniqueId}
            name={name}
            placeholder={placeholder}
            className={fullClassName}
          />
        )}

        {/* 2. Handle Select Boxes */}
        {type === "select" && (
          <select
            {...(props as unknown as ComponentPropsWithoutRef<"select">)}
            ref={ref as React.Ref<HTMLSelectElement>}
            id={uniqueId}
            name={name}
            className={fullClassName}
            value={props.value}
          >
            <option value="" disabled>
              Select an option...
            </option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* 3. Handle Standard Inputs */}
        {type !== "textarea" && type !== "select" && (
          <input
            {...(props as ComponentPropsWithoutRef<"input">)}
            ref={ref as React.Ref<HTMLInputElement>}
            id={uniqueId}
            type={type as ComponentPropsWithoutRef<"input">["type"]}
            name={name}
            title={bemName}
            placeholder={placeholder}
            className={fullClassName}
          />
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
