import { User } from './types';
import { seedUsers } from './users.seed';

class InMemoryDB {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
    this.initialize();
  }

  private initialize() {
    seedUsers.forEach(user => this.users.set(user.id, user));
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const id = `u-${Date.now()}`;
    const newUser: User = {
      ...userData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  updateUser(id: string, userData: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }
}

export const db = new InMemoryDB();