import { CheckOrders } from "./check-order"

export interface OrderFile {
  id: string
  batchId: string
  fileName: string
  filePath: string
  status: string
  personalQty:number
  commercialQty:number
  checkOrders:CheckOrders[]
}
