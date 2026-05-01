import { useNavigate } from "react-router";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../../features/auth/selectors/authSelectors";
import "./Cta.css";

export default function Cta() {
  const accessToken = useAppSelector(selectAccessToken);
  const navigate = useNavigate();

  const handleReport = () => {
    if (!accessToken) {
      throw new Error("Please login or register to report an issue.");
    }
    navigate("/report");
  };

  return (
    <div className="cta">
      <button type="button" className="btn btn--cta" onClick={handleReport}>
        Report!
      </button>
    </div>
  );
}
