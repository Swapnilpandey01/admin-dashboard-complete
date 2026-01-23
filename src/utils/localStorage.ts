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

const COLUMN_STORAGE_KEY = "visibleColumns";

export const setVisibleColumns = (columns: Record<string, boolean>) => {
  localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(columns));
};

export const getVisibleColumns = (): Record<string, boolean> | null => {
  const stored = localStorage.getItem(COLUMN_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearVisibleColumns = () => {
  localStorage.removeItem(COLUMN_STORAGE_KEY);
};
