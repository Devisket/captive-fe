import { TagMapping } from "./tag-mapping";

export interface Tag {
  id: string;
  name: string;
  mapping: TagMapping[];
}
