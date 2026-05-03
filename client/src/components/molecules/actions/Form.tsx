import type { ComponentPropsWithoutRef } from "react";
import type { InputType } from "../../atoms/controls/Input";
import Input from "../../atoms/controls/Input";

export interface InputObject {
  type: InputType;
  name: string;
}

export type FormType = "auth" | "issue" | "comment";

export interface FormProps extends ComponentPropsWithoutRef<"form"> {
  formType: FormType;
  isRegistering: boolean;
  inputs?: InputObject[];
}

function Form({ formType, isRegistering = false, ...props }: FormProps) {
  const renderFormMap = {
    auth: () => (
      <form {...props} action="">
        <div className="auth__username field ">
          <Input type="text" name="username" />

          <Input type="password" name="password" />
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </div>
        {isRegistering && (
          <div className="auth__password field">
            <Input type="email" name="email" />
          </div>
        )}
      </form>
    ),
    issue: () => (
      <form {...props} action="">
        <div className="auth__username field ">
          <Input type="text" name="username" />
          {isRegistering && <Input type="email" name="email" />}
          <Input type="password" name="password" />
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </div>
      </form>
    ),
    comment: () => (
      <form {...props} action="">
        <div className="auth__username field ">
          <Input type="text" name="username" />
          {isRegistering && <Input type="email" name="email" />}
          <Input type="password" name="password" />
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </div>
      </form>
    ),
  };

  return renderFormMap[formType];
}

export default Form;
