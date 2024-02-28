import { atom } from 'nanostores';

import type { CartItem } from '../types/CartItem';
import type { ProductCard } from '../types/ProductCard';

export const isCartOpen = atom(false);
export const numberOfItems = atom(0);
export const cartSubtotal = atom(0);
export const cartItems = atom<CartItem[]>([]);

export function addToCart(product: ProductCard, quantity: number) {

    const item: CartItem = {
        id: product.id,
        url: product.url,
        image: product.image,
        title: product.title,
        color: product.color,
        variation: product.variation,
        price: product.price,
        quantity: quantity,
        salePrice: product.salePrice,
        stock: product.stock,
        message: product.message
    };

    const currentCartItems = cartItems.get();
    const existingItem = currentCartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        currentCartItems.unshift(item);
    }

    cartItems.set(currentCartItems);


    numberOfItems.set(numberOfItems.get() + quantity);


    cartSubtotal.set(parseFloat((cartSubtotal.get() + quantity * item.price).toFixed(2)));


    if (currentCartItems.length === 1) {
        isCartOpen.set(true);

    }
}



export function deleteFromCart(item: CartItem) {
    const currentCartItems = cartItems.get();
    const existingItem = currentCartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
        const updatedCartItems = currentCartItems.filter((cartItem) => cartItem.id !== item.id);

        cartItems.set(updatedCartItems);


        numberOfItems.set(numberOfItems.get() - existingItem.quantity);


        cartSubtotal.set(parseFloat((cartSubtotal.get() - existingItem.quantity * existingItem.price).toFixed(2)));


        if (updatedCartItems.length === 0) {
            isCartOpen.set(false);

        }
    }
}

export function updateQuantity(item: CartItem, quantity: number) {
    const currentCartItems = cartItems.get();
    const existingItem = currentCartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
        const quantityDifference = quantity - existingItem.quantity;
        existingItem.quantity = quantity;

        cartItems.set(currentCartItems);


        numberOfItems.set(numberOfItems.get() + quantityDifference);


        cartSubtotal.set(parseFloat((cartSubtotal.get() + quantityDifference * existingItem.price).toFixed(2)));

    }
}