import { useEffect, useRef } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { productCards, loadMoreProducts, showLoadMoreButton, resetProductsAutoscroll } from '../providers/Products';
import ProductCard from './ProductCard';

export default function Cart() {
    const $productCards = useStore(productCards);
    const $showLoadMoreButton = useStore(showLoadMoreButton);

    const loadMoreProductsRef = useRef(null);

    useEffect(() => {
        if (loadMoreProductsRef.current) {

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreProducts();
                }
            }, { rootMargin: "600px" } );

            observer.observe(loadMoreProductsRef.current);
            return () => observer.disconnect();
        }
    }, [$showLoadMoreButton]);

    return (
        <section>
            <ul>
                {$productCards.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ul>

            <div ref={loadMoreProductsRef}>
                { $showLoadMoreButton ? (
                    <button onClick={() => resetProductsAutoscroll()} >Load More</button>
                ) : (
                    <ul>
                        <p>skeleton</p>
                    </ul>
                )}
            </div>
        </section>
    );
};