// SearchInput.tsx
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  handleSearch: (term: string) => void;
  label: string;
}

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  handleSearch,
  label,
}: SearchInputProps) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  return (
    <div className={`mr-0 relative ${isSearchFocused ? "w-full" : "w-auto"}`}>
      <div className="hidden md:block">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={`Search...`}
          className="w-full rounded-lg bg-background pl-8"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>
      {!isSearchFocused ? (
        <Button
          variant={"outline"}
          className="block md:hidden p-2"
          onClick={() => setIsSearchFocused(true)}
        >
          <Search size={14} className="cursor-pointer text-muted-foreground" />
        </Button>
      ) : (
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search...`}
            className="w-full rounded-lg bg-background pl-8"
            value={searchQuery}
            onChange={handleInputChange}
            onBlur={() => setIsSearchFocused(false)}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default SearchInput;
