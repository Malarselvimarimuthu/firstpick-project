export interface Product
{
    id: string;
    name: string;
    price: string;
    description: string;
    mainImageUrl: string;
    category: string;
    productID?: string;
    timestamp?: Date;
}