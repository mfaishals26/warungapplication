// context/CartContext.js
import React, { createContext, useState, useMemo } from 'react';
import { Alert } from 'react-native';

// helper untuk clone array dan hitung total
const calcTotal = (items) => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0);

export const CartContext = createContext({
  items: [],
  add: () => {},
  inc: () => {},
  dec: () => {},
  remove: () => {},
  clear: () => {},
  total: 0,
  count: 0,

  // orders
  orders: [],
  makeOrder: () => {},
  incOrderItem: () => {},
  decOrderItem: () => {},
  removeOrderItem: () => {},
  markOrderPaid: () => {},
  unmarkOrderPaid: () => {},
});

export function CartProvider({ children }) {
  // cart state
  const [items, setItems] = useState([]); // { id, name, price, qty }
  // orders state
  const [orders, setOrders] = useState([]); // { id, items:[{id,name,price,qty}], total, customerName, table, createdAt, paid }

  // CART ACTIONS
  const add = (product) => {
    setItems((prev) => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const inc = (id) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, qty: p.qty + 1 } : p));
  };

  const dec = (id) => {
    setItems(prev => {
      const copy = prev.map(p => p.id === id ? { ...p, qty: p.qty - 1 } : p);
      return copy.filter(p => p.qty > 0);
    });
  };

  const remove = (id) => {
    setItems(prev => prev.filter(p => p.id !== id));
  };

  const clear = () => setItems([]);

  const total = useMemo(() => calcTotal(items), [items]);
  const count = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  // ORDERS ACTIONS
  // makeOrder: create new order from current cart items, clear cart
  const makeOrder = ({ customerName = 'Guest', table = null } = {}) => {
    if (!items || items.length === 0) {
      Alert.alert('Keranjang kosong', 'Tidak ada item untuk dibuat order.');
      return null;
    }

    const id = Date.now().toString(); // simple id
    const orderItems = items.map(it => ({ ...it })); // clone
    const orderTotal = calcTotal(orderItems);

    const newOrder = {
      id,
      items: orderItems,
      total: orderTotal,
      customerName,
      table,
      createdAt: Date.now(),
      paid: false,
    };

    setOrders(prev => [...prev, newOrder]);
    // clear cart after order
    setItems([]);
    return newOrder;
  };

  // find order by id helper
  const findOrderIndex = (orderId) => orders.findIndex(o => o.id === orderId);

  // incOrderItem(orderId, itemId)
  const incOrderItem = (orderId, itemId) => {
    setOrders(prev => {
      const copy = prev.map(o => ({ ...o, items: o.items.map(it => ({ ...it })) }));
      const idx = copy.findIndex(o => o.id === orderId);
      if (idx === -1) return prev;
      const order = copy[idx];
      const itIdx = order.items.findIndex(it => it.id === itemId);
      if (itIdx === -1) return prev;
      order.items[itIdx].qty += 1;
      order.total = calcTotal(order.items);
      copy[idx] = order;
      return copy;
    });
  };

  // decOrderItem(orderId, itemId) - remove if qty <=0
  const decOrderItem = (orderId, itemId) => {
    setOrders(prev => {
      const copy = prev.map(o => ({ ...o, items: o.items.map(it => ({ ...it })) }));
      const idx = copy.findIndex(o => o.id === orderId);
      if (idx === -1) return prev;
      const order = copy[idx];
      const itIdx = order.items.findIndex(it => it.id === itemId);
      if (itIdx === -1) return prev;
      order.items[itIdx].qty -= 1;
      if (order.items[itIdx].qty <= 0) {
        order.items.splice(itIdx, 1);
      }
      order.total = calcTotal(order.items);
      copy[idx] = order;
      return copy;
    });
  };

  // removeOrderItem(orderId, itemId)
  const removeOrderItem = (orderId, itemId) => {
    setOrders(prev => {
      const copy = prev.map(o => ({ ...o, items: o.items.map(it => ({ ...it })) }));
      const idx = copy.findIndex(o => o.id === orderId);
      if (idx === -1) return prev;
      const order = copy[idx];
      order.items = order.items.filter(it => it.id !== itemId);
      order.total = calcTotal(order.items);
      copy[idx] = order;
      return copy;
    });
  };

  // mark/unmark paid just in case (you removed UI but keep functions available)
  const markOrderPaid = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paid: true } : o));
  };
  const unmarkOrderPaid = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paid: false } : o));
  };

  // expose value
  const value = {
    items,
    add,
    inc,
    dec,
    remove,
    clear,
    total,
    count,

    orders,
    makeOrder,
    incOrderItem,
    decOrderItem,
    removeOrderItem,
    markOrderPaid,
    unmarkOrderPaid,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
