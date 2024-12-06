export interface CheckOrders{
    accountNumber:string;
    brstn:string;
    mainAccountName:string;
    concode:string;
    quantity:string;
    deliverTo:string;
    isValid:boolean;
    errorMessage:string;
}