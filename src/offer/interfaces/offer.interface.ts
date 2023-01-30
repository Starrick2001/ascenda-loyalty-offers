import { IMerchant } from './merchant.interface';

export interface IOffer {
  id: number;
  title: string;
  description: string;
  category: number;
  merchants: IMerchant[];
  valid_to: string;
}
