import { TagMapping } from "./tag-mapping";

export interface Tag {
  id: string;
  name: string;
  isDefaultTag: boolean;
  searchByBranch:boolean;
  searchByAccount:boolean;
  searchByFormCheck:boolean;
  searchByProduct:boolean;
  mapping: TagMapping[];
}
