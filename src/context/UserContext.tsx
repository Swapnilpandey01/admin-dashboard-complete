"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUsers, updateUser } from "@/services/mockApi";
import { User } from "@/types/user";
import { saveUsersToStorage, getUsersFromStorage, } from "@/utils/localStorage";

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  //INITIAL LOAD: localStorage → fallback to mock API
  
  useEffect(() => {
  const storedUsers = getUsersFromStorage();

  if (storedUsers && storedUsers.length > 0) {
    setUsers(storedUsers);
  } else {
    fetchUsers().then((data) => {
      setUsers(data);
      saveUsersToStorage(data);
    });
  }
}, []);


  // ✅ SAVE USER (ADMIN EDIT)
  const saveUser = async (updatedUser: User) => {
    await updateUser(updatedUser);

    setUsers((prev) => {
      const updatedUsers = prev.map((u) =>
        u.id === updatedUser.id ? updatedUser : u
      );

      saveUsersToStorage(updatedUsers); // 🔑 persist changes
      return updatedUsers;
    });
  };

  const addUser = (newUser: User) => {
  setUsers(prev => {
    const updatedUsers = [...prev, newUser];
    saveUsersToStorage(updatedUsers);
    return updatedUsers;
  });
};


  return (
    <UserContext.Provider value={{ users, saveUser, addUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
