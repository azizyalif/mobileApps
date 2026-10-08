import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Impor komponen Gluestack UI v2
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

// Lucide Icons
import { Search, MapPin, Bed, Bath, Maximize2, ShoppingBag, Heart, Filter } from 'lucide-react-native';

import { PROPERTIES } from '@/app/(tabs)/index';
import { useCart } from '@/context/CartContext';

export default function ExploreScreen() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, isInCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Platinum', 'Emerald', 'Diamond'];

  // Filter properti berdasarkan pencarian dan kluster
  const filteredProperties = PROPERTIES.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Semua' ||
      property.cluster.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <Box className="flex-1 bg-background-0 dark:bg-background-950 pt-12 px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <HStack className="items-center justify-between mb-4">
          <VStack space="xs">
            <Heading size="xl" className="font-bold text-typography-900 dark:text-typography-50">
              Eksplorasi Unit
            </Heading>
            <Text className="font-semibold text-typography-700 dark:text-typography-200" size="xs">
              Rumah Nyaman, Hidup Tentram
            </Text>
          </VStack>

          {/* Tombol Cepat ke Keranjang */}
          <TouchableOpacity
            className="p-3 bg-background-50 dark:bg-background-900 rounded-full border border-outline-100 dark:border-outline-800 relative"
            onPress={() => router.push('/cart')}
          >
            <ShoppingBag size={20} color="#16a34a" />
            {cart.length > 0 && (
              <Box className="absolute -top-1 -right-1 bg-primary-600 rounded-full w-5 h-5 items-center justify-center">
                <Text size="xs" className="text-white font-bold">{cart.length}</Text>
              </Box>
            )}
          </TouchableOpacity>
        </HStack>

        {/* Search Bar Gluestack v2 */}
        <Box className="mb-4">
          <Input className="rounded-xl bg-background-50 dark:bg-background-900 border-outline-200 dark:border-outline-800 h-12">
            <InputSlot className="pl-3">
              <InputIcon as={Search} className="text-typography-400 dark:text-typography-500" />
            </InputSlot>
            <InputField
              placeholder="Cari lokasi atau nama unit..."
              className="text-typography-900 dark:text-typography-50"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
        </Box>

        {/* Kategori Kluster Filter Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <HStack space="xs" className="pr-4">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl border ${
                    isActive
                      ? 'bg-primary-600 border-primary-600'
                      : 'bg-background-50 dark:bg-background-900 border-outline-200 dark:border-outline-800'
                  }`}
                >
                  <Text
                    size="xs"
                    className={`font-semibold ${
                      isActive
                        ? 'text-white'
                        : 'text-typography-700 dark:text-typography-200'
                    }`}
                  >
                    {category === 'Semua' ? 'Semua Kluster' : `Kluster ${category}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </HStack>
        </ScrollView>

        {/* Ringkasan Hasil Search */}
        <HStack className="justify-between items-center mb-4">
          <Text size="sm" className="text-typography-500 dark:text-typography-400 font-medium">
            Menampilkan {filteredProperties.length} unit
          </Text>
        </HStack>

        {/* Daftar Kartu Properti */}
        {filteredProperties.length === 0 ? (
          <VStack className="items-center justify-center py-12 space-y-2">
            <Filter size={48} color="#9ca3af" />
            <Text size="md" className="font-bold text-typography-700 dark:text-typography-200">
              Tidak ada unit ditemukan
            </Text>
            <Text size="xs" className="text-typography-400 dark:text-typography-500 text-center">
              Coba kata kunci pencarian lain atau ubah filter kluster.
            </Text>
          </VStack>
        ) : (
          <VStack space="lg" className="pb-10">
            {filteredProperties.map((item) => {
              const inCart = isInCart(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.9}
                  onPress={() => router.push(`/property/${item.id}` as any)}
                >
                  <Box className="bg-background-0 dark:bg-background-900 rounded-2xl border border-outline-100 dark:border-outline-800 overflow-hidden shadow-xs">
                    <Box className="relative">
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: '100%', height: 190 }}
                        resizeMode="cover"
                      />

                      {/* Tombol Simpan / Keranjang Cepat */}
                      <TouchableOpacity
                        className="absolute top-3 right-3 bg-background-0/80 dark:bg-background-900/80 p-2 rounded-full"
                        onPress={() => {
                          if (inCart) {
                            removeFromCart(item.id);
                          } else {
                            addToCart(item);
                          }
                        }}
                      >
                        <Heart
                          size={18}
                          color={inCart ? '#ef4444' : '#6b7280'}
                          fill={inCart ? '#ef4444' : 'transparent'}
                        />
                      </TouchableOpacity>
                    </Box>

                    <Box className="p-4">
                      <HStack className="justify-between items-center mb-1">
                        <Text size="xs" className="font-semibold text-primary-600 dark:text-primary-400 uppercase">
                          {item.cluster}
                        </Text>
                        <Text size="xs" className="text-typography-400 dark:text-typography-500">
                          LB: {item.buildingArea}
                        </Text>
                      </HStack>

                      <Heading size="md" className="font-bold text-typography-900 dark:text-typography-50 mb-1">
                        {item.title}
                      </Heading>

                      <HStack space="xs" className="items-center mb-3">
                        <MapPin size={14} color="#9ca3af" />
                        <Text size="xs" className="text-typography-500 dark:text-typography-400">
                          {item.location}
                        </Text>
                      </HStack>

                      {/* Spesifikasi Ringkas */}
                      <HStack className="items-center justify-between p-2.5 bg-background-50 dark:bg-background-800 rounded-xl mb-4">
                        <HStack space="xs" className="items-center">
                          <Bed size={15} color="#9ca3af" />
                          <Text size="xs" className="text-typography-700 dark:text-typography-300">
                            {item.bedrooms} Bed
                          </Text>
                        </HStack>
                        <HStack space="xs" className="items-center">
                          <Bath size={15} color="#9ca3af" />
                          <Text size="xs" className="text-typography-700 dark:text-typography-300">
                            {item.bathrooms} Bath
                          </Text>
                        </HStack>
                        <HStack space="xs" className="items-center">
                          <Maximize2 size={15} color="#9ca3af" />
                          <Text size="xs" className="text-typography-700 dark:text-typography-300">
                            LT: {item.surfaceArea}
                          </Text>
                        </HStack>
                      </HStack>

                      {/* Aksi dan Harga */}
                      <HStack className="items-center justify-between">
                        <VStack>
                          <Text size="xs" className="text-typography-400 dark:text-typography-500">Mulai dari</Text>
                          <Text size="md" className="font-bold text-primary-600 dark:text-primary-400">
                            {item.price}
                          </Text>
                        </VStack>

                        <Button
                          size="sm"
                          className="bg-primary-600 dark:bg-primary-500 rounded-xl"
                          onPress={() => router.push(`/property/${item.id}` as any)}
                        >
                          <ButtonText className="text-white">Detail Unit</ButtonText>
                        </Button>
                      </HStack>
                    </Box>
                  </Box>
                </TouchableOpacity>
              );
            })}
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
}