import { useRef, type FormEvent } from "react";
import Input from "../../atoms/controls/Input"; // Adjust paths to match your folder structure
import Button from "../../atoms/controls/Button";
import Row from "../../organisms/layout/Row";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  className = "",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch && inputRef.current) {
      onSearch(inputRef.current.value);
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
          content="Search"
          variant="primary"
          className="search-bar__button"
        />
      </Row>
    </form>
  );
}
