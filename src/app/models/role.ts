
import { Permission } from "./permiso";
import { Person } from "./person";
export interface Role {
  id: number;
  name: string;

  permissions: Permission[];

  active: boolean;
  archived: boolean;
  archived_at: Date;
  archived_by: Person;

  created_at: Date;
  updated_at: Date;
}
