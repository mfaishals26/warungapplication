// navigation/RootTabs.js
import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DashboardScreen';
import PesanScreen from '../screens/PesanScreen';
import BayarScreen from '../screens/BayarScreen';
import LaporanScreen from '../screens/LaporanScreen';
import PaymentQrScreen from '../screens/PaymentQrScreen';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

const Tab = createBottomTabNavigator();

// custom compact center-aligned tab bar
function CompactCenterTabBar({ state, descriptors, navigation }) {
  // label short mapping
  const labelMap = {
    Dashboard: 'Home',
    Pesan: 'Pesan',
    Bayar: 'Bayar',
    Laporan: 'Laporan',
  };

  // icon mapping
  const icons = {
    Dashboard: Platform.OS === 'ios' ? 'home-outline' : 'home',
    Pesan: Platform.OS === 'ios' ? 'cafe-outline' : 'cafe',
    Bayar: Platform.OS === 'ios' ? 'cart-outline' : 'cart',
    Laporan: Platform.OS === 'ios' ? 'analytics-outline' : 'analytics',
  };

  // build visible tabs (skip hidden ones like PaymentQr)
  const routes = state.routes.filter(r => r.name !== 'PaymentQr');

  return (
    <View style={styles.barWrap}>
      <View style={styles.centerContainer}>
        {routes.map((route, idx) => {
          const focused = state.index === state.routes.findIndex(r => r.key === route.key);
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

          const name = icons[route.name] ?? 'ellipse';
          const label = labelMap[route.name] ?? route.name;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={descriptors[route.key]?.options?.tabBarAccessibilityLabel}
              testID={descriptors[route.key]?.options?.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tabItem, focused ? styles.tabItemActive : null]}
              activeOpacity={0.8}
            >
              <Ionicons name={name} size={20} color={focused ? Colors.dark.tint : (Colors.dark.tabIconDefault || '#AAA')} />
              <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : null]} numberOfLines={1}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // we hide built-in labels because custom bar handles them
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CompactCenterTabBar {...props} />}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Pesan" component={PesanScreen} />
      <Tab.Screen name="Bayar" component={BayarScreen} />
      <Tab.Screen name="Laporan" component={LaporanScreen} />

      {/* hidden route */}
      <Tab.Screen
        name="PaymentQr"
        component={PaymentQrScreen}
        options={{ tabBarButton: () => null, headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  barWrap: {
    backgroundColor: Colors.dark.card || '#3B3535',
    borderTopWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // center cluster
    // optional: give a slightly raised pill background
    // Uncomment next line to see pill behind tabs:
    // backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 40, paddingVertical: 6, paddingHorizontal: 8,
  },
  tabItem: {
    width: 82,              // fixed width so label doesn't stretch
    height: 46,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    // subtle background for active tab
    backgroundColor: 'rgba(226, 211, 183, 0.12)',
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 11,
    color: Colors.dark.tabIconDefault || '#AAA',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: Colors.dark.tint,
  },
});
