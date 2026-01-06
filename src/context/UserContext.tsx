
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUsers, updateUser } from "@/services/mockApi";
import { User } from "@/types/user";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const saveUser = async (u: User) => {
    await updateUser(u);
    setUsers(prev => prev.map(x => x.id === u.id ? u : x));
  };

  return (
    <UserContext.Provider value={{ users, saveUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
