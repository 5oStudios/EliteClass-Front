import { PageHeader } from '@/components/ui/pageHeader';
import {
  Button,
  Card,
  Center,
  Container,
  Group,
  Modal,
  SimpleGrid,
  Space,
  Stack,
  Text,
  List,
} from '@mantine/core';
import axios from '@/components/axios/axios.js';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';
import { useQueryClient } from 'react-query';
import Image from 'next/image';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import authMiddleware from '../authMiddleware';

const DeleteMyAccount = () => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const client = useQueryClient();
  async function accountDelete() {
    try {
      setLoader(true);
      await axios
        .delete('delete/profile')
        .then((response) => {
          console.log(response);
          showNotification({ message: response.data, color: 'green' });
          setLoader(false);
          client.clear();
          deleteCookie('access_token');
          router.replace('/signin');
        })
        .catch((error) => {
          setLoader(false);
          if (error?.message === 'Network Error') {
            showNotification({
              message: 'Network error',
              color: 'red',
            });
          } else {
            //@ts-ignore
            let err = error?.response?.data?.errors;
            if (err) {
              Object.keys(err).map((i) => {
                err[i].map((item: any) => {
                  showNotification({
                    message: item,
                    color: 'red',
                  });
                });
              });
            }
          }
        });
    } catch (error) {
      setLoader(false);
      showNotification({
        message: 'Some thing went wrong.',
        color: 'red',
      });
    }
  }

  return (
    <>
      <Modal
        opened={deleteConfirmationModal}
        onClose={() => setDeleteConfirmationModal(false)}
        withCloseButton={false}
        centered
      >
        <Card>
          <Stack>
            <Text align="center" sx={{ whiteSpace: 'nowrap' }}>
              {t.Are_you_sure_you_want_delete_account}
            </Text>
            <SimpleGrid cols={2}>
              <Button
                id="btn-accountModalCancel"
                variant="filled"
                onClick={() => {
                  setDeleteConfirmationModal(false);
                }}
                radius={20}
                styles={{
                  filled: {
                    background: '#EDF2F7',
                    '&:hover': {
                      background: '#EDF2F7',
                    },
                  },
                  label: {
                    color: 'black',
                  },
                }}
              >
                {t.Cancel}
              </Button>
              <Button
                id="btn-accountModalDelete"
                variant="filled"
                onClick={accountDelete}
                loading={loader}
                radius={20}
                styles={{
                  filled: {
                    background: '#FF3030',
                    '&:hover': {
                      background: '#FF3030',
                    },
                  },
                  label: {
                    color: 'white',
                  },
                }}
              >
                {t.delete}
              </Button>
            </SimpleGrid>
          </Stack>
        </Card>
      </Modal>
      <PageHeader title={t.delete_account} />
      <Container>
        <Space h={30} />
        <Center>
          <Image src="/assets/images/delete_profile.svg" height={300} width={300} />
        </Center>
        <Space h={20} />
        <Text>{t.If_you_delete_your_account}</Text>
        <List withPadding>
          <List.Item>{t.You_canot_regain_access}</List.Item>
          <List.Item>{t.Deletion_is_not_delayed}</List.Item>
          <List.Item>{t.We_would_not_be_able_to_recover}</List.Item>
        </List>
        <Space h={30} />
        <Stack>
          <Button
            id="btn-understand"
            sx={{
              background: '#F21515',
              '&:hover': {
                background: '#F21515',
              },
            }}
            size="md"
            radius={8}
            onClick={() => setDeleteConfirmationModal(true)}
          >
            <Group align="center">
              <Text sx={{ color: 'white' }}>{t.yes_I_understand}</Text>
            </Group>
          </Button>
        </Stack>
      </Container>
    </>
  );
};
export default authMiddleware(DeleteMyAccount);
