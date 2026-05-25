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
import Button from "../components/atoms/controls/Button";
import { selectTheme } from "../features/global/globalSelectors";
import Column from "../components/organisms/layout/Column";
import Row from "../components/organisms/layout/Row";

export default function Dashboard() {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const issues = useAppSelector(selectIssues);
  const theme = useAppSelector(selectTheme);
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
    <div className={`dashboard card--theme-${theme}`}>
      <Row>
        <Heading
          size={2}
          color="primary"
          headingStyle="basic"
          content={`Welcome Back ${user.general.firstName ?? "User"}!`}
          className="place-self-center"
        />

        <Button
          name="Report"
          type="button"
          content="Report"
          onClick={handleClick}
          className="justify-self-end"
        />
      </Row>
      <Column>
        <Heading
          size={3}
          color="primary"
          headingStyle="basic"
          content="Local Issues"
        />

        {issues.map((issue) => (
          <div
            className={`card--${theme} my-2 p-4 rounded-sm`}
            key={issue.meta.id}
          >
            <Heading
              size={3}
              color="primary"
              headingStyle="basic"
              content={issue.general.title}
            />
            <Row>
              <span>{issue.location.city}</span>
              <span>{issue.location.zipCode}</span>
            </Row>
            <p>{issue.general.description}</p>
            <p>{issue.status.current}</p>
            <p>{issue.status.urgency}</p>
            <span>Upvotes: {issue.social.upvotes}</span>
            <Button name="Add" type="button" content="Me Too" />
          </div>
        ))}
      </Column>
    </div>
  );
}
