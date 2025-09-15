import { ISelectData } from "../types";

export const eventCategories: ISelectData[] = [
  {
    label: "Casual",
    value: "CASUAL"
  },
  {
    label: "Professional",
    value: "PROFESSIONAL"
  }
]

export const casualEventTypes: ISelectData[] = [
    {
      label: "Birthday",
      value: "BIRTHDAY",
    },
    {
      label: "Hangout",
      value: "HANGOUT",
    },
    {
      label: "Beach Party",
      value: "BEACH_PARTY",
    },
    {
      label: "Game Night",
      value: "GAME_NIGHT",
    },
    {
      label: "Comedy Night",
      value: "COMEDY_NIGHT"
    }
];

export const professionalEventTypes: ISelectData[] = [
    {
      label: "Book Launch",
      value: "BOOK_LAUNCH",
    },
    {
      label: "Photoshoot",
      value: "PHOTOSHOOT",
    },
    {
      label: "Inauguration",
      value: "INAUGURATION",
    },
    {
      label: "Business Conference",
      value: "BUSINESS_CONFERENCE",
    }
];

export const createEventSteps: ISelectData[] = [
  {
    label: "Event Details",
    value: "eventDetails",
  },
  {
    label: "Location and Date",
    value: "locationAndDate",
  },
  {
    label: "Attendee Information",
    value: "attendeeInformation",
  },
  {
    label: "Review and Create",
    value: "reviewAndCreate",
  }
];