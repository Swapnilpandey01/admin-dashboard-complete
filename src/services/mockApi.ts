import { User } from "@/types/user";

let users: User[] = Array.from({ length: 50 }).map((_, i) => ({
  id: String(i + 1),
  name: `User ${i + 1}`,
  email: `user${i + 1}@gmail.com`,
  role: i % 4 === 0 ? "admin" : "viewer",
  status: i % 3 === 0 ? "inactive" : "active"
}));

export const fetchUsers = async (): Promise<User[]> =>
  new Promise(res => setTimeout(() => res([...users]), 300));

export const updateUser = async (u: User) => {
  users = users.map(x => x.id === u.id ? u : x);
  return u;
};
