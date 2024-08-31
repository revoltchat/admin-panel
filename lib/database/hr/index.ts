export type Hr = {
  Person: {
    _id: string;
    name: string;
    email: string;
    status: "Active" | "Pending" | "Inactive" | "Retired";
    positions: string[];
    roles: string[];
    approvalRequest?: {
      reason: string;
      requestee: string;
    };
    notes?: string;
  };
  Position: {
    _id: string;
    title: string;
    roles: string[];
    color?: Color;
  };
  Role: {
    _id: string;
    name: string;
    permissions: string[];
    color?: Color;
  };
};

type Color =
  | "tomato"
  | "red"
  | "ruby"
  | "crimson"
  | "pink"
  | "plum"
  | "purple"
  | "violet"
  | "iris"
  | "indigo"
  | "blue"
  | "cyan"
  | "teal"
  | "jade"
  | "green"
  | "grass"
  | "brown"
  | "orange"
  | "sky"
  | "mint"
  | "lime"
  | "yellow"
  | "amber"
  | "gold"
  | "bronze"
  | "gray";

export * from "./people";
