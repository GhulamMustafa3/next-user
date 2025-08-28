import { User } from './types';

export const seedUsers: User[] = [
  {
    id: 'u-1001',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@example.com',
    role: 'manager',
    imageUrl: 'https://i.pravatar.cc/150?img=47',
    createdAt: new Date('2024-08-05T09:15:00Z').toISOString(),
  },
  {
    id: 'u-1002',
    name: 'Bilal Subhani',
    email: 'bilal.subhani@example.com',
    role: 'admin',
    imageUrl: 'https://i.pravatar.cc/150?img=12',
    createdAt: new Date('2024-09-12T10:30:00Z').toISOString(),
  },
  {
    id: 'u-1003',
    name: 'Hamza Ahmed',
    email: 'hamza.ahmed@example.com',
    role: 'user',
    imageUrl: 'https://i.pravatar.cc/150?img=33',
    createdAt: new Date('2025-02-20T14:00:00Z').toISOString(),
  },
];