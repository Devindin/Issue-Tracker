// User and profile related types
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  avatar: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
}