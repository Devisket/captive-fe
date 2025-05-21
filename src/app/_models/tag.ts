import { TagMapping } from "./tag-mapping";

export interface Tag {
  id: string | undefined;
  tagName: string;
  isDefaultTag: boolean;
  searchByBranch:boolean;
  searchByAccount:boolean;
  searchByFormCheck:boolean;
  searchByProduct:boolean;
  isLocked:boolean;
}
