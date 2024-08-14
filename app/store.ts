import { create } from "zustand";

type State = {
  selectedDate: Date;
  selectedTime: String;
};

type Action = {
  getDate: (selectedDate: State["selectedDate"]) => void;
  getTime: (selectedDate: State["selectedTime"]) => void;
};

export const useGetDate = create<State & Action>((set) => ({
  selectedDate: "",
  getDate: (selectedDate) => set({ selectedDate }),
}));

export const usegetTime = create((set) => ({
  selectedTime: "",
  getTime: (selectedTime) => set({ selectedTime }),
}));
