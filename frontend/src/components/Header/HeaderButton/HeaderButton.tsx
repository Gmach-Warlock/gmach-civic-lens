import type {
  FetchResourceInterface,
  UserInterface,
} from "../../../app/interfaces/userInterfaces";
import "./HeaderButton.css";

interface HeaderButtonProps {
  auth: FetchResourceInterface<UserInterface>;
}

export default function HeaderButton({ auth }: HeaderButtonProps) {
  // Now TypeScript knows 'auth' exists and what's inside it!
  if (auth.state === "loading") {
    return (
      <button type="button" className="loading">
        ...
      </button>
    );
  }

  if (auth.data) {
    return <button type="button">{auth.data.general.username}</button>;
  }

  return <button type="button">Login</button>;
}
