import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Customer } from '@/types'; // adjust path as needed
import {Employee} from '@/types';

type AuthStore = {
  userName: string;
  accessToken: string;
  customer: Customer | null;
  login: (userName: string, accessToken: string, customer: Customer, employee:Employee) => void;
  logout: () => void;
  setCustomer: (customer: Customer) => void; 
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userName: "",
      accessToken: "",
      customer: null,
      login: (userName, accessToken, customer) =>
        set({ userName, accessToken, customer }),
      logout: () => set({ userName: "", accessToken: "", customer: null }),
      setCustomer: (customer) => set({ customer }), 
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
