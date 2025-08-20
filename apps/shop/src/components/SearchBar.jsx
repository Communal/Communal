import { SearchIcon } from "lucide-react";

export default function SearchBar({ search, setSearch, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center bg-[#ddd] rounded-xl px-4 py-2.5">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-lg text-gray-700 placeholder:text-gray-500"
          placeholder="Enter search term..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
        <button type="submit" className="ml-2" aria-label="Search">
          <SearchIcon className="text-foreground size-5" />
        </button>
      </div>
    </form>
  );
}
