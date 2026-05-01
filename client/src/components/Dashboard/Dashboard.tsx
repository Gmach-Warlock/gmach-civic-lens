import { useAppSelector } from "../../app/hooks/generalHooks";
import { selectUser } from "../../features/user/selectors/userSelectors";
import "./Dashboard.css";

export default function Dashboard() {
  const user = useAppSelector(selectUser);

  return (
    <div className="dashboard card--light">
      <h2>Welcome Back {user.general.firstName ?? "User"}</h2>
      <button
        type="button"
        className="btn btn--report"
        onClick={() => console.log(user)}
      >
        Report
      </button>
    </div>
  );
}
