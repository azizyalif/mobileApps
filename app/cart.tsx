import React from 'react';
import { ScrollView, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Impor komponen Gluestack UI v2
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';

import { ArrowLeft, Trash2, ShoppingBag, Send } from 'lucide-react-native';
import { useCart } from '@/context/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const totalPrice = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);

  const formatRupiah = (number: number) => {
    return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleCheckoutWhatsApp = () => {
    if (cart.length === 0) return;

    const unitList = cart.map((item, index) => `${index + 1}. ${item.title} (${item.price})`).join('\n');
    const message = `Halo Sales Perumahan Tentram,\nSaya ingin mengajukan pemesanan untuk unit berikut:\n\n${unitList}\n\n*Total Estimasi:* ${formatRupiah(totalPrice)}\n\nMohon informasi langkah selanjutnya untuk survey dan reservasi. Terima kasih!`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Error', 'Gagal membuka WhatsApp. Pastikan aplikasi terpasang di perangkat Anda.');
    });
  };

  return (
    <Box className="flex-1 bg-background-0 dark:bg-background-950 pt-12">
      {/* Header */}
      <HStack className="items-center justify-between px-4 pb-4 border-b border-outline-100 dark:border-outline-800">
        <HStack space="sm" className="items-center">
          <TouchableOpacity onPress={() => router.back()} className="p-1">
            <ArrowLeft size={22} color="#9ca3af" />
          </TouchableOpacity>
          <Heading size="lg" className="font-bold text-typography-900 dark:text-typography-50">
            Keranjang Pemesanan
          </Heading>
        </HStack>

        {cart.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Text size="xs" className="text-error-500 dark:text-error-400 font-semibold">
              Kosongkan
            </Text>
          </TouchableOpacity>
        )}
      </HStack>

      {/* Body List */}
      {cart.length === 0 ? (
        <VStack className="flex-1 items-center justify-center p-6 space-y-3">
          <ShoppingBag size={64} color="#9ca3af" />
          <Heading size="md" className="text-typography-500 dark:text-typography-400 text-center">
            Keranjang Pemesanan Masih Kosong
          </Heading>
          <Text size="sm" className="text-typography-400 dark:text-typography-500 text-center mb-4">
            Anda belum menambahkan unit rumah ke dalam daftar keranjang.
          </Text>
          <Button 
            size="default" 
            className="bg-primary-600 dark:bg-primary-500 rounded-xl" 
            onPress={() => router.push('/(tabs)' as any)}
          >
            <ButtonText className="text-white">Cari Unit Rumah</ButtonText>
          </Button>
        </VStack>
      ) : (
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <VStack space="md" className="pb-6">
            {cart.map((item) => (
              <Box key={item.id} className="bg-background-0 dark:bg-background-900 rounded-2xl border border-outline-100 dark:border-outline-800 p-3 shadow-xs">
                <HStack space="md" className="items-center">
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 90, height: 90, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                  <VStack className="flex-1 justify-between">
                    <Box>
                      <Text size="xs" className="text-primary-600 dark:text-primary-400 font-semibold uppercase">
                        {item.cluster}
                      </Text>
                      <Text size="sm" className="font-bold text-typography-900 dark:text-typography-50" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text size="xs" className="text-typography-500 dark:text-typography-400">
                        {item.location}
                      </Text>
                    </Box>

                    <HStack className="items-center justify-between mt-2">
                      <Text size="sm" className="font-bold text-primary-600 dark:text-primary-400">
                        {item.price}
                      </Text>
                      <TouchableOpacity onPress={() => removeFromCart(item.id)} className="p-1">
                        <Trash2 size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </ScrollView>
      )}

      {/* Fixed Bottom Checkout Bar */}
      {cart.length > 0 && (
        <Box className="p-4 bg-background-0 dark:bg-background-950 border-t border-outline-100 dark:border-outline-800">
          <HStack className="items-center justify-between mb-3">
            <Text size="sm" className="text-typography-500 dark:text-typography-400">Total Unit Dipilih ({cart.length})</Text>
            <Text size="xl" className="font-bold text-primary-600 dark:text-primary-400">
              {formatRupiah(totalPrice)}
            </Text>
          </HStack>

          <Button size="lg" className="bg-primary-600 dark:bg-primary-500 rounded-xl" onPress={handleCheckoutWhatsApp}>
            <Send size={18} color="#ffffff" />
            <ButtonText className="ml-2 text-white">Ajukan Pemesanan via WA</ButtonText>
          </Button>
        </Box>
      )}
    </Box>
  );
}