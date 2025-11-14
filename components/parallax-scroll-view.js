// components/parallax-scroll-view.js
import React from 'react';
import { ScrollView, View } from 'react-native';
export default function ParallaxScrollView({ header, headerImage, headerBackgroundColor, children, ...rest }) {
  return (
    <ScrollView {...rest}>
      {headerImage ? <View style={{ width: '100%' }}>{headerImage}</View> : header ? <View>{header}</View> : null}
      <View style={{ paddingHorizontal: 16 }}>{children}</View>
    </ScrollView>
  );
}
