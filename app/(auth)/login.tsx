import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, TouchableOpacity } from 'react-native';

const API_URL = 'http://192.168.18.12:5000/api/auth/login';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Peringatan', 'Silakan isi email dan kata sandi');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, { email, password });
      if (response.data.success) {
        // Berhasil login -> pindah ke Halaman Utama
        router.replace('/(tabs)' as any);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal terhubung ke server';
      Alert.alert('Login Gagal', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex-1 bg-background justify-center p-6">
      <VStack space="lg" className="items-center mb-6">
        <Image
          source={require('@/assets/images/logoApps.png')}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
        <Heading size="xl" className="text-center font-bold">
          Masuk ke Tentram
        </Heading>
        <Text size="sm" className="text-typography-500 text-center">
          Silakan masuk untuk melanjutkan pencarian rumah
        </Text>
      </VStack>

      <VStack space="md">
        <VStack space="xs">
          <Text size="sm" className="font-medium">
            Email
          </Text>
          <Input>
            <InputField
              placeholder="Masukkan email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Input>
        </VStack>

        <VStack space="xs">
          <Text size="sm" className="font-medium">
            Kata Sandi
          </Text>
          <Input>
            <InputField
              placeholder="Masukkan kata sandi"
              type="password"
              value={password}
              onChangeText={setPassword}
            />
          </Input>
        </VStack>

        <Button size="lg" className="mt-4 bg-primary-600" onPress={handleLogin} isDisabled={loading}>
          <ButtonText>{loading ? 'Memproses...' : 'Masuk'}</ButtonText>
        </Button>

        <Box className="flex-row justify-center mt-4">
          <Text size="sm" className="text-typography-500">
            Belum punya akun?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register' as any)}>
            <Text size="sm" className="font-bold text-primary-600">
              Daftar Sekarang
            </Text>
          </TouchableOpacity>
        </Box>
      </VStack>
    </Box>
  );
}