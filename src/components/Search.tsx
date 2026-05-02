import { useState, useEffect, useRef } from "react";
import { apiService } from "../api/apiService";
import defaultUser from "../assets/user.png";
interface User {
  id: number;
  firstName: string;
  lastName: string;
  profilePic?: string | null;
}
interface Props {
  onUserSelect: (user: User) => void;
}

const Search = ({ onUserSelect }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchUsers(query);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchUsers = async (searchText: string) => {
    try {
      setLoading(true);

      const res :any = await apiService.get(
        `/auth/user?search=${searchText}`
      );

      console.log("API DATA:", res.data); // debug

      setResults(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    console.log("Selected user:", user);
    onUserSelect(user);
    setQuery("");
    setResults([]);
  };

  // 🔥 click outside to close
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setResults([]);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative p-3 border-b">
      {/* 🔍 Input */}
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-full border-2 border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
      />

      {/* 🔥 Overlay Results */}
      {query && (
        <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-lg max-h-64 overflow-y-auto z-50">
          
          {/* Loading */}
          {loading && (
            <div className="p-3 text-sm text-gray-500">
              Searching...
            </div>
          )}

          {/* No results */}
          {!loading && results.length === 0 && (
            <div className="p-3 text-sm text-gray-500">
              No users found
            </div>
          )}

          {/* Results */}
          {!loading &&
            results.length > 0 &&
            results.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleUserSelect(user)}
              >
                <img
                  src={user.profilePic || defaultUser}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Search;