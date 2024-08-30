import { create } from "zustand";

// Define the state type
type State = {
  selectedDate: Date | null; // Use Date or null to handle uninitialized state
  selectedTime: string; // Use lowercase 'string' for type
  status: {
    accepted: boolean;
    pending: boolean;
    canceled: boolean;
  };
};

// Define the actions type
type Actions = {
  getDate: (selectedDate: Date) => void;
  getTime: (selectedTime: string) => void;
  setStatus: (status: {
    accepted: boolean;
    pending: boolean;
    canceled: boolean;
  }) => void;
};

// Create Zustand store with proper typing
export const useGetDate = create<State & Actions>((set) => ({
  selectedDate: null, // Initialize as null
  selectedTime: "", // Initialize as empty string
  status: {
    accepted: true,
    pending: true,
    canceled: true,
  },
  getDate: (selectedDate) => set({ selectedDate }),
  getTime: (selectedTime) => set({ selectedTime }),
  setStatus: (status) => set({ status }),
}));
