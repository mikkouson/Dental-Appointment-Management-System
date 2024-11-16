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

//active patients
type ActiveState = {
  selectedPatient: Number;
};

type ActiveActions = {
  setActive: (selectedPatient: Number) => void;
};

//active appointments
type ActiveAppointmentActions = {
  setActiveState: (selectedAppointment: Number) => void;
};
type ActiveAppointment = {
  selectedAppointment: Number;
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
type TeethLocationState = {
  tooth_location: number;
  tooth_condition: string;
  tooth_history: string;
  history_date: Date;
  patient_id: number;
};

type TeethArray = {
  teethLocations: TeethLocationState[];
};

type TeethArrayActions = {
  addTeethLocation: (tooth: TeethLocationState) => void;
  clearTeethLocations: () => void;
  updateToothLocation: (updatedTooth: TeethLocationState) => void;
};

export const useTeethArray = create<TeethArray & TeethArrayActions>((set) => ({
  teethLocations: [],
  addTeethLocation: (tooth) =>
    set((state) => ({ teethLocations: [...state.teethLocations, tooth] })),
  clearTeethLocations: () => set({ teethLocations: [] }),
  updateToothLocation: (updatedTooth) =>
    set((state) => ({
      teethLocations: state.teethLocations.map((tooth) =>
        tooth.tooth_location === updatedTooth.tooth_location &&
        tooth.patient_id === updatedTooth.patient_id
          ? updatedTooth
          : tooth
      ),
    })),
}));
