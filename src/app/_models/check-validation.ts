import { Tag } from "./tag";

export interface CheckValidation {
  id: string;
  name: string;
  validationType: string;
  bankInfoId: string;
  tags: Tag[];
}
