"use client";

import { createContext, useContext, useState } from "react";
import { seedUsers } from "@/lib/users.seed"; 

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([...seedUsers]); 

  const addUser = (user) => {
    setUsers((prev) => [...prev, user]);
  };

  const updateUser = (id, updated) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) throw new Error("useUsers must be used within a UsersProvider");
  return context;
};
