// screens/PesanScreen.js
import React, { useState, useContext, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  TextInput,
  FlatList,
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';
import ThemedText from '../components/themed-text';
import ThemedView from '../components/themed-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import Price from '../components/Price';
import { fetchMenu } from '../api/menuService';

export default function PesanScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { add, items, makeOrder, total } = useContext(CartContext);
  const [query, setQuery] = useState('');

  // kategori: 'semua' | 'makanan' | 'minuman'
  const [category, setCategory] = useState('semua');

  // modal untuk input nama + meja saat buat order
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [table, setTable] = useState('');

  // menu state dari API
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // prefill dari Dashboard
  useEffect(() => {
    if (route.params?.customerName) setCustomerName(route.params.customerName);
    if (route.params?.table) setTable(route.params.table);
  }, [route.params]);

  // -- helper: tebakan kategori dari nama (lebih aman, tidak memicu "spesial") --
  const guessCategoryFromName = (name) => {
    if (!name) return 'makanan';
    const s = name.toLowerCase();

    // kata/kombinasi yang jelas menandakan minuman
    const drinkKeywords = [
      'es ', 'es-', 'es.', 'es campur', 'es buah', 'es teh', 'es kopi',
      'teh', 'jeruk', 'orange', 'jus', 'juice', 'soda',
      'air mineral', 'mineral',
      'kopi', 'latte', 'americano', 'cappuccino', 'espresso',
      'milkshake', 'shake', 'gula aren', 'gulaaren', 'coklat', 'choco',
      'smoothie', 'milk', 'matcha'
    ];

    for (const k of drinkKeywords) {
      if (s.includes(k)) return 'minuman';
    }

    if (/\bes\b/.test(s)) return 'minuman';

    return 'makanan';
  };

  // fetch menu on mount
  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMenu();
      const normalized = (data || []).map(i => {
        const serverCat = (i.category || '').toString().toLowerCase().trim();
        const isValid = serverCat === 'makanan' || serverCat === 'minuman';
        const finalCat = isValid ? serverCat : guessCategoryFromName(i.name);
        return { ...i, category: finalCat };
      });
      setMenu(normalized);
    } catch (e) {
      console.warn('fetchMenu error', e);
      setError(e.message || 'Gagal memuat menu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMenu();
  };

  // filter by category and query
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (menu || []).filter(item => {
      const catOk = category === 'semua' ? true : (item.category === category);
      const queryOk = q ? (item.name || '').toLowerCase().includes(q) : true;
      return catOk && queryOk;
    });
  }, [menu, category, query]);

  const handleAdd = (item) => {
    add(item);
  };

  const renderItem = ({ item }) => (
    <ProductCard item={item} onAdd={() => handleAdd(item)} />
  );

  const cartCount = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);
  const cartTotal = useMemo(() => total || items.reduce((s, it) => s + it.price * it.qty, 0), [items, total]);

  const handleCreateOrderPress = () => {
    if (items.length === 0) {
      Alert.alert('Keranjang kosong', 'Tambahkan menu terlebih dahulu sebelum membuat pesanan.');
      return;
    }
    setShowOrderModal(true);
  };

  // Setelah konfirmasi: buat order lalu langsung ke PaymentQr (kirim customerName)
  const handleConfirmCreateOrder = () => {
    if (!customerName || !customerName.trim()) {
      Alert.alert('Nama harus diisi', 'Masukkan nama untuk konfirmasi pesanan.');
      return;
    }

    const cleanName = customerName.trim();
    const order = makeOrder({ customerName: cleanName, table: table.trim() || null });

    // tutup modal
    setShowOrderModal(false);

    // langsung ke halaman QR dan kirim juga nama pembeli
    navigation.navigate('PaymentQr', {
      orderId: order.id,
      total: order.total,
      customerName: cleanName,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedText style={styles.title}>WarungKU</ThemedText>

        <View style={styles.searchWrap}>
          <TextInput
            placeholder="cari menu..."
            placeholderTextColor="#AAA"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </View>

        {/* kategori filter */}
        <View style={styles.categoryWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
            <Pressable onPress={() => setCategory('semua')} style={[styles.chip, category === 'semua' ? styles.chipActive : null]}>
              <Text style={category === 'semua' ? styles.chipTextActive : styles.chipText}>Semua</Text>
            </Pressable>

            <Pressable onPress={() => setCategory('makanan')} style={[styles.chip, category === 'makanan' ? styles.chipActive : null]}>
              <Text style={category === 'makanan' ? styles.chipTextActive : styles.chipText}>Makanan</Text>
            </Pressable>

            <Pressable onPress={() => setCategory('minuman')} style={[styles.chip, category === 'minuman' ? styles.chipActive : null]}>
              <Text style={category === 'minuman' ? styles.chipTextActive : styles.chipText}>Minuman</Text>
            </Pressable>
          </ScrollView>
        </View>

        <ThemedText style={styles.sectionTitle}>Pilihan Menu</ThemedText>

        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text style={{ color: '#AAA', marginTop: 8 }}>Memuat menu...</Text>
          </View>
        ) : error ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#E2D3B7' }}>Gagal memuat menu</Text>
            <Text style={{ color: '#AAA', marginTop: 6 }}>{error}</Text>
            <Pressable onPress={loadMenu} style={{ marginTop: 12, backgroundColor:'#E2D3B7', padding:8, borderRadius:8 }}>
              <Text style={{ color:'#2F2A2A' }}>Coba Lagi</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(i) => String(i.id)}
            numColumns={2}
            columnWrapperStyle={styles.column}
            renderItem={renderItem}
            contentContainerStyle={data.length === 0 ? styles.emptyContainer : null}
            ListEmptyComponent={<ThemedText style={styles.emptyText}>Tidak ada menu.</ThemedText>}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </SafeAreaView>

      {/* Bottom cart bar */}
      <View style={styles.cartBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cartText}>Items: {cartCount}</Text>
          <Text style={styles.cartTotal}>Total: <Price value={cartTotal} style={{ color: '#F4EEE6' }} /></Text>
        </View>

        <Pressable
          onPress={handleCreateOrderPress}
          style={[styles.createBtn, items.length === 0 ? styles.createBtnDisabled : null]}
          disabled={items.length === 0}
        >
          <Text style={styles.createBtnText}>Buat Pesan</Text>
        </Pressable>
      </View>

      {/* Modal konfirmasi nama + meja */}
      <Modal visible={showOrderModal} transparent animationType="slide" onRequestClose={() => setShowOrderModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Konfirmasi Nama & Kursi</Text>

            <TextInput
              placeholder="Nama (wajib)"
              placeholderTextColor="#AAA"
              value={customerName}
              onChangeText={setCustomerName}
              style={styles.modalInput}
            />

            <View style={{ height: 8 }} />

            <TextInput
              placeholder="Nomor Kursi / Meja (opsional)"
              placeholderTextColor="#AAA"
              value={table}
              onChangeText={setTable}
              style={styles.modalInput}
            />

            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <Pressable onPress={() => setShowOrderModal(false)} style={[styles.modalBtn, { marginRight: 8 }]}>
                <Text style={{ color: '#F4EEE6' }}>Batal</Text>
              </Pressable>
              <Pressable onPress={handleConfirmCreateOrder} style={[styles.modalBtn, styles.modalConfirm]}>
                <Text style={{ color: '#2F2A2A', fontWeight: '700' }}>Konfirmasi</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 20, margin: 12, color: '#E2D3B7' },
  searchWrap: {
    backgroundColor: '#3B3535',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: { flex: 1, color: '#F4EEE6', paddingVertical: 6 },

  /* category chips */
  categoryWrap: { marginTop: 10, marginBottom: 6 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#E2D3B7',
  },
  chipText: { color: '#AAA', fontWeight: '600' },
  chipTextActive: { color: '#2F2A2A', fontWeight: '700' },

  sectionTitle: { marginTop: 6, marginBottom: 8, marginLeft: 16, color: '#E2D3B7' },
  column: { justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#AAA' },

  cartBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: '#3B3535',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A4242',
  },
  cartText: { color: '#AAA' },
  cartTotal: { color: '#F4EEE6', fontWeight: '700' },

  createBtn: {
    marginLeft: 12,
    backgroundColor: '#E2D3B7',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  createBtnDisabled: { backgroundColor: '#888' },
  createBtnText: { color: '#2F2A2A', fontWeight: '700' },

  // modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#2F2A2A', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#4A4242' },
  modalTitle: { color: '#E2D3B7', fontWeight: '700', marginBottom: 8 },
  modalInput: { backgroundColor: '#3B3535', color: '#F4EEE6', padding: 10, borderRadius: 8 },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', backgroundColor: '#3B3535' },
  modalConfirm: { backgroundColor: '#E2D3B7' },
});
