import { type InputHTMLAttributes, useId } from "react";

interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string; // For screen readers / accessibility
  className?: string; // Allow overrides from future projects
}

function Switch({
  checked,
  onChange,
  label = "Toggle switch",
  className = "",
  id,
  ...props
}: SwitchProps) {
  // 1. Generate a stable, unique ID for this instance of the component
  const defaultId = useId();
  // 2. Fall back to it if an explicit ID wasn't passed in via props
  const switchId = id || defaultId;

  return (
    <div className={`switch ${className}`}>
      <input
        type="checkbox"
        id={switchId}
        className="switch__input"
        checked={checked}
        onChange={onChange}
        aria-label={label}
        {...props}
      />
      <label htmlFor={switchId} className="switch__track">
        <span className="switch__thumb" />
      </label>
    </div>
  );
}

export default Switch;
