import { BankBranch } from "./bank-branch";
import { CheckInventory } from "./check-inventories";
import { FileProcess } from "./file-processes";
import { Product } from "./products";

export interface Bank {
    id: number;
    bankName: string;
    bankShortName: any;
    branches: BankBranch[];
    fileProcesses: FileProcess[];
    checkInventories: CheckInventory[];
    products: Product[];
}