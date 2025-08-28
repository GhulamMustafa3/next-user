"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { seedUsers } from "@/lib/users.seed";


export interface User {
  createdAt: string | number | Date;
  id: string;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
}


interface UsersContextType {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updated: User) => void;
  deleteUser: (id: string) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([...seedUsers]);

  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const updateUser = (id: string, updated: User) =>
    setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
  const deleteUser = (id: string) =>
    setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
};


export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (!context) throw new Error("useUsers must be used within a UsersProvider");
  return context;
};
