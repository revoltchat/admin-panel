export type Hr = {
  Person: {
    _id: string;
    name: string;
    email: string;
    status: "Active" | "Inactive";
    positions: string[];
    roles: string[];
  };
  Position: {
    _id: string;
    title: string;
    roles: string[];
  };
  Role: {
    _id: string;
    permissions: string[];
  };
};

export * from "./people";
