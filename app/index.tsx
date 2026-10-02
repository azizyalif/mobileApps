import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Image } from 'react-native';
import React from 'react';

export default function Home() {
  return (
    <Box className="flex-1 bg-background">
      <Center className="flex-1 gap-5">
        <Image
          source={require('@/assets/images/logoApps.png')}
          style={{
            width: 220,
            height: 220,
          }}
          resizeMode="contain"
        />
        <Text className="font-semibold">
          Rumah Nyaman, Hidup Tentram
        </Text>
      </Center>
    </Box>
  );
}