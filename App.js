// App.js
import React from 'react';
import RootTabs from './navigation/RootTabs';
import { CartProvider } from './context/CartContext';
import { Colors } from './constants/theme';


export default function App() {
  return (
    <CartProvider>
      <RootTabs />
    </CartProvider>
  );
}
