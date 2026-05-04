import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";
import type { InputType } from "../../../app/types/componentTypes";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  type?: InputType; // Now optional!
  name: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", name, label, placeholder, className, ...props }, ref) => {
    const generatedId = useId();

    // BEM Naming Strategy
    const bemName = `${name}--${type}`;
    const uniqueId = props.id || `${bemName}--${generatedId}`;
    const baseClass = "input-field";
    const typeModifier = `input-field--${type}`;
    const nameModifier = `input-field--${name}`;
    return (
      <div className="form__group">
        {label && (
          <label htmlFor={uniqueId} className="input-label">
            {label}
          </label>
        )}

        <input
          {...props}
          ref={ref}
          id={uniqueId}
          type={type}
          name={name}
          title={bemName}
          placeholder={placeholder}
          className={`${baseClass} ${typeModifier} ${nameModifier} ${
            className ?? ""
          }`}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
