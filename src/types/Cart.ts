import type { CartItem } from './CartItem';

export interface Cart {
    open: boolean;
    count: number;
    subtotal: number;
    items: CartItem[];
}