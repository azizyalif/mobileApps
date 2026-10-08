import React, { useState } from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
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
import { Bed, Bath, Maximize2, MapPin, Search } from 'lucide-react-native';

export const PROPERTIES = [
  {
    id: '1',
    title: 'Tentram Residence Tipe 36',
    cluster: 'Kluster Platinum',
    price: 'Rp 450.000.000',
    location: 'Semarang Barat, Semarang',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    bedrooms: 2,
    bathrooms: 1,
    surfaceArea: '72 m²',
    buildingArea: '36 m²',
    description: 'Unit rumah modern minimalis cocok untuk keluarga muda. Dilengkapi dengan taman depan, carport, dan sistem keamanan 24 jam.',
    features: ['Keamanan 24 Jam', 'One Gate System', 'Taman Bermain', 'Air PDAM'],
  },
  {
    id: '2',
    title: 'Tentram Emerald Tipe 45',
    cluster: 'Kluster Emerald',
    price: 'Rp 650.000.000',
    location: 'Semarang Selatan, Semarang',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    bedrooms: 3,
    bathrooms: 2,
    surfaceArea: '90 m²',
    buildingArea: '45 m²',
    description: 'Hunian asri dengan desain scandinavian modern. Memiliki pencahayaan alami yang sangat baik dan kanopi carport gratis.',
    features: ['Clubhouse', 'Kolam Renang', 'CCTV 24 Jam', 'Smart Home System'],
  },
  {
    id: '3',
    title: 'Tentram Luxury Tipe 70',
    cluster: 'Kluster Diamond',
    price: 'Rp 1.100.000.000',
    location: 'Semarang Atas, Semarang',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    bedrooms: 4,
    bathrooms: 3,
    surfaceArea: '120 m²',
    buildingArea: '70 m²',
    description: 'Rumah mewah 2 lantai dengan panorama pemandangan kota. Dilengkapi fasilitas premium dan lokasi sangat strategis dekat jalan tol.',
    features: ['Privat Pool', 'Smart Lock Door', 'Solar Panel', 'Balkon Atas'],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredProperties = PROPERTIES.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.cluster.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className="flex-1 bg-background-0 p-4 pt-12">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Greeting */}
        <VStack space="xs" className="mb-6">
          <Text size="sm" className="text-typography-500">
            Selamat Datang di
          </Text>
          <Heading size="2xl" className="font-bold text-primary-600">
            Perumahan Tentram
          </Heading>
          <Text size="sm" className="text-typography-500">
            Temukan hunian impian Anda dengan kenyamanan maksimal.
          </Text>
        </VStack>

        {/* Search Bar Gluestack v2 */}
        <Box className="mb-6">
          <Input className="rounded-xl bg-background-50 border-outline-200 h-12">
            <InputSlot className="pl-3">
              <InputIcon as={Search} className="text-typography-400" />
            </InputSlot>
            <InputField
              placeholder="Cari tipe rumah atau kluster..."
              value={search}
              onChangeText={setSearch}
            />
          </Input>
        </Box>

        {/* List Unit Rumah */}
        <Heading size="lg" className="mb-4">
          Pilihan Unit Rumah
        </Heading>

        <VStack space="lg" className="pb-8">
          {filteredProperties.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => router.push(`/property/${item.id}` as any)}
            >
              <Box className="bg-background-0 rounded-2xl border border-outline-100 overflow-hidden shadow-sm">
                <Image
                  source={{ uri: item.image }}
                  style={{ width: '100%', height: 180 }}
                  resizeMode="cover"
                />
                <Box className="p-4">
                  <Text size="xs" className="font-semibold text-primary-600 uppercase mb-1">
                    {item.cluster}
                  </Text>
                  <Heading size="md" className="font-bold mb-1">
                    {item.title}
                  </Heading>

                  <HStack space="xs" className="items-center mb-3">
                    <MapPin size={14} color="#6b7280" />
                    <Text size="xs" className="text-typography-500">
                      {item.location}
                    </Text>
                  </HStack>

                  {/* Spesifikasi Ringkas */}
                  <HStack className="items-center justify-between py-2 px-3 bg-background-50 rounded-lg mb-3">
                    <HStack space="xs" className="items-center">
                      <Bed size={16} color="#4b5563" />
                      <Text size="xs">{item.bedrooms} Kamar</Text>
                    </HStack>
                    <HStack space="xs" className="items-center">
                      <Bath size={16} color="#4b5563" />
                      <Text size="xs">{item.bathrooms} KM</Text>
                    </HStack>
                    <HStack space="xs" className="items-center">
                      <Maximize2 size={16} color="#4b5563" />
                      <Text size="xs">{item.buildingArea}</Text>
                    </HStack>
                  </HStack>

                  <HStack className="items-center justify-between">
                    <Text size="lg" className="font-bold text-primary-600">
                      {item.price}
                    </Text>
                    <Button size="sm" className="bg-primary-600 rounded-lg">
                      <ButtonText>Lihat Detail</ButtonText>
                    </Button>
                  </HStack>
                </Box>
              </Box>
            </TouchableOpacity>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}