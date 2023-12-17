import { ReferalIcon } from '@/src/constants/icons/referal';
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
  useMantineColorScheme,
} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

export const ReferalLink = (props: any) => {
  const [openShareLinkDrawer, setOpenShareLinkDrawer] = useState(false);
  const [refLink, setRefLink] = React.useState<string | null>(props?.link);
  const { colorScheme } = useMantineColorScheme();
  const clipboard = useClipboard({ timeout: 500 });
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;

  // @ts-ignore
  const REACT_APP_REFERRAL_URl = process.env.NEXT_PUBLIC_REFERRAL_URL || '';

  function copyToClipboard(textToCopy: string) {
    clipboard.copy(textToCopy);
    showNotification({
      message: 'Copy successfuly',
      color: 'green',
    });
  }

  return (
    <div>
      <Portal>
        <Drawer
          opened={openShareLinkDrawer}
          onClose={() => setOpenShareLinkDrawer(false)}
          position="bottom"
          title={props.headerTitle}
          styles={{
            title: {
              padding: '15px 0px 0px 15px',
              fontSize: '16px',
              fontWeight: 500,
              color: colorScheme == 'dark' ? '#EDD491' : '#000000',
            },
            closeButton: {
              marginRight: '20px',
            },
            drawer: {
              borderRadius: '20px 20px 0 0',
              background: colorScheme == 'dark' ? '#333333' : '#FFFFFF',
            },
          }}
          size="max-content"
        >
          <Container>
            <Stack mt={5} spacing={3}>
              <SimpleGrid sx={{ gridTemplateColumns: '4fr 1fr', alignItems: 'flex-end' }}>
                <TextInput
                  id="inp-getLink"
                  label={t.get_link}
                  variant="filled"
                  styles={{
                    input: {
                      backgroundColor: '#F7F6F5',
                      color: '#298EAE',
                    },
                    label: {
                      fontSize: '14px',
                      fontWeight: 400,
                      color: colorScheme == 'dark' ? '#EDD491' : '#000',
                    },
                  }}
                  size="md"
                  radius={20}
                  value={REACT_APP_REFERRAL_URl + refLink}
                />
                <Button
                  id="btn-referralShare"
                  radius={20}
                  size="md"
                  onClick={() => {
                    //ZK: Share code triggering native view in mobile app
                    // @ts-ignore
                    if (window?.ReactNativeWebView === undefined) {
                      //This means we are not in ReactNative webView so open in new link as target blanks
                      window.open(REACT_APP_REFERRAL_URl + refLink, '_blank');
                    } else {
                      const url = REACT_APP_REFERRAL_URl + refLink;

                      const shareableObject = {
                        event: 'share',
                        url,
                      };
                      const objStringfy = JSON.stringify(shareableObject);
                      // @ts-ignore
                      window.ReactNativeWebView.postMessage(objStringfy);
                    }
                  }}
                  styles={{
                    filled: {
                      background: colorScheme == 'dark' ? '#EDD491' : '#298EAE',
                      '&:hover': {
                        background: colorScheme == 'dark' ? '#EDD491' : '#298EAE',
                      },
                      height: '100%',
                    },
                    label: { color: colorScheme == 'dark' ? '#000' : '#fff' },
                  }}
                >
                  {props.share}
                </Button>
              </SimpleGrid>
            </Stack>
          </Container>
          <Space h={40} />
        </Drawer>
      </Portal>
      <UnstyledButton id="btn-profileReferral" sx={{ width: '100%' }} onClick={() => setOpenShareLinkDrawer(true)}>
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
              <ReferalIcon />
            </Center>
          </Box>
          <Text color={'#000000'}>{props.title}</Text>
        </Group>
      </UnstyledButton>
    </div>
  );
};
