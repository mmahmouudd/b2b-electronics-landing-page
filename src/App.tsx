import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Showcase from './components/Showcase';
import BulkPricing from './components/BulkPricing';
import CheckoutSection from './components/CheckoutSection';
import RFQ from './components/RFQ';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';

export default function App() {
  const [category, setCategory] = useState('All');

  const selectCategory = (name: string) => {
    setCategory(name);
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <a
        href="#catalog"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to catalog
      </a>

      <Header />
      <main>
        <Hero />
        <Categories onSelectCategory={selectCategory} />
        <Showcase category={category} onCategoryChange={setCategory} />
        <BulkPricing />
        <CheckoutSection />
        <RFQ />
      </main>
      <Footer />

      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  );
}
