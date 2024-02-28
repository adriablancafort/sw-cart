import { atom } from "nanostores";

import type { Cart } from "../types/Cart";
import type { CartItem } from "../types/CartItem";
import type { ProductCard } from "../types/ProductCard";

export const cart = atom<Cart[]>([]);

const API_URL = "http://api.brickoram.com/v1/";

export const fetchCart = async () => {
    const response = await fetch(API_URL + "carts");
    const data = await response.json();
    cart.set(data);

    console.log("Fetched cart from preact", data);
};

export const addToCart = async (product: ProductCard, quantity: number) => {

    const addItem: CartItem = {
        id: product.id,
        quantity: quantity,
        url: product.url,
        image: product.image,
        title: product.title,
        color: product.color,
        variation: product.variation,
        price: product.price,
        salePrice: product.salePrice,
        stock: product.stock,
        message: product.message
    };

    await fetch(API_URL + "carts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(addItem),
    });
    
    fetchCart();
};

export const deleteFromCart = async (item: CartItem) => {

    const deleteItem = { id: item.id }

    await fetch(API_URL + "carts", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(deleteItem),
    });

    fetchCart();
};

export const updateQuantity = async (item: CartItem, quantity: number) => {

    const updateItem = { id: item.id, quantity }

    await fetch(API_URL + "carts", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateItem),
    });

    fetchCart();
};