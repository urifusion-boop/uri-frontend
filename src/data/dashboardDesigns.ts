import { ISelectData } from "../types";

interface ICategory {
  id: number;
  label: string;
  value: string;
}

export const eventCategory: ICategory[] = [
  {
    id: 0,
    label: "Professional Event",
    value: "Professional Event",
  },
  {
    id: 1,
    label: "Casual Event",
    value: "Casual Event",
  },
];

export const eventType = {
  ProfessionalEvent: {
    events: ["Book Launch", "Conference", "Photoshoot", "Wedding"],
  },
  CasualEvent: {
    events: ["Birthday Party", "Night Party", "Picnic"],
  },
};
