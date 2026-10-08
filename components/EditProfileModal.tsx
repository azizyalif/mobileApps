import React, { useState, useEffect } from 'react';
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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentEmail: string;
  onSave: (newName: string) => Promise<void>;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  currentName,
  currentEmail,
  onSave,
}: EditProfileModalProps) {
  const [editName, setEditName] = useState(currentName);
  const [savingProfile, setSavingProfile] = useState(false);

  // Update state lokal setiap kali modal dibuka/nama berubah
  useEffect(() => {
    setEditName(currentName);
  }, [currentName, isOpen]);

  const handleSave = async () => {
    setSavingProfile(true);
    await onSave(editName);
    setSavingProfile(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent className="p-6">
        <ModalHeader className="justify-between items-center mb-2">
          <Heading size="lg">Edit Profil</Heading>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <VStack space="md" className="py-2">
            <VStack space="xs">
              <Text size="sm" className="font-medium">
                Nama Lengkap
              </Text>
              <Input>
                <InputField
                  placeholder="Masukkan nama baru"
                  value={editName}
                  onChangeText={setEditName}
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text size="sm" className="font-medium">
                Email (Tidak dapat diubah)
              </Text>
              <Input isDisabled>
                <InputField value={currentEmail} />
              </Input>
            </VStack>

            <Button
              size="lg"
              className="mt-4 bg-primary-600"
              onPress={handleSave}
              isDisabled={savingProfile}
            >
              <ButtonText>
                {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}