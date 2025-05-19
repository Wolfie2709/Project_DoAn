import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AuthStore = {
  userName: string
  accessToken: string
  login: (userName: string, accessToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      userName: "",
      accessToken: "",
      login: (userName, accessToken) => set({ userName, accessToken}),
      logout: () => set({userName: "",accessToken: ""})
    }),
    
    {
      name: 'food-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)