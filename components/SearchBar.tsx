"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

type UserSearchProps = {
  onSearch: (filters: {
    name: string;
    email: string;
    age: string;
    role: string;
  }) => void;
};

export default function UserSearch({ onSearch }: UserSearchProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("");

  // 🔎 Search handler
  const handleSearch = () => {
    onSearch({
      name: name.trim(),
      email: email.trim(),
      age: age.trim(),
      role,
    });
  };

  // ❌ Clear all filters
  const handleClear = () => {
    setName("");
    setEmail("");
    setAge("");
    setRole("");
    onSearch({
      name: "",
      email: "",
      age: "",
      role: "",
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-200">
      {/* Name filter */}
      <div className="flex items-center flex-1 bg-gray-50 rounded-md px-3 py-2 border border-gray-300 relative">
        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {name && (
          <button
            type="button"
            onClick={() => setName("")}
            className="absolute right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Email filter */}
      <div className="flex items-center flex-1 bg-gray-50 rounded-md px-3 py-2 border border-gray-300 relative">
        <input
          type="text"
          placeholder="Search by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
        {email && (
          <button
            type="button"
            onClick={() => setEmail("")}
            className="absolute right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Age filter */}
      <div className="flex items-center w-28 bg-gray-50 rounded-md px-3 py-2 border border-gray-300">
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>

      {/* Role filter */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All roles</option>
        <option value="user">User</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
