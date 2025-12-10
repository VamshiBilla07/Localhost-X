export type IssueStatus = "open" | "in-progress" | "resolved";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contact?: string;
  coordinates?: Coordinates;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
};
