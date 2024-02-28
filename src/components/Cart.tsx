import { useStore } from '@nanostores/preact';
import { cart } from '../providers/Cart';
import CartItem from './CartItem';

export default function Cart() {
  const $cart = useStore(cart);

  return $cart.open ? (
    <aside>
      <p>Number of items: {$cart.count}</p>
      <p>Cart subtotal: ${$cart.subtotal.toFixed(2)}</p>
      <ul>
        {$cart.items.map((item) => (
          item && <CartItem key={item.id} item={item} />
        ))}
      </ul>
    </aside>
  ) : null;
}