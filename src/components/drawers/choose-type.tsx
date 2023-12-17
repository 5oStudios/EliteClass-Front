import {
  ActionIcon,
  Box,
  Card,
  Container,
  Group,
  MediaQuery,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import React from 'react';
import { NoRecordFound } from '../ui/no-record-found';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';
import { GoBack } from '../ui/GoBack';
import ImageWithFallback from '../ui/ImageWithFeedback';
import { shimmer, toBase64 } from '@/utils/utils';

type Props = {
  closeDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  setItemID: React.Dispatch<React.SetStateAction<string | null>>;
  types: any;
};

export const ChooseType = ({ closeDrawer, setValue, setItemID, types }: Props) => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // language
  return (
    <Container
      sx={{
        backgroundColor: colorScheme == 'dark' ? '#333333' : 'white',
        height: '100vh',
        padding: 0,
        // border: '2px solid red',
        //paddingTop: 120,
      }}
    >
      {/* <MediaQuery query="(min-width: 800px)" styles={{ display: 'none' }}>
        <Box>
          <ActionIcon
            title="Go Back"
            onClick={() => {
              //@ts-ignore
              closeDrawer();
            }}
            variant="hover"
            sx={{ position: 'absolute', top: 40, zIndex: 2 }}
          >
            <ArrowLeftIcon className="rtl" width={100} height={100} />
          </ActionIcon>
        </Box>
      </MediaQuery> */}

      {/* <Stack>
        <Text
          color="black"
          align="center"
          sx={{
            fontSize: 24,
            color: colorScheme == 'dark' ? '#EDD491' : '#000000',
            lineHeight: 0.5,
          }}
          weight={500}
        >
          Educational Level
        </Text>
        <Text color="#298EAE" align="center" sx={{ fontSize: 16 }} weight={500}>
          You can Change it later
        </Text>
      </Stack> */}
      <Card
        radius={0}
        p={0}
        sx={{
          //boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.07)',
          backgroundColor: 'transparent',
        }}
      >
        <Stack justify="center" sx={{ minHeight: 70, paddingLeft: 10 }}>
          <Group noWrap position="apart">
            <Group noWrap>
              <ActionIcon variant="transparent" onClick={() => closeDrawer(false)}>
                <ArrowLeftIcon className="rtl" width={40} height={40} />
              </ActionIcon>
              <Stack spacing={0}>
                <Text
                  size="lg"
                  weight={500}
                  sx={(theme) => ({ color: theme?.other?.primaryToblack })}
                >
                  {t.categories['select-type-of-institute']}
                </Text>
                <Text size="xs" sx={(theme) => ({ color: '#298EAE' })} weight={500}>
                  {t.categories['you-can-change-later']}
                </Text>
              </Stack>
            </Group>
          </Group>
        </Stack>
      </Card>

      <Container my={30}>
        <ScrollArea type="scroll">
          <Space h={50} />

          <SimpleGrid
            cols={2}
            sx={{
              margin: 'auto',
              maxHeight: '70vh',
              paddingRight: '10vw',
              paddingLeft: '10vw',
            }}
            spacing={40}
          >
            {!types &&
              [...Array(4)].map((_, i) => <Skeleton key={i} height={91} width={103} radius={8} />)}
          </SimpleGrid>
          <SimpleGrid
            cols={types != '' ? 2 : 0}
            spacing={20}
            sx={{
              margin: 'auto',
              maxHeight: '70vh',
              // paddingRight: '3vw',
              // paddingLeft: '3vw',
            }}
          >
            {types != '' ? (
              types?.map((type: any, index: any) => (
                <Stack
                  key={index}
                  id={`btn-institute-${type?.id}`}
                  onClick={() => {
                    setValue(type?.title);
                    setItemID(type?.id);
                    closeDrawer(false);
                  }}
                  sx={{
                    height: 142,
                    // width: 142,
                    //backgroundColor: '#F7F6F5',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ImageWithFallback
                    height={142}
                    width={142}
                    src={
                      type?.image ||
                      `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${type?.title}`
                    }
                    fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${type?.title}`}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                  />
                </Stack>

                // <Card
                //   key={type.id}
                //   p={10}
                //   radius={14}
                //   sx={(theme) => ({
                //     background: theme.colorScheme === 'dark' ? '#191919' : 'rgba(238, 237, 234, 0.5)',
                //   })}
                // >
                //   <Group
                //     align="center"
                //     position="center"
                //     sx={{ cursor: 'pointer' }}
                //     onClick={() => {
                //       setValue(type?.title);
                //       setItemID(type?.id);
                //       closeDrawer(false);
                //     }}
                //   >
                //     <Text size="xs" align="center">
                //       {type?.title}
                //     </Text>
                //   </Group>
                // </Card>
              ))
            ) : (
              <NoRecordFound />
            )}
          </SimpleGrid>
        </ScrollArea>
      </Container>
    </Container>
  );
};
