import React from 'react';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const products = [
    { name: 'Unicorn Pop', price: '$4.99', image: 'https://cdn-icons-png.flaticon.com/512/2682/2682465.png' },
    { name: 'Gummy Stars', price: '$3.50', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014522.png' },
    { name: 'Cotton Clouds', price: '$5.00', image: 'https://cdn-icons-png.flaticon.com/512/2682/2682467.png' },
  ];

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-fuchsia-900 mb-4">Featured Sweets</h2>
          <p className="text-lg text-fuchsia-800">Our most magical creations, just for you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard 
              key={index} 
              name={product.name} 
              price={product.price} 
              image={product.image} 
              delay={index * 0.2} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
