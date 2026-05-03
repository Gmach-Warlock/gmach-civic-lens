import { useNavigate } from "react-router";
import type {
  FetchResourceInterface,
  UserInterface,
} from "../../../app/interfaces/authInterfaces";

interface HeaderButtonProps {
  auth: FetchResourceInterface<UserInterface>;
}

export default function HeaderButton({ auth }: HeaderButtonProps) {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

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

  return (
    <button type="button" onClick={handleLogin}>
      Login
    </button>
  );
}
