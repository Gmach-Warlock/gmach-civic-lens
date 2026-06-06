import { useRef, type FormEvent } from "react";
import Button from "../../atoms/controls/Button";
import Input from "../../atoms/controls/Input";
import Row from "../../organisms/layout/Row";
import Icon from "../../atoms/controls/Icon";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  // New prop to delegate search execution
  onSearch?: (searchTerm: string) => void;
}

export default function SearchBar({
  placeholder = "Search...",
  className = "",
  onSearch, // Destructure the new prop
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchTerm = inputRef.current?.value;

    if (searchTerm !== undefined && searchTerm.trim() !== "") {
      // If parent provided a handler, use it; otherwise, do nothing or default
      if (onSearch) {
        onSearch(searchTerm);
      } else {
        console.warn("SearchBar: No onSearch handler provided");
      }
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
