// screens/LaporanScreen.js
import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import ThemedView from '../components/themed-view';
import ThemedText from '../components/themed-text';
import Price from '../components/Price';
import { CartContext } from '../context/CartContext';

export default function LaporanScreen() {
  const {
    orders = [],
    removeOrder,
    notifyOrder,
    markOrderPaid,
    unmarkOrderPaid,
  } = useContext(CartContext);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // orders newest first
  const sorted = useMemo(() => (orders || []).slice().reverse(), [orders]);

  const openOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleNotify = (order) => {
    // try to use context method if provided, otherwise simulate with alert
    if (typeof notifyOrder === 'function') {
      try {
        notifyOrder(order.id);
        Alert.alert('Notifikasi dikirim', 'Barista akan menerima permintaan Anda.');
      } catch (e) {
        console.warn('notifyOrder error', e);
        Alert.alert('Gagal mengirim notifikasi', 'Coba lagi.');
      }
    } else {
      // simulasi notifikasi
      Alert.alert('Tunggu Panggilan', `Tunggu barista memanggil: "${order.customerName}".`);
    }
  };

  const handleRemove = (order) => {
    if (typeof removeOrder === 'function') {
      Alert.alert('Hapus Order', 'Yakin ingin menghapus order ini dari riwayat?', [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            removeOrder(order.id);
            closeModal();
          },
        },
      ]);
    } else {
      Alert.alert('Fungsi tidak tersedia', 'Fitur hapus belum tersedia pada context.');
    }
  };

  const renderOrder = ({ item }) => (
    <Pressable onPress={() => openOrder(item)} style={[styles.card, item.paid ? styles.paidCard : null]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.orderTitle}>Order #{item.id}</Text>
        <Text style={styles.orderMeta}>{item.customerName}{item.table ? ` • Kursi ${item.table}` : ''}</Text>
        <Text style={styles.orderTime}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Price value={item.total} style={styles.orderTotal} />
        <Text style={styles.orderStatus}>{item.paid ? 'LUNAS' : 'MENUNGGU'}</Text>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText style={styles.heading}>Riwayat Pemesanan</ThemedText>

        {sorted.length === 0 ? (
          <View style={styles.emptyWrap}>
            <ThemedText style={styles.emptyText}>Belum ada riwayat pemesanan.</ThemedText>
          </View>
        ) : (
          <FlatList
            data={sorted}
            keyExtractor={(i) => String(i.id)}
            renderItem={renderOrder}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}

        {/* detail modal */}
        <Modal visible={showModal} transparent animationType="slide" onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {!selectedOrder ? (
                <Text style={{ color: '#E2D3B7' }}>Memuat...</Text>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.modalTitle}>Order #{selectedOrder.id}</Text>
                    <Text style={styles.modalSmall}>{new Date(selectedOrder.createdAt).toLocaleString()}</Text>
                  </View>

                  <Text style={styles.meta}>Nama: <Text style={{ fontWeight: '700' }}>{selectedOrder.customerName}</Text></Text>
                  {selectedOrder.table ? <Text style={styles.meta}>Kursi: {selectedOrder.table}</Text> : null}
                  <View style={{ height: 8 }} />

                  <ScrollView style={{ maxHeight: 240 }}>
                    {selectedOrder.items.map((it) => (
                      <View key={it.id} style={styles.itemRow}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.itemName}>{it.name}</Text>
                          <Text style={styles.itemQty}>x{it.qty}</Text>
                        </View>
                        <Price value={it.price * it.qty} style={styles.itemPrice} />
                      </View>
                    ))}
                  </ScrollView>

                  <View style={{ height: 8 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Price value={selectedOrder.total} style={styles.totalValue} />
                  </View>

                  <View style={{ height: 12 }} />

                  <Pressable onPress={() => handleNotify(selectedOrder)} style={styles.notifyBtn}>
                    <Text style={styles.notifyText}>Tunggu barista memanggil nama kamu</Text>
                  </Pressable>

                  <View style={{ height: 8 }} />

                  {typeof removeOrder === 'function' ? (
                    <Pressable onPress={() => handleRemove(selectedOrder)} style={styles.removeBtn}>
                      <Text style={styles.removeText}>Hapus dari riwayat</Text>
                    </Pressable>
                  ) : null}

                  <View style={{ height: 8 }} />
                  <Pressable onPress={closeModal} style={styles.closeBtn}>
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
  heading: { fontSize: 18, color: '#E2D3B7', margin: 12 },
  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#AAA' },

  card: {
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
  paidCard: { borderColor: '#2FA84A' },
  orderTitle: { color: '#F4EEE6', fontWeight: '700' },
  orderMeta: { color: '#E2D3B7' },
  orderTime: { color: '#AAA', fontSize: 12 },
  orderTotal: { color: '#F4EEE6', fontWeight: '700' },
  orderStatus: { color: '#E2D3B7', marginTop: 6 },

  // modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#2F2A2A', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#4A4242' },
  modalTitle: { color: '#E2D3B7', fontWeight: '700', marginBottom: 6 },
  modalSmall: { color: '#AAA', fontSize: 12 },

  meta: { color: '#AAA', marginTop: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B3535', padding: 10, borderRadius: 8, marginBottom: 8 },
  itemName: { color: '#F4EEE6', fontWeight: '600' },
  itemQty: { color: '#AAA', fontSize: 12 },
  itemPrice: { color: '#E2D3B7' },

  totalLabel: { color: '#AAA' },
  totalValue: { color: '#F4EEE6', fontSize: 18, fontWeight: '700' },

  notifyBtn: { backgroundColor: '#E2D3B7', padding: 12, borderRadius: 10, alignItems: 'center' },
  notifyText: { color: '#2F2A2A', fontWeight: '700' },

  removeBtn: { backgroundColor: '#D9787C', padding: 10, borderRadius: 8, alignItems: 'center' },
  removeText: { color: '#2F2A2A', fontWeight: '700' },

  closeBtn: { padding: 10, borderRadius: 8, alignItems: 'center', backgroundColor: '#3B3535', marginTop: 6 },
});
