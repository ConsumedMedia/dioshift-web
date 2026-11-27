/**
 * Where Dioshift ads can run. Shown in the "Where your ad runs" section on
 * the homepage. Edit the labels and descriptions here. Each `icon` picks one
 * of the simple custom SVGs in components/home/WhereYourAdRuns.tsx.
 */

export type ContentCategoryIcon = "sports" | "news" | "movies" | "channels";
export type DeviceIcon = "smart-tv" | "stick" | "box" | "puck";

export type ContentCategory = {
  id: string;
  title: string;
  description: string;
  icon: ContentCategoryIcon;
};

export type Device = {
  id: string;
  name: string;
  icon: DeviceIcon;
};

export const contentCategories: ContentCategory[] = [
  {
    id: "live-sports",
    title: "Live sports",
    description: "Game day breaks, when the whole family is in front of the TV.",
    icon: "sports",
  },
  {
    id: "news",
    title: "News",
    description: "Local and national news people check in on every day.",
    icon: "news",
  },
  {
    id: "movies-and-shows",
    title: "Movies and shows",
    description: "The series and films people pick for a night on the couch.",
    icon: "movies",
  },
  {
    id: "free-streaming-channels",
    title: "Free streaming channels",
    description: "Free, ad-supported channels that play around the clock.",
    icon: "channels",
  },
];

export const devices: Device[] = [
  { id: "smart-tvs", name: "Smart TVs", icon: "smart-tv" },
  { id: "roku", name: "Roku", icon: "box" },
  { id: "fire-tv", name: "Fire TV", icon: "stick" },
  { id: "apple-tv", name: "Apple TV", icon: "puck" },
];
