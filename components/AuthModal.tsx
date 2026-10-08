import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { TouchableOpacity } from 'react-native';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authMode: 'login' | 'register';
  onSwitchMode: (mode: 'login' | 'register') => void;
  onSubmit: (data: { name?: string; email: string; pass: string }) => Promise<void>;
  loading: boolean;
}

export default function AuthModal({
  isOpen,
  onClose,
  authMode,
  onSwitchMode,
  onSubmit,
  loading,
}: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    await onSubmit({ name, email, pass: password });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent className="p-6">
        <ModalHeader className="justify-between items-center mb-2">
          <Heading size="lg">
            {authMode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}
          </Heading>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <VStack space="md" className="py-2">
            {authMode === 'register' && (
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
            )}

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

            <Button
              size="lg"
              className="mt-4 bg-primary-600"
              onPress={handleSubmit}
              isDisabled={loading}
            >
              <ButtonText>
                {loading
                  ? 'Memproses...'
                  : authMode === 'login'
                  ? 'Masuk Sekarang'
                  : 'Daftar Akun'}
              </ButtonText>
            </Button>

            <Box className="flex-row justify-center mt-4">
              <Text size="sm" className="text-typography-500">
                {authMode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  onSwitchMode(authMode === 'login' ? 'register' : 'login')
                }
              >
                <Text size="sm" className="font-bold text-primary-600">
                  {authMode === 'login' ? 'Daftar' : 'Masuk'}
                </Text>
              </TouchableOpacity>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}