import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

const API_URL = 'http://192.168.18.12:5000/api/auth/register';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Peringatan', 'Semua kolom wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, { name, email, password });
      if (response.data.success) {
        Alert.alert('Sukses', 'Akun berhasil dibuat, silakan login', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login' as any) },
        ]);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal mendaftar, coba lagi';
      Alert.alert('Registrasi Gagal', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex-1 bg-background justify-center p-6">
      <VStack space="md" className="mb-6">
        <Heading size="xl" className="font-bold">
          Buat Akun Baru
        </Heading>
        <Text size="sm" className="text-typography-500">
          Lengkapi data di bawah ini untuk mendaftar
        </Text>
      </VStack>

      <VStack space="md">
        <VStack space="xs">
          <Text size="sm" className="font-medium">
            Nama Lengkap
          </Text>
          <Input>
            <InputField
              placeholder="Masukkan nama lengkap"
              value={name}
              onChangeText={setName}
            />
          </Input>
        </VStack>

        <VStack space="xs">
          <Text size="sm" className="font-medium">
            Email
          </Text>
          <Input>
            <InputField
              placeholder="Masukkan email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </Input>
        </VStack>

        <VStack space="xs">
          <Text size="sm" className="font-medium">
            Kata Sandi
          </Text>
          <Input>
            <InputField
              placeholder="Buat kata sandi"
              type="password"
              value={password}
              onChangeText={setPassword}
            />
          </Input>
        </VStack>

        <Button size="lg" className="mt-4 bg-primary-600" onPress={handleRegister} isDisabled={loading}>
          <ButtonText>{loading ? 'Memproses...' : 'Daftar'}</ButtonText>
        </Button>

        <Box className="flex-row justify-center mt-4">
          <Text size="sm" className="text-typography-500">
            Sudah punya akun?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
            <Text size="sm" className="font-bold text-primary-600">
              Masuk
            </Text>
          </TouchableOpacity>
        </Box>
      </VStack>
    </Box>
  );
}