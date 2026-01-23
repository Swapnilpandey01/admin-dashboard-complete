// Login role (Admin/Viewer)

export const setRole = (role: string) => {
  localStorage.setItem("role", role);
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const clearRole = () => {
  localStorage.removeItem("role");
};


// Column Visibility (Users table)

// utils/localStorage.ts

const VISIBLE_COLUMNS_KEY = "visibleColumns";

export const getVisibleColumns = () => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(VISIBLE_COLUMNS_KEY);
  return data ? JSON.parse(data) : null;
};

export const setVisibleColumns = (columns: Record<string, boolean>) => {
  localStorage.setItem(VISIBLE_COLUMNS_KEY, JSON.stringify(columns));
};

export const clearVisibleColumns = () => {
  localStorage.removeItem(VISIBLE_COLUMNS_KEY);
};



// USERS DATA (PERSISTENT)

const USERS_STORAGE_KEY = "users";

export const saveUsersToStorage = (users: any[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getUsersFromStorage = (): any[] | null => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearUsersFromStorage = () => {
  localStorage.removeItem(USERS_STORAGE_KEY);
};
