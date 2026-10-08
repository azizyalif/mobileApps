import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)' as any);
      // router.replace({ pathname: '/(tabs)' });
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

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
        <Text className="font-semibold text-typography-700 dark:text-typography-200">
          Rumah Nyaman, Hidup Tentram
        </Text>
      </Center>
    </Box>
  );
}