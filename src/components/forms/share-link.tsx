import { Share } from '@/src/constants/icons/settings';
import {
  Box,
  Button,
  Center,
  Container,
  Drawer,
  Group,
  Portal,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import React, { useState } from 'react';

type Props = {
  title: string;
  copy: string;
};
export const ShareLink = ({ title, copy }: Props) => {
  const [openShareLinkDrawer, setOpenShareLinkDrawer] = useState(false);
  return (
    <div>
      <Portal>
        <Drawer
          opened={openShareLinkDrawer}
          onClose={() => setOpenShareLinkDrawer(false)}
          position="bottom"
          title="Share link"
          styles={{
            title: {
              padding: '20px',
              fontSize: '20px',
            },
            closeButton: {
              marginRight: '20px',
            },
            drawer: {
              borderRadius: '20px 20px 0 0',
              background: '#F4F9FE',
            },
          }}
          size="max-content"
        >
          <Container mt={-20}>
            <Stack spacing={3}>
              <SimpleGrid sx={{ gridTemplateColumns: '4fr 1fr' }}>
                <TextInput variant="filled" size="md" radius={8} />
                <Button
                  radius={8}
                  size="md"
                  styles={{
                    filled: {
                      background: '#ACB7CA',
                      '&:hover': {
                        background: '#ACB7CA',
                      },
                      height: '100%',
                    },
                    label: { color: '#fff' },
                  }}
                >
                  {copy}
                </Button>
              </SimpleGrid>
            </Stack>
          </Container>
          <Space h={40} />
        </Drawer>
      </Portal>
      <UnstyledButton
        id="btn-profileShareApp"
        onClick={() => {
          //ZK: Share code triggering native view in mobile app
          // @ts-ignore
          if (window?.ReactNativeWebView === undefined) {
            //This means we are not in ReactNative webView so open in new link as target blanks
            window.open(`/share/download-app`, '_blank');
          } else {
            const url = process.env.NEXT_PUBLIC_FE_URL + 'share/download-app';
            const shareableObject = {
              event: 'share',
              url,
            };
            const objStringfy = JSON.stringify(shareableObject);
            // @ts-ignore
            window.ReactNativeWebView.postMessage(objStringfy);
          }
        }}
        sx={{ width: '100%' }}
      >
        <Group align="center" position="left" sx={{ width: '100%' }} noWrap>
          <Box
            sx={(theme) => ({
              background: '#FFDD83',
              width: 40,
              height: 40,
              borderRadius: '100%',
            })}
          >
            <Center sx={{ height: '100%' }}>
              <Share />
            </Center>
          </Box>
          <Text color={'#000000'}>{title}</Text>
        </Group>
      </UnstyledButton>
    </div>
  );
};
