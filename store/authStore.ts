import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Customer } from '@/types'; // adjust path as needed
import { Employee } from '@/types';

type AuthStore = {
  userName: string;
  accessToken: string;
  customer: Customer | null;
  employee: Employee | null;
  login: (userName: string, accessToken: string, customer: Customer, employee: Employee) => void;
  logout: () => void;
  setCustomer: (customer: Customer) => void; 
  setEmployee: (employee: Employee) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userName: "",
      accessToken: "",
      customer: null,
      employee: null,
      login: (userName, accessToken, customer, employee) =>
        set({ userName, accessToken, customer, employee }),
      logout: () =>
        set({
          userName: "",
          accessToken: "",
          customer: null,
          employee: null
        }),
      setCustomer: (customer) => set({ customer }), 
      setEmployee: (employee) => set({ employee }),
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
