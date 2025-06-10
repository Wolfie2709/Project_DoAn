import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CustomerSessionDto } from '@/types'; // adjust path as needed
import { EmployeeSessionDto } from '@/types';

type AuthStore = {
  userName: string;
  accessToken: string;
  customer: CustomerSessionDto | null;
  employee: EmployeeSessionDto | null;
  login: (userName: string, accessToken: string, customer: CustomerSessionDto, employee: EmployeeSessionDto) => void;
  logout: () => void;
  setCustomer: (customer: CustomerSessionDto) => void; 
  setEmployee: (employee: EmployeeSessionDto) => void;
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
