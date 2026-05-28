import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks/generalHooks";
import {
  selectAccessToken,
  selectUser,
} from "../features/auth/selectors/authSelectors";
import Heading from "../components/atoms/elements/Heading";
import { useEffect, useState } from "react"; // 👈 Added useState
import { getIssues } from "../features/issues/thunks/getIssues";
import Button from "../components/atoms/controls/Button";
import { selectTheme } from "../features/global/globalSelectors";
import Column from "../components/organisms/layout/Column";
import Row from "../components/organisms/layout/Row";
import { upvoteIssue } from "../features/issues/thunks/upvoteIssue";
import { postComment } from "../features/issues/thunks/postComment";
import Icon from "../components/atoms/controls/Icon";
import { formatRelativeTime } from "../app/utils/formattingUtils";
import Overlay from "../components/organisms/sections/Overlay";
import EditIssueForm from "../components/molecules/actions/EditIssueForm";
import { addToast } from "../features/global/globalSlice";

export default function Dashboard() {
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const issues = useAppSelector((state) => state.issues.general.issues);
  const theme = useAppSelector(selectTheme);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Track which issue card is opening the comment overlay
  const [activeCommentIssueId, setActiveCommentIssueId] = useState<
    string | null
  >(null);

  const [commentText, setCommentText] = useState<string>("");
  const [activeEditIssueId, setActiveEditIssueId] = useState<string | null>(
    null,
  );

  const issueStatus = useAppSelector(
    (state) => state.issues.state.loadingState,
  );
  const authStatus = useAppSelector((state) => state.auth.loadingState.state);

  useEffect(() => {
    console.log("Effect triggered by status or message change");
    dispatch(getIssues());

    // Adding the messages here ensures that every time a thunk finishes
    // and writes a "Success" message to the state, this effect fires.
  }, [dispatch, authStatus, issueStatus]);

  const handleReport = () => {
    if (!accessToken) {
      // 1. Dispatch to your custom Redux toast system
      dispatch(
        addToast({
          message: "Please login to report an infrastructure issue.",
          type: "error",
        }),
      );

      // 2. Navigate and "remember" where the user wanted to go
      navigate("/login", { state: { from: "/report" } });
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

  const handleSubmitComment = async () => {
    if (!activeCommentIssueId || !commentText.trim()) return;

    // Dispatch the thunk with your payload contract
    await dispatch(
      postComment({
        issueId: activeCommentIssueId,
        content: commentText.trim(),
      }),
    );

    // Clear text state and collapse the modal overlay seamlessly
    setCommentText("");
    setActiveCommentIssueId(null);
  };

  // Find the currently selected issue to display its title in the overlay header
  const selectedIssue = issues.find(
    (img) => img.meta.id === activeCommentIssueId,
  );

  return (
    <div
      className={`dashboard card--${theme}`}
      key={`${issues.length}-${authStatus}-${issueStatus}`}
    >
      {/* Sidebar */}
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

      {/* Main Column */}
      <Column className="dashboard__main-column" variant="centered">
        <Heading
          size={2}
          color="primary"
          headingStyle="basic"
          content={`Welcome Back ${user?.general?.firstName ?? "User"}!`}
          className="dashboard__heading text-center"
        />

        {/* Issues Feed */}
        <Heading
          size={3}
          color="primary"
          headingStyle="basic"
          content="Local Issues"
        />

        {issues.map((issue) => {
          const isOwner = user?.meta.id === issue.meta.authorId;

          return (
            /* Issue */
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
                <Button
                  name="check"
                  type="button"
                  className="w-fit btn--vote"
                  content="Upvote"
                  onClick={() => handleUpvote(issue.meta.id)}
                />
              </Row>

              {/* Description */}
              <p className="my-3 text-sm leading-relaxed">
                {issue.general.description}
              </p>

              {/* Location */}
              <Row
                gap={4}
                className="mb-2 text-sm opacity-80"
                variant="between"
              >
                <span>City: {issue.location.city}📍</span>
                <span>Zip: {issue.location.zipCode}</span>
              </Row>

              {/* Author */}
              <Row
                gap={4}
                className="mb-2 text-sm opacity-80"
                variant="between"
              >
                <span>Author: {issue.meta.authorName}</span>
                <span>Created {formatRelativeTime(issue.meta.createdAt)}</span>
              </Row>

              {/* Status */}
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

              {/* Urgency */}
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

                <span>
                  Upvotes: {issue.social.upvotes}{" "}
                  <Icon
                    name="check"
                    variant="regular"
                    className="w-fit btn"
                    size="sm"
                    onClick={() => handleUpvote(issue.meta.id)}
                  />
                </span>
              </Row>

              {/* Edit (Original Author only) */}
              {isOwner && (
                <Button
                  name="Edit"
                  type="button"
                  content="Modify"
                  onClick={() => setActiveEditIssueId(issue.meta.id)} // This keeps the user on the dashboard!
                  className="btn--secondary"
                />
              )}

              {/* Comments */}
              <Column
                className="comments-section mt-4 pt-3 border-t border-glass-light w-full items-center"
                variant="centered"
              >
                <Heading
                  size={4}
                  color="primary"
                  headingStyle="basic"
                  content="Discussion"
                  className="my-1 text-xs opacity-70 uppercase tracking-wider"
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
                {/* 1. Trigger Overlay with Issue ID when clicking the plus button 👇 */}
                <Icon
                  name="plus"
                  className="btn w-fit my-2 cursor-pointer"
                  onClick={() => setActiveCommentIssueId(issue.meta.id)}
                />
              </Column>
            </div>
          );
        })}
      </Column>

      <Overlay
        isOpen={activeEditIssueId !== null}
        onClose={() => setActiveEditIssueId(null)}
        title="Modify Issue"
      >
        {activeEditIssueId && ( // <-- TypeScript usually catches this, but sometimes needs help
          <EditIssueForm
            issueId={activeEditIssueId}
            onSuccess={() => setActiveEditIssueId(null)}
          />
        )}
        <div className="p-4">
          {/* You can now drop your <EditIssueForm /> here once you build it! */}
          <p className="text-sm opacity-80">
            Editing issue: {activeEditIssueId}
          </p>
          {activeEditIssueId && (
            <EditIssueForm
              issueId={activeEditIssueId}
              onSuccess={() => setActiveEditIssueId(null)}
            />
          )}
          {/* Your form goes here */}
        </div>
      </Overlay>

      {/* 2. OVERLAY MANAGEMENT MOUNTED AT THE ROOT LAYER */}
      <Overlay
        isOpen={activeCommentIssueId !== null}
        onClose={() => {
          setActiveCommentIssueId(null);
          setCommentText(""); // Reset text if they abandon the modal
        }}
        title={`Add Comment: ${selectedIssue?.general.title || ""}`}
      >
        <div className="p-2">
          <p className="text-sm opacity-80 mb-4">
            Post a public comment regarding this infrastructure item.
          </p>

          {/* 3. Bind the textarea value and onChange handler 👇 */}
          <textarea
            className="w-full p-2 bg-glass-dark rounded-sm border border-glass-light text-sm focus:outline-none focus:border-secondary text-white"
            rows={4}
            placeholder="Type your feedback here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <Row className="justify-end mt-3">
            {/* 4. Link the button directly to the submit handler 👇 */}
            <Button
              name="submit-comment"
              type="button"
              content="Post Comment"
              onClick={handleSubmitComment}
              disabled={!commentText.trim()} // Lock button if input is completely empty
            />
          </Row>
        </div>
      </Overlay>
    </div>
  );
}
