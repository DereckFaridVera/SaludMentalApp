import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create(
  persist(
    (set) => ({
      user: null, // null if not logged in
      emotionalRecords: [],
      testResults: [],

      login: (name) => set({ user: { name } }),
      logout: () => set({ user: null, emotionalRecords: [], testResults: [] }),

      addEmotionalRecord: (record) => set((state) => ({
        emotionalRecords: [...state.emotionalRecords, record]
      })),

      addTestResult: (result) => set((state) => ({
        testResults: [...state.testResults, result]
      })),
    }),
    {
      name: 'salud-mental-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStore;
