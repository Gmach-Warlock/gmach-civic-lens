import React, { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import { updateIssue } from "../../../features/issues/thunks/updateIssue";

import Button from "../../../components/atoms/controls/Button";
import Row from "../../../components/organisms/layout/Row";
import Column from "../../../components/organisms/layout/Column";

interface EditIssueFormProps {
  issueId: string;
  onSuccess: () => void;
}

export default function EditIssueForm({
  issueId,
  onSuccess,
}: EditIssueFormProps) {
  const dispatch = useAppDispatch();
  // Fetch current issue data from Redux to pre-fill the form
  const issue = useAppSelector(
    (state) => state.issues.general.entities?.[issueId],
  );

  const [title, setTitle] = useState(issue?.general.title || "");
  const [description, setDescription] = useState(
    issue?.general.description || "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      updateIssue({ id: issueId, title, description }),
    );

    // 2. Only close if the action succeeded
    if (updateIssue.fulfilled.match(result)) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <Column className="gap-3">
        <input
          className="w-full p-2 bg-glass-dark rounded-sm border border-glass-light text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Issue Title"
        />
        <textarea
          className="w-full p-2 bg-glass-dark rounded-sm border border-glass-light text-white"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Issue Description"
        />
        <Row className="justify-end">
          <Button type="submit" content="Save Changes" name="save-edit" />
        </Row>
      </Column>
    </form>
  );
}
