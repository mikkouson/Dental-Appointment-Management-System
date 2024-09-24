import { create } from "zustand";

type StatusItem = {
  id: number;
  name: string;
};

type State = {
  selectedDate: Date | null;
  selectedTime: string;
  branch: number;
  status: StatusItem[];
};

type Actions = {
  getDate: (selectedDate: Date) => void;
  getTime: (selectedTime: string) => void;
  setBranch: (branch: number) => void;
  setStatus: (status: StatusItem[]) => void;
};

export const useGetDate = create<State & Actions>((set) => ({
  selectedDate: null,
  selectedTime: "",
  branch: 0,
  status: [],
  getDate: (selectedDate) => set({ selectedDate }),
  getTime: (selectedTime) => set({ selectedTime }),
  setBranch: (branch) => set({ branch }),
  setStatus: (status) => set({ status }),
}));

type ActiveState = {
  selectedPatient: Number;
};
type ActiveAppointment = {
  selectedAppointment: Number;
};
type ActiveActions = {
  setActive: (selectedPatient: Number) => void;
};

type ActiveAppointmentActions = {
  setActiveState: (selectedAppointment: Number) => void;
};

export const useSetActive = create<ActiveState & ActiveActions>((set) => ({
  selectedPatient: 0,
  setActive: (selectedPatient) => set({ selectedPatient }),
}));

export const useSetActiveAppointments = create<
  ActiveAppointment & ActiveAppointmentActions
>((set) => ({
  selectedAppointment: 0,
  setActiveState: (selectedAppointment) => set({ selectedAppointment }),
}));
