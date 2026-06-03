import { useRef, type FormEvent } from "react";
import Button from "../../atoms/controls/Button";
import Input from "../../atoms/controls/Input";
import Row from "../../organisms/layout/Row";
import Icon from "../../atoms/controls/Icon";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void; // New prop for orchestration
}

export default function SearchBar({
  placeholder = "Search...",
  className = "",
  onSearch,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputRef.current?.value;

    if (query !== undefined && onSearch) {
      onSearch(query);
      console.log("Search orchestrated from parent:", query);
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
