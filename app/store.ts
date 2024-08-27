import { create } from "zustand";

// Define the state type
type State = {
  selectedDate: Date | null; // Use Date or null to handle uninitialized state
  selectedTime: string; // Use lowercase 'string' for type
};

// Define the actions type
type Actions = {
  getDate: (selectedDate: Date) => void;
  getTime: (selectedTime: string) => void;
};

// Create Zustand stores with proper typing
export const useGetDate = create<State & Actions>((set) => ({
  selectedDate: null, // Initialize as null
  selectedTime: "", // Initialize as empty string
  getDate: (selectedDate) => set({ selectedDate }),
  getTime: (selectedTime) => set({ selectedTime }),
}));
