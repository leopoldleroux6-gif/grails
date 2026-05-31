export type Category = "sneakers" | "streetwear" | "accessoire";
export type Status = "stock" | "listed" | "sold";

export interface Item {
  id: string;
  name: string;
  brand: string;
  category: Category;
  size?: string;
  buyPrice: number;
  buyDate: string;
  marketPrice: number;
  status: Status;
  sellPrice?: number;
  sellDate?: string;
  platform?: string;
  feesPercent?: number;
  notes?: string;
}
