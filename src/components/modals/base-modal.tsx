import { useDisclosure } from '@mantine/hooks';
import { Box, Modal, ModalProps } from '@mantine/core';
import React from 'react';

export const BaseModalWrapper = ({
  open,
  content,
  footer,
  ...baseModalProps
}: Omit<
  ModalProps & {
    open: boolean;
    content?: React.ReactNode;
    footer?: React.ReactNode;
  },
  'onClose' | 'opened'
>) => {
  const [opened, { open: _open, close }] = useDisclosure(open);

  return (
    <Modal
      {...baseModalProps}
      opened={opened}
      onClose={close}
      centered={true}
      overlayBlur={3}
      overlayOpacity={0.8}
      closeOnClickOutside
    >
      {content}
      <Box mt={12} />
      {footer}
    </Modal>
  );
};
