
import { User } from "./types";

export const seedUsers: User[] = [
  {
    id: 'u-1001',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@example.com',
    role: 'manager',
    imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.PkFenohHn8RbSMjB8E4SZwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    createdAt: new Date('2024-08-05T09:15:00Z').toISOString(),
  },
  {
    id: 'u-1002',
    name: 'Bilal Subhani',
    email: 'bilal.subhani@example.com',
    role: 'admin',
    imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.PkFenohHn8RbSMjB8E4SZwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    createdAt: new Date('2024-09-12T10:30:00Z').toISOString(),
  },
  {
    id: 'u-1003',
    name: 'Hamza Ahmed',
    email: 'hamza.ahmed@example.com',
    role: 'user',
    imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.PkFenohHn8RbSMjB8E4SZwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    createdAt: new Date('2025-02-20T14:00:00Z').toISOString(),
  },
];