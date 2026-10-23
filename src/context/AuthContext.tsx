import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  profileCompleted: boolean;
  location?: string;
  category?: string;
  companyName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  pendingMobile: string | null;
  demoOtp: string;
  loginWithMobile: (mobile: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  setAccountRole: (role: UserRole) => void;
  completeWorkerProfile: (data: Partial<User>) => void;
  completeEmployerProfile: (data: Partial<User>) => void;
  logout: () => void;
  switchRoleDemo: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, User> = {
  worker: {
    id: 'w-1',
    name: 'रमेश कुमार',
    mobile: '9876543210',
    role: 'worker',
    profileCompleted: true,
    location: 'सेक्टर 62, नोएडा (Noida)',
    category: 'Driver'
  },
  employer: {
    id: 'emp-1',
    name: 'संजय वर्मा',
    mobile: '9876501234',
    role: 'employer',
    profileCompleted: true,
    location: 'गोमती नगर, लखनऊ',
    companyName: 'अवध कंस्ट्रक्शन प्रा. लि.'
  },
  admin: {
    id: 'adm-1',
    name: 'Rojgar Mitra Admin',
    mobile: '9999999999',
    role: 'admin',
    profileCompleted: true,
    location: 'मुख्यालय / Central HQ'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-login or stored login demo state
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('rojgar_demo_user');
      if (stored) return JSON.parse(stored);
      // Default to worker logged in so the user can immediately experience the interactive app!
      return DEMO_USERS.worker;
    } catch {
      return DEMO_USERS.worker;
    }
  });

  const [pendingMobile, setPendingMobile] = useState<string | null>(null);
  const demoOtp = '1234'; // Fixed demo code for transparent developer testing

  useEffect(() => {
    if (user) {
      localStorage.setItem('rojgar_demo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rojgar_demo_user');
    }
  }, [user]);

  const loginWithMobile = async (mobile: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setPendingMobile(mobile);
        resolve(true);
      }, 400);
    });
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (code === demoOtp || code === '0000') {
          // If already has user profile for this number, keep it, else create new
          const newUser: User = {
            id: `usr-${Date.now()}`,
            name: 'नया उपयोगकर्ता (New User)',
            mobile: pendingMobile || '9876543210',
            role: 'worker', // default role before role selection
            profileCompleted: false
          };
          setUser(newUser);
          resolve(true);
        } else {
          reject(new Error('अमान्य ओटीपी। कृपया डेमो कोड 1234 का प्रयोग करें। (Invalid OTP. Please enter 1234)'));
        }
      }, 500);
    });
  };

  const setAccountRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    } else {
      setUser(DEMO_USERS[role]);
    }
  };

  const completeWorkerProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({
      ...user,
      ...data,
      role: 'worker',
      profileCompleted: true
    });
  };

  const completeEmployerProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({
      ...user,
      ...data,
      role: 'employer',
      profileCompleted: true
    });
  };

  const logout = () => {
    setUser(null);
    setPendingMobile(null);
    localStorage.removeItem('rojgar_demo_user');
  };

  const switchRoleDemo = (role: UserRole) => {
    setUser(DEMO_USERS[role]);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        pendingMobile,
        demoOtp,
        loginWithMobile,
        verifyOtp,
        setAccountRole,
        completeWorkerProfile,
        completeEmployerProfile,
        logout,
        switchRoleDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
