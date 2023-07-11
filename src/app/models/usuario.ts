import { Person } from "./person";
import { Role } from "./role";

export interface User {
  id: number;
  email: string;
  password: string;

  person: Person;
  role: Role;

  active: boolean;
  archived: boolean;
  archived_at: Date;
  archived_by: Person;

  created_at: Date;
  updated_at: Date;
}
