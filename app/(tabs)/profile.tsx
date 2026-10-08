import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { useAuth } from '@/context/AuthContext';
import EditProfileModal from '@/components/EditProfileModal';
import AuthModal from '@/components/AuthModal';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { LogOut, ShieldCheck, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

const API_BASE_URL = 'http://192.168.18.12:5000/api/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const { isLoggedIn, userData, login, logout, updateUser, isLoading } = useAuth();

  // State Modal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Login / Register Submit Handler
  const handleAuthSubmit = async ({ name, email, pass }: { name?: string; email: string; pass: string }) => {
    if (!email || !pass || (authMode === 'register' && !name)) {
      Alert.alert('Peringatan', 'Silakan lengkapi semua data');
      return;
    }

    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password: pass });
        if (response.data.success) {
          await login(response.data.user, response.data.token);
          setShowAuthModal(false);
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password: pass });
        if (response.data.success) {
          Alert.alert('Berhasil', 'Akun berhasil dibuat, silakan masuk', [
            { text: 'OK', onPress: () => setAuthMode('login') },
          ]);
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Gagal terhubung ke server backend';
      Alert.alert(authMode === 'login' ? 'Login Gagal' : 'Registrasi Gagal', errorMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Edit Profil Save Handler
  const handleSaveProfile = async (newName: string) => {
    if (!newName.trim()) {
      Alert.alert('Peringatan', 'Nama tidak boleh kosong');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/profile`, {
        userId: userData?.id,
        name: newName,
      });

      if (response.data.success) {
        await updateUser(response.data.user);
        setShowEditProfileModal(false);
        Alert.alert('Sukses', 'Profil berhasil diperbarui!');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Gagal memperbarui profil';
      Alert.alert('Gagal', errorMsg);
    }
  };

  if (isLoading) {
    return (
      <Box className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background p-6">
      {!isLoggedIn ? (
        <Box className="flex-1 justify-center items-center p-4">
          <User size={64} color="#9ca3af" className="mb-4" />
          <Heading size="md" className="text-center mb-2">
            Akses Profil Terbatas
          </Heading>
          <Text size="sm" className="text-center text-typography-500 mb-6">
            Silakan masuk atau daftar akun terlebih dahulu untuk melihat informasi profil.
          </Text>
          <HStack space="sm">
            <Button
              size="lg"
              className="bg-primary-600 flex-1"
              onPress={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
            >
              <ButtonText>Masuk</ButtonText>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-600 flex-1"
              onPress={() => {
                setAuthMode('register');
                setShowAuthModal(true);
              }}
            >
              <ButtonText className="text-primary-600">Daftar</ButtonText>
            </Button>
          </HStack>
        </Box>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="xl" className="items-center mt-6 mb-8">
            <Avatar className="h-20 w-20 rounded-full bg-primary-600">
              <AvatarFallbackText>{userData?.name || 'User'}</AvatarFallbackText>
            </Avatar>
            <VStack space="xs" className="items-center">
              <Heading size="lg">{userData?.name}</Heading>
              <Text size="sm" className="text-typography-500">
                {userData?.email}
              </Text>
            </VStack>
          </VStack>

          <VStack space="md" className="mb-6">
            <Text size="xs" className="font-bold text-typography-400 uppercase tracking-wider">
              Akun Saya
            </Text>

            <TouchableOpacity
              onPress={() => setShowEditProfileModal(true)}
              className="flex-row items-center justify-between p-4 bg-card rounded-xl border border-border"
            >
              <Box className="flex-row items-center gap-3">
                <User size={20} color="#374151" />
                <Text size="sm" className="font-medium">
                  Edit Profil
                </Text>
              </Box>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4 bg-card rounded-xl border border-border">
              <Box className="flex-row items-center gap-3">
                <ShieldCheck size={20} color="#374151" />
                <Text size="sm" className="font-medium">
                  Keamanan & Kata Sandi
                </Text>
              </Box>
            </TouchableOpacity>
          </VStack>

          <Button
            variant="outline"
            action="negative"
            className="rounded-xl border-error-500"
            onPress={logout}
          >
            <LogOut size={18} color="#DC2626" />
            <ButtonText className="text-error-600 ml-2">Keluar Akun</ButtonText>
          </Button>
        </ScrollView>
      )}

      {/* MODAL EDIT PROFIL */}
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        currentName={userData?.name || ''}
        currentEmail={userData?.email || ''}
        onSave={handleSaveProfile}
      />

      {/* MODAL AUTH (LOGIN / REGISTER) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        authMode={authMode}
        onSwitchMode={setAuthMode}
        onSubmit={handleAuthSubmit}
        loading={authLoading}
      />
    </Box>
  );
}