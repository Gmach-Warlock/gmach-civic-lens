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
import { upvoteIssue } from "../features/issues/thunks/upvoteIssue";
import Icon from "../components/atoms/controls/Icon";
import { formatRelativeTime } from "../app/utils/formattingUtils";

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

  const handleReport = () => {
    if (!accessToken) {
      throw new Error("There has been an error. Please login again.");
    } else {
      navigate("/report");
    }
  };
  const handleAll = () => {
    if (!accessToken) {
      throw new Error("There has been an error. Please login again.");
    } else {
      console.log("handleReport test");
    }
  };
  const handleMine = () => {
    if (!accessToken) {
      throw new Error("There has been an error. Please login again.");
    } else {
      console.log("handleMine test");
    }
  };

  const handleUpvote = (issueId: string) => {
    dispatch(upvoteIssue(issueId));
  };

  return (
    <div className={`dashboard card--${theme}`}>
      <Column className="dashboard__sidebar w-full" variant="start">
        <Button
          name="Report"
          type="button"
          content="Report"
          onClick={handleReport}
          className="self-start"
        />
        <Button
          name="All Issues"
          type="button"
          content="All"
          onClick={handleAll}
        />
        <Button
          name="My Issues"
          type="button"
          content="Mine"
          onClick={handleMine}
        />
      </Column>
      <Column className="dashboard__main-column" variant="centered">
        <Heading
          size={2}
          color="primary"
          headingStyle="basic"
          content={`Welcome Back ${user?.general?.firstName ?? "User"}!`}
          className="dashboard__heading text-center"
        />

        <Heading
          size={3}
          color="primary"
          headingStyle="basic"
          content="Local Issues"
        />

        {issues.map((issue) => {
          // Guard ownership evaluation accurately matches your slice profile state keys
          const isOwner =
            user?.meta.id === issue.meta.authorId ||
            user?.meta?.id === issue.meta.authorId;

          return (
            <div
              className={`card--glass-${theme} my-4 p-4 rounded-sm w-full core-card`}
              key={issue.meta.id}
            >
              {/* Top Row: Title & Status Badge */}
              <Row className="justify-between items-center mb-2">
                <Heading
                  size={3}
                  color="primary"
                  headingStyle="basic"
                  content={issue.general.title}
                />
                <Icon
                  name="id-badge"
                  size="sm"
                  className={`icon--status-${issue.status.current.toLowerCase()}`}
                />
              </Row>

              <p className="my-3 text-sm leading-relaxed">
                {issue.general.description}
              </p>

              <Row
                gap={4}
                className="mb-2 text-sm opacity-80"
                variant="between"
              >
                <span>City: {issue.location.city}📍</span>
                <span>Zip: {issue.location.zipCode}</span>
              </Row>
              <Row
                gap={4}
                className="mb-2 text-sm opacity-80"
                variant="between"
              >
                <span>Author: {issue.meta.authorName}</span>
                <span>Created {formatRelativeTime(issue.meta.createdAt)}</span>
              </Row>

              <Row variant="between">
                <Row>
                  <span>
                    Status: {issue.status.current}{" "}
                    <Icon
                      name="id-badge"
                      size="sm"
                      className={`icon--status-${issue.status.current.toLowerCase()}`}
                    />
                  </span>
                </Row>
                <span>
                  Last updated {formatRelativeTime(issue.status.lastActionDate)}
                </span>
              </Row>
              <Row className="items-center gap-1" variant="between">
                <Row>
                  <span className="capitalize">
                    Priority: {issue.status.urgency}{" "}
                    <Icon
                      name="flag"
                      className={`icon--sm icon--urgency-${issue.status.urgency.toLowerCase()}`}
                    />
                  </span>
                </Row>
                <Button
                  name="Add"
                  type="button"
                  content="Me Too"
                  onClick={() => handleUpvote(issue.meta.id)}
                />
                <span>Upvotes: {issue.social.upvotes}</span>
              </Row>

              {isOwner && (
                <Button
                  name="Edit"
                  type="button"
                  content="Modify"
                  onClick={() => navigate(`/report/edit/${issue.meta.id}`)}
                  className="btn--secondary"
                />
              )}
              {/* --- COMMENTS SUB-SECTION --- */}
              <Column
                className="comments-section mt-4 pt-3 border-t border-glass-light w-full"
                variant="centered"
              >
                <Heading
                  size={4}
                  color="primary"
                  headingStyle="basic"
                  content="Discussion"
                  className="mb-2 text-xs opacity-70 uppercase tracking-wider"
                />

                {issue.social.comments.length === 0 ? (
                  <p className="text-xs text-center italic opacity-50">
                    No comments posted yet. Start the conversation!
                  </p>
                ) : (
                  <Column className="w-full gap-2" variant="start">
                    {issue.social.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="comment-bubble p-2 rounded-sm bg-glass-dark text-xs w-full"
                      >
                        <Row className="justify-between items-center mb-1 text-opacity-60">
                          <span className="font-bold text-secondary">
                            {comment.author
                              ? `${comment.author.firstName} ${comment.author.lastName}`
                              : "Anonymous User"}
                          </span>
                          <span className="opacity-40 scale-90">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </Row>
                        <p className="comment-content">{comment.content}</p>
                      </div>
                    ))}
                  </Column>
                )}
              </Column>
            </div>
          );
        })}
      </Column>
    </div>
  );
}
