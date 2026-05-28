import { useRef, type FormEvent } from "react";
import { searchIssues } from "../../../features/issues/thunks/searchIssues";
import Button from "../../atoms/controls/Button";
import Input from "../../atoms/controls/Input";
import Row from "../../organisms/layout/Row";
import Icon from "../../atoms/controls/Icon";
import { useAppDispatch } from "../../../app/hooks/generalHooks";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch(); // 3. Initialize dispatch

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current?.value !== undefined) {
      // 4. Dispatch the search action
      dispatch(searchIssues(inputRef.current.value));
      console.log("searching");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`search-bar-form ${className}`.trim()}
    >
      <Row variant="centered" className="search-bar-wrapper">
        <Input
          ref={inputRef}
          name="search"
          type="text"
          placeholder={placeholder}
          className="search-bar__input"
        />

        <Button
          type="submit"
          name="search-submit"
          className="search-bar__button"
        >
          <Icon name="magnifying-glass" />
        </Button>
      </Row>
    </form>
  );
}
