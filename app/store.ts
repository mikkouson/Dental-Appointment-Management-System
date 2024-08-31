import { create } from "zustand";

type State = {
  selectedDate: Date | null;
  selectedTime: string;
  branch: number;
  status: {
    accepted: boolean;
    pending: boolean;
    canceled: boolean;
  };
};

type Actions = {
  getDate: (selectedDate: Date) => void;
  getTime: (selectedTime: string) => void;
  setBranch: (branch: number) => void;
  setStatus: (status: {
    accepted: boolean;
    pending: boolean;
    canceled: boolean;
  }) => void;
};

export const useGetDate = create<State & Actions>((set) => ({
  selectedDate: null,
  selectedTime: "",
  branch: 1,
  status: {
    accepted: true,
    pending: true,
    canceled: true,
  },
  getDate: (selectedDate) => set({ selectedDate }),
  getTime: (selectedTime) => set({ selectedTime }),
  setBranch: (branch) => set({ branch }),
  setStatus: (status) => set({ status }),
}));
