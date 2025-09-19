
export const fuelLevels = ['Empty', 'Tabs', 'Tabs+', 'Full'] as const;
export const cleaningStatuses = ['Dirty', 'C-', 'C', 'C+'] as const;
export const todoStatuses = ['pending', 'in-progress'] as const;

export type FuelLevel = typeof fuelLevels[number];
export type CleaningStatus = typeof cleaningStatuses[number];
export type TodoStatus = typeof todoStatuses[number];

export type Plane = {
  id: string;
  tailNumber: string;
  fuelLevel: FuelLevel;
  cleaningStatus: CleaningStatus;
};

export type Todo = {
  id: string;
  text: string;
  status: TodoStatus;
  createdAt: number;
};
