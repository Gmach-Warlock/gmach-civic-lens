import { useNavigate } from "react-router";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../../features/auth/selectors/authSelectors";
import { addToast } from "../../../features/global/globalSlice";

export default function Cta() {
  const accessToken = useAppSelector(selectAccessToken);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleReport = () => {
    if (!accessToken) {
      dispatch(
        addToast({
          message: "Please log in to submit an infrastructure report.",
          type: "info",
        }),
      );

      // Attach the "sticky note" here
      navigate("/login", { state: { from: "/report" } });
    } else {
      navigate("/report");
    }
  };
  return (
    <div className="cta">
      <button type="button" className="btn btn--cta" onClick={handleReport}>
        Report!
      </button>
    </div>
  );
}
