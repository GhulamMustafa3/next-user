export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  imageUrl: string;
  createdAt: string;
}

export type UserFormData = Omit<User, 'id' | 'createdAt'>;