import type { CartItem } from '../types/CartItem';
import { deleteFromCart, updateQuantity } from '../providers/Cart';

export default function CartItem({ item }: { item: CartItem }) {
    return (
        <li>
            <img className="skeleton" src={item.image} alt={item.title} width="200px" height="200px" loading="lazy" />
            <p class="titol">Title: {item.title}</p>
            <p>Price: ${item.price}</p>
            <p>Sale Price: ${item.salePrice}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Color: {item.color}</p>
            <p>Variation: {item.variation}</p>
            <p>Stock: {item.stock}</p>
            <p>Message: {item.message}</p>

            <p>
                <input 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    max={item.stock} 
                    onChange={(event) => updateQuantity(item, parseInt((event.target as HTMLInputElement).value))}
                />
                <button onClick={() => deleteFromCart( item )}>Remove from Cart</button>
            </p>
        </li>
    );
}

