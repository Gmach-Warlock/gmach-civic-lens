import { useNavigate } from "react-router";
import { useAppSelector } from "../../app/hooks/generalHooks";
import {
  selectAccessToken,
  selectUser,
} from "../../features/auth/selectors/authSelectors";
import "./Dashboard.css";

export default function Dashboard() {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!accessToken) {
      throw new Error(
        "There has been an error. Please login again. Sorry for the inconvenience.",
      );
    } else {
      navigate("/report");
    }
  };
  return (
    <div className="dashboard card--light">
      <h2>Welcome Back {user.general.firstName ?? "User"}</h2>
      <button type="button" className="btn btn--report" onClick={handleClick}>
        Report
      </button>
    </div>
  );
}
