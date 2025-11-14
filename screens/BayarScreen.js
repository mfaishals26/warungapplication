// screens/BayarScreen.js
import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  Pressable,
  Text,
  SafeAreaView,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';
import Price from '../components/Price';
import ThemedView from '../components/themed-view';

export default function BayarScreen() {
  // only use order item functions we need
  const { orders, incOrderItem, decOrderItem, removeOrderItem } = useContext(CartContext);
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const listRef = useRef(null);

  // When navigated from PesanScreen with orderId, open the detail modal for that order
  useEffect(() => {
    if (!isFocused) return;
    const orderId = route.params?.orderId;
    if (orderId && orders && orders.length > 0) {
      const found = orders.find(o => o.id === orderId);
      if (found) {
        setSelectedOrder(found);
        setShowDetailModal(true);
        // scroll to item in list (if FlatList present)
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx >= 0 && listRef.current && orders.length > idx) {
          setTimeout(() => {
            try {
              listRef.current.scrollToIndex({ index: idx, animated: true });
            } catch (e) {
              // ignore if can't scroll
            }
          }, 250);
        }
      }
    }
  }, [route.params?.orderId, isFocused, orders]);

  // helper to open detail for an order (from list)
  const openOrder = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // action: show QR (navigate to PaymentQr)
  const handleShowQr = (order) => {
    navigation.navigate('PaymentQr', { orderId: order.id, total: order.total });
  };

  const renderOrder = ({ item }) => (
    <Pressable onPress={() => openOrder(item)} style={styles.orderCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.orderTitle}>Order #{item.id}</Text>
        <Text style={styles.orderMeta}>{item.customerName}{item.table ? ` • Kursi ${item.table}` : ''}</Text>
        <Text style={styles.orderMetaSmall}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Price value={item.total} style={styles.orderTotal} />
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.heading}>Daftar Pesanan Masuk</Text>

        <FlatList
          ref={listRef}
          data={orders.slice().reverse()} // newest first
          keyExtractor={(i) => i.id}
          renderItem={renderOrder}
          ListEmptyComponent={<Text style={styles.empty}>Belum ada pesanan masuk.</Text>}
          contentContainerStyle={orders.length === 0 ? styles.emptyContainer : { paddingBottom: 80 }}
        />

        {/* Detail modal */}
        <Modal visible={showDetailModal} transparent animationType="slide" onRequestClose={() => setShowDetailModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {!selectedOrder ? (
                <Text style={{ color: '#E2D3B7' }}>Memuat...</Text>
              ) : (
                <>
                  <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>
                  <Text style={styles.metaSmall}>Pembeli: <Text style={{ fontWeight: '700' }}>{selectedOrder.customerName}</Text></Text>
                  {selectedOrder.table ? <Text style={styles.metaSmall}>Kursi: {selectedOrder.table}</Text> : null}
                  <Text style={styles.metaSmall}>Waktu: {new Date(selectedOrder.createdAt).toLocaleString()}</Text>

                  <ScrollView style={{ maxHeight: 220, marginTop: 10 }}>
                    {selectedOrder.items.map((it) => (
                      <View key={it.id} style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemName}>{it.name}</Text>
                          <Price value={it.price} style={styles.itemPrice} />
                        </View>

                        <View style={styles.qtyBox}>
                          <Pressable onPress={() => decOrderItem(selectedOrder.id, it.id)} style={styles.qtyBtn}><Text style={styles.qtyText}>-</Text></Pressable>
                          <Text style={styles.qtyCount}>{it.qty}</Text>
                          <Pressable onPress={() => incOrderItem(selectedOrder.id, it.id)} style={styles.qtyBtn}><Text style={styles.qtyText}>+</Text></Pressable>
                        </View>

                        <Pressable onPress={() => removeOrderItem(selectedOrder.id, it.id)} style={styles.removeBtn}><Text style={{ color: '#2F2A2A' }}>H</Text></Pressable>
                      </View>
                    ))}
                  </ScrollView>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' }}>
                    <View>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Price value={selectedOrder.total} style={styles.totalValue} />
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Pressable onPress={() => handleShowQr(selectedOrder)} style={styles.qrBtn}>
                        <Text style={styles.qrBtnText}>Tampilkan QR</Text>
                      </Pressable>
                    </View>
                  </View>

                  <View style={{ height: 6 }} />
                  <Pressable onPress={() => setShowDetailModal(false)} style={[styles.modalBtn, { marginTop: 10 }]}>
                    <Text style={{ color: '#F4EEE6' }}>Tutup</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { color: '#F4EEE6', fontSize: 18, margin: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#AAA', textAlign: 'center', marginTop: 24 },

  orderCard: {
    backgroundColor: '#3B3535',
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A4242',
  },
  orderTitle: { color: '#F4EEE6', fontWeight: '700' },
  orderMeta: { color: '#E2D3B7' },
  orderMetaSmall: { color: '#AAA', fontSize: 12 },
  orderTotal: { color: '#F4EEE6', fontWeight: '700' },

  // modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#2F2A2A', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#4A4242' },
  modalTitle: { color: '#E2D3B7', fontWeight: '700', marginBottom: 6 },
  metaSmall: { color: '#AAA', marginTop: 2 },

  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B3535', padding: 10, borderRadius: 10, marginBottom: 8 },
  itemName: { color: '#F4EEE6', fontWeight: '600' },
  itemPrice: { color: '#E2D3B7' },

  qtyBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4A4242', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10, marginHorizontal: 8 },
  qtyBtn: { padding: 6 }, qtyText: { color: '#F4EEE6' }, qtyCount: { color: '#F4EEE6', minWidth: 20, textAlign: 'center' },

  removeBtn: { marginLeft: 8, backgroundColor: '#D9787C', padding: 8, borderRadius: 8 },

  totalLabel: { color: '#AAA' }, totalValue: { color: '#F4EEE6', fontSize: 18, fontWeight: '700' },

  qrBtn: { backgroundColor: '#E2D3B7', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  qrBtnText: { color: '#2F2A2A', fontWeight: '700' },

  modalBtn: { padding: 12, borderRadius: 8, alignItems: 'center', backgroundColor: '#3B3535' },
});
