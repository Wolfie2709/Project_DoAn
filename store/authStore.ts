import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CustomerSessionDto } from '@/types'; // adjust path as needed
import { EmployeeSessionDto } from '@/types';
import { Order } from '@/types';

type AuthStore = {
  userName: string;
  accessToken: string;
  customer: CustomerSessionDto | null;
  employee: EmployeeSessionDto | null;
  customerDetails: { email: string; phone: string, address: string} | null; // ✅ add this
  login: (userName: string, accessToken: string, customer: CustomerSessionDto, employee: EmployeeSessionDto) => void;
  logout: () => void;
  setCustomer: (customer: CustomerSessionDto) => void;
  setEmployee: (employee: EmployeeSessionDto) => void;
  setCustomerDetails: (details: { email: string; phone: string, address: string }) => void; // ✅ add this
};


export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userName: "",
      accessToken: "",
      customer: null,
      employee: null,
      customerDetails: null, // ✅
      login: (userName, accessToken, customer, employee) =>
        set({ userName, accessToken, customer, employee }),
      logout: () =>
        set({
          userName: "",
          accessToken: "",
          customer: null,
          employee: null,
          customerDetails: null, // ✅ clear it on logout
        }),
      setCustomer: (customer) => set({ customer }),
      setEmployee: (employee) => set({ employee }),
      setCustomerDetails: (details) => set({ customerDetails: details }), // ✅
    }),
    {
      name: 'food-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

