import type { ProductCard } from '../types/ProductCard';
import { addToCart } from '../providers/Cart';
import { useState } from 'preact/hooks';

export default function ProductCard({ product }: { product: ProductCard }) {

    const [quantity, setQuantity] = useState(1);

    return (
        <a href={product.url}>
            <img className="skeleton" src={product.image} alt={product.title} width="200px" height="200px" loading="lazy" />
            <p>Title: {product.title}</p>
            <p>Price: ${product.price}</p>
            <p>Sale Price: ${product.salePrice}</p>
            <p>Color: {product.color}</p>
            <p>Variation: {product.variation}</p>
            <p>Stock: {product.stock}</p>
            <p>Message: {product.message}</p>

            <p>
                <input 
                    type="number" 
                    min="1"
                    max={product.stock} 
                    value={quantity} 
                    onChange={(event) => setQuantity(parseInt((event.target as HTMLInputElement).value))}
                />
                <button onClick={() => addToCart( product, quantity )}>Add to Cart</button>        
            </p>
        </a>
    );
}
