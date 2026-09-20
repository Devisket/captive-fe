import { CheckOrders } from "./check-order"

export interface OrderFile {
  id: string
  batchId: string
  fileName: string
  filePath: string
  status: string
  personalQuantity:number
  commercialQuantity:number
  errorMessage:string
  checkOrders:CheckOrders[]
  isValid: boolean
  statusDetail?: string
  isCustom?: boolean
}

export interface CreateCustomOrderFileRequest {
  bankId: string
  batchId: string
  productId: string
  fileName?: string
  checkOrders: CustomCheckOrderInput[]
}

export interface CustomCheckOrderInput {
  accountNumber: string
  brstn: string
  checkType: string
  formType: string
  quantity: number
  mainAccountName?: string
  accountName1?: string
  accountName2?: string
  deliverTo?: string
  concode?: string
  startingSeries?: string
  endingSeries?: string
}

export interface CreateCustomOrderFileResponse {
  orderFileId: string
  batchId: string
  fileName: string
  checkOrderCount: number
}
