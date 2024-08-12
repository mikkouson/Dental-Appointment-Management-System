import { create } from "zustand";

type State = {
  selectedDate: Date;
};

type Action = {
  getDate: (selectedDate: State["selectedDate"]) => void;
};

export const useGetDate = create<State & Action>((set) => ({
  selectedDate: "",
  getDate: (selectedDate) => set({ selectedDate }),
}));
