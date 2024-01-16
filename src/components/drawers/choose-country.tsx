import {
  ActionIcon,
  Box,
  Card,
  Container,
  Group,
  Image,
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
import NextImage from 'next/image';
import { NoRecordFound } from '../ui/no-record-found';
import useNextBlurhash from 'use-next-blurhash';
import React from 'react';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useRouter } from 'next/router';
import { CountryButton } from '@/src/constants/icons/country-button';
import { GoBack } from '../ui/GoBack';
import ImageWithFallback from '../ui/ImageWithFeedback';
import { shimmer, toBase64 } from '@/utils/utils';

type Props = {
  closeDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  setItemID: React.Dispatch<React.SetStateAction<string | null>>;
  countries: any;
};

export const ChooseCountry = ({ closeDrawer, setValue, setItemID, countries }: Props) => {
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
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
          Choose your country
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
                  {t.categories['select-country']}
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
          <Text align="center" sx={{ fontSize: 24 }} weight={500} />
          <Text
            align="center"
            sx={(theme) => ({ fontSize: 16, color: theme.other.placeholderColor })}
            weight={500}
          />
          <Space h={50} />
          <SimpleGrid
            cols={countries != '' ? 2 : 0}
            spacing={40}
            sx={{
              margin: 'auto',
              //justifyContent: 'center',
              // backgroundColor:'red',
              maxHeight: '70vh',
              paddingRight: '10vw',
              paddingLeft: '10vw',
            }}
          >
            {/* <ScrollArea style={{ height : '50vh' }}> */}

            {!countries &&
              [...Array(4)].map((_, index) => (
                <Stack sx={{ alignItems: 'center' }} key={index}>
                  <Skeleton key={`Skeleton${index}`} height={91} width={103} radius={8} />
                </Stack>
              ))}

            {countries != '' ? (
              countries?.map((country: any, index: any) => (
                <Stack
                  key={index}
                  id={`btn-country-${country?.id}`}
                  sx={{ alignItems: 'center' }}
                  onClick={() => {
                    setValue(country?.title);
                    setItemID(country?.id);
                    closeDrawer(false);
                  }}
                >
                  {/* <CountryButton /> */}
                  <ImageWithFallback
                    height={91}
                    width={103}
                    src={
                      country?.image ||
                      `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${country?.title}`
                    }
                    alt="Country"
                    fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${country?.title}`}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                  />
                </Stack>

                // <Card
                //   key={country.id}
                //   p={10}
                //   radius={14}
                //   sx={(theme) => ({
                //     background: theme.colorScheme === 'dark' ? '#191919' : 'rgba(238, 237, 234, 0.5)',
                //   })}
                // >
                //   <Group
                //     // align="center"
                //     // position="center"
                //     sx={{ cursor: 'pointer', width: '100%' }}
                //     pl={10}
                //     onClick={() => {
                //       setValue(country?.title);
                //       setItemID(country?.id);
                //       closeDrawer(false);
                //     }}
                //     noWrap
                //   >
                //     <NextImage
                //       width={20}
                //       height={15}
                //       src={country?.icon}
                //       priority
                //       alt="" />
                //     <Text
                //       size="xs"
                //       sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                //       align="center"
                //     >
                //       {country?.title}
                //     </Text>
                //   </Group>
                // </Card>
              ))
            ) : (
              <NoRecordFound />
            )}
            {/* </ScrollArea> */}
          </SimpleGrid>
        </ScrollArea>
      </Container>
    </Container>
  );
};
