import React from 'react';
import { Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Impor komponen Gluestack UI v2
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';

// Icons
import { ArrowLeft, Bed, Bath, Maximize2, MapPin, CheckCircle2, ShoppingBag } from 'lucide-react-native';

import { PROPERTIES } from '@/app/(tabs)';
import { useCart } from '@/context/CartContext';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, removeFromCart, isInCart, cart } = useCart();

  const property = PROPERTIES.find((item) => item.id === id) || PROPERTIES[0];
  const added = isInCart(property.id);

  const handleCartToggle = () => {
    if (added) {
      removeFromCart(property.id);
    } else {
      addToCart(property);
    }
  };

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Image & Top Header Actions */}
        <Box className="relative">
          <Image
            source={{ uri: property.image }}
            style={{ width: '100%', height: 280 }}
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-12 left-4 bg-background-0/80 p-2.5 rounded-full"
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#1f2937" />
          </TouchableOpacity>

          {/* Shortcut ke Keranjang */}
          <TouchableOpacity
            className="absolute top-12 right-4 bg-background-0/80 p-2.5 rounded-full flex-row items-center"
            onPress={() => router.push('/cart' as any)}
          >
            <ShoppingBag size={20} color="#1f2937" />
            {cart.length > 0 && (
              <Box className="absolute -top-1 -right-1 bg-primary-600 rounded-full w-5 h-5 items-center justify-center">
                <Text size="xs" className="text-white font-bold">{cart.length}</Text>
              </Box>
            )}
          </TouchableOpacity>
        </Box>

        {/* Content Section */}
        <Box className="p-6 -mt-6 bg-background-0 rounded-t-3xl">
          <Text size="xs" className="font-bold text-primary-600 uppercase mb-1">
            {property.cluster}
          </Text>
          <Heading size="xl" className="font-bold mb-2">
            {property.title}
          </Heading>

          <HStack space="xs" className="items-center mb-4">
            <MapPin size={16} color="#6b7280" />
            <Text size="sm" className="text-typography-500">
              {property.location}
            </Text>
          </HStack>

          <Text size="2xl" className="font-bold text-primary-600 mb-6">
            {property.price}
          </Text>

          {/* Grid Spesifikasi Utama */}
          <HStack className="justify-between p-4 bg-background-50 rounded-2xl border border-outline-100 mb-6">
            <VStack space="xs" className="items-center flex-1">
              <Bed size={20} color="#16a34a" />
              <Text size="xs" className="text-typography-500">Kamar Tidur</Text>
              <Text size="sm" className="font-bold">{property.bedrooms}</Text>
            </VStack>

            <VStack space="xs" className="items-center flex-1 border-x border-outline-200">
              <Bath size={20} color="#16a34a" />
              <Text size="xs" className="text-typography-500">Kamar Mandi</Text>
              <Text size="sm" className="font-bold">{property.bathrooms}</Text>
            </VStack>

            <VStack space="xs" className="items-center flex-1">
              <Maximize2 size={20} color="#16a34a" />
              <Text size="xs" className="text-typography-500">Luas Bangunan</Text>
              <Text size="sm" className="font-bold">{property.buildingArea}</Text>
            </VStack>
          </HStack>

          {/* Deskripsi */}
          <VStack space="xs" className="mb-6">
            <Heading size="md" className="font-bold">Deskripsi Unit</Heading>
            <Text size="sm" className="text-typography-600 leading-relaxed">
              {property.description}
            </Text>
          </VStack>

          {/* Fasilitas */}
          <VStack space="xs" className="mb-8">
            <Heading size="md" className="font-bold mb-2">Fasilitas Utama</Heading>
            <Box className="flex-row flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <HStack key={index} space="xs" className="items-center bg-background-50 px-3 py-2 rounded-xl border border-outline-100">
                  <CheckCircle2 size={16} color="#16a34a" />
                  <Text size="xs" className="font-medium">{feature}</Text>
                </HStack>
              ))}
            </Box>
          </VStack>
        </Box>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <HStack space="md" className="p-4 bg-background-0 border-t border-outline-100">
        <Button
          size="lg"
          variant={added ? "outline" : "default"}
          className={`flex-1 rounded-xl ${added ? 'border-error-500' : 'bg-primary-600'}`}
          onPress={handleCartToggle}
        >
          <ButtonText className={added ? 'text-error-500' : 'text-white'}>
            {added ? 'Hapus dari Keranjang' : '+ Keranjang'}
          </ButtonText>
        </Button>

        <Button
          size="lg"
          variant="default"
          className="flex-1 bg-primary-600 rounded-xl"
          onPress={() => {
            if (!added) addToCart(property);
            router.push('/cart' as any);
          }}
        >
          <ButtonText>Lihat Keranjang</ButtonText>
        </Button>
      </HStack>
    </Box>
  );
}