import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks/generalHooks";
import {
  selectAccessToken,
  selectUser,
} from "../features/auth/selectors/authSelectors";
import Heading from "../components/atoms/elements/Heading";
import { useEffect } from "react";
import { getIssues } from "../features/issues/thunks/getIssues";
import { selectIssues } from "../features/issues/selectors/issuesSelectors";

export default function Dashboard() {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const issues = useAppSelector(selectIssues);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getIssues());
  }, [dispatch]);
  console.log(issues);
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
      <Heading
        size={2}
        color="primary"
        headingStyle="basic"
        content={`Welcome Back ${user.general.firstName ?? "User"}!`}
      />
      <Heading
        size={3}
        color="primary"
        headingStyle="basic"
        content="Here are the Current Issues."
      />

      <button type="button" className="btn btn--report" onClick={handleClick}>
        Report
      </button>
    </div>
  );
}
