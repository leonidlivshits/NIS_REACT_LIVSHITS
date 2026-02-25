export type User = {
  id?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  username?: string;
  image?: string;
  [key: string]: unknown;
};
