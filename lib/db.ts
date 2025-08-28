import { User } from "./types";
import { seedUsers } from "./users.seed";

let users: User[] = [...seedUsers];

export const getUsers = () => users;

export const getUser = (id: string) =>
  users.find((u) => u.id === id);

export const addUser = (user: User) => {
  users.push(user);
};

export const updateUser = (id: string, updated: User) => {
  users = users.map((u) => (u.id === id ? updated : u));
};

export const deleteUser = (id: string) => {
  users = users.filter((u) => u.id !== id);
};
