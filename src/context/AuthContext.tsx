import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { initialUsers } from '../db/seedData';

interface AuthContextType {
  currentUser: User | null;
  usersList: User[];
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (data: Partial<User>) => void;
  changePassword: (newPass: string) => boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isReceptionist: boolean;
  canManageUsers: boolean;
  canPrescribe: boolean;
  canBilling: boolean;
  canConfigureSettings: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'CLINICOS_CURRENT_USER_ID';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    return initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUserId = localStorage.getItem(AUTH_USER_KEY);
    if (savedUserId) {
      const found = initialUsers.find(u => u.id === savedUserId);
      if (found) return found;
    }
    // Default to Dr. Marcus Vance or Admin
    return initialUsers[0]; // Dr. Sarah Jenkins (Admin & Doctor)
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_USER_KEY, currentUser.id);
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [currentUser]);

  const login = async (username: string, _password?: string): Promise<boolean> => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.isActive);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      const updatedUser = { ...found, lastLogin: new Date().toISOString() };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === found.id ? updatedUser : u));
    }
  };

  const updateCurrentUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  const changePassword = (_newPass: string): boolean => {
    return true;
  };

  const role: UserRole = currentUser?.role || 'receptionist';
  const isAdmin = role === 'admin';
  const isDoctor = role === 'doctor' || role === 'admin';
  const isReceptionist = role === 'receptionist' || role === 'admin';

  return (
    <AuthContext.Provider value={{
      currentUser,
      usersList: users,
      login,
      logout,
      switchUser,
      updateCurrentUserProfile,
      changePassword,
      isAdmin,
      isDoctor,
      isReceptionist,
      canManageUsers: isAdmin,
      canPrescribe: isDoctor,
      canBilling: isReceptionist || isAdmin,
      canConfigureSettings: isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
