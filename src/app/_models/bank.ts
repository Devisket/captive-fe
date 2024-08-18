import { BankBranch } from "./bank-branch";
import { CheckInventory } from "./check-inventories";
import { FileProcess } from "./file-processes";

export interface Bank {
    id: number;
    bankName: string;
    bankShortName: any;
    branches: BankBranch[];
    fileProcesses: FileProcess[];
    checkInventories: CheckInventory[];
}