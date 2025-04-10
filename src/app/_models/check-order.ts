export interface CheckOrders{
    id?:string;
    accountNumber:string;
    brstn:string;
    mainAccountName?:string;
    concode?:string;
    quantity?:string;
    deliverTo?:string;
    startingSeries?:string;
    endingSeries?:string;
    isOnHold:boolean;
    isValid:boolean;
    errorMessage?:string;
}