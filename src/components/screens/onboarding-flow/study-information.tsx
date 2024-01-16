import {
  Container,
  Stack,
  Text,
  Group,
  UnstyledButton,
  Box,
  Space,
  Drawer,
  SimpleGrid,
  useMantineColorScheme,
} from '@mantine/core';
import Image from 'next/image';
import { ChevronRightIcon } from '@modulz/radix-icons';
import React, { useEffect, useState } from 'react';
import { ChooseCategory } from '@/components/drawers/choose-category';
import { ChooseCountry } from '@/components/drawers/choose-country';
import { ChooseStage } from '@/components/drawers/choose-stage';
import axios from '../../axios/axios.js';
import { showNotification } from '@mantine/notifications';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import { ChooseType } from '@/components/drawers/choose-type';
import { usePreviousState } from '@/src/hooks/usePrevious';
import { useRouter } from 'next/router';
import useNextBlurhash from 'use-next-blurhash';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { Button } from '@/components/ui/Button';

const DrawerButton = ({ selected, children, ...rest }: any) => (
  <UnstyledButton
    px={12}
    sx={(theme) => ({
      height: 42,
      background: '#F7F6F5',
      fontSize: 12,
      fontWeight: 400,
      borderRadius: 42 / 2,

      '@media only screen and (min-width: 580px)': {
        height: 60,
        fontSize: 16,
      },
    })}
    {...rest}
  >
    <Group noWrap position="apart" align="center" sx={{ width: '100%' }}>
      <Text
        sx={(theme) => ({
          fontSize: 12,
          color: '#0A0909',

          '@media only screen and (min-width: 580px)': {
            fontSize: 16,
          },
        })}
      >
        {children}
      </Text>
      <Group noWrap spacing={0} align="center">
        <Text
          size="xs"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '20ch',
            color: '#298EAE',

            '@media only screen and (min-width: 580px)': {
              fontSize: 16,
            },
          }}
        >
          {selected}
        </Text>
        <Box mt={2}>
          <ChevronRightIcon className="rtl" />
        </Box>
      </Group>
    </Group>
  </UnstyledButton>
);

export const StudyInformation = ({ data }: any) => {
  const router = useRouter();
  // language
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  // drawers

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [openCountryDrawer, setOpenCountryDrawer] = React.useState(false);
  const [openStageDrawer, setOpenStageDrawer] = React.useState(false);
  const [openCategoryDrawer, setOpenCategoryDrawer] = React.useState(false);
  const [openTypeDrawer, setOpenTypeDrawer] = React.useState(false);

  const [countries, setCountries] = React.useState<any>();
  const [stages, setStages] = React.useState<any>();
  const [categories, setCategories] = React.useState<any>();
  const [types, setTypes] = React.useState<any>();

  // set names
  const [country, setCountry] = useState<string | null>(data?.initial_country?.name);
  const [type, setType] = useState<string | null>(data?.initial_type?.name);
  const [stage, setStage] = useState<string | null>(data?.initial_stage?.name);
  const [major, setMajor] = useState<string | null>(data?.initial_major?.name);

  // set Ids
  const [countryID, setCountryID] = useState<string | null>(data?.initial_country?.id);
  const [typeID, setTypeID] = useState<string | null>(data?.initial_type?.id);
  const [stageID, setStageID] = useState<string | null>(data?.initial_stage?.id);
  const [majorId, setMajorId] = useState<string | null>(data?.initial_major?.id);

  const previousCountryID = usePreviousState(countryID);
  const previousTypeId = usePreviousState(typeID);
  const previousstageID = usePreviousState(stageID);

  const [isSubmitting, setIsSumitting] = useState(false);
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  // const client = useQueryClient();

  React.useEffect(() => {
    deleteCookie('skipHome');
  }, []);

  useEffect(() => {
    if (countryID && previousCountryID) {
      if (previousCountryID !== countryID) {
        setStage(null);
        setStageID(null);
        setStages(null);
        setType(null);
        setTypeID(null);
        setTypes(null);
        setMajor(null);
        setMajorId(null);
      }
    }
    if (typeID && previousTypeId) {
      if (previousTypeId !== typeID) {
        setStage(null);
        setStageID(null);
        setStages(null);
        setMajor(null);
        setMajorId(null);
        setCategories(null);
      }
    }
    if (stageID && previousstageID) {
      if (previousstageID !== stageID) {
        setMajor(null);
        setMajorId(null);
        setCategories(null);
      }
    }
  }, [countryID, stageID, typeID]);

  //country selection
  function countryDrawerlist() {
    axios
      .get('category?secret=11f24438-b63a-4de2-ae92-e1a1048706f5')
      .then((response) => {
        console.log(response);
        setCountries(response.data.category);
      })
      .catch((error) => {
        console.log(error);
        if (error?.message === 'Network Error') {
          showNotification({
            message: 'Network error',
            color: 'red',
          });
        } else {
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
    setOpenCountryDrawer(true);
  }

  //institute selection
  const typeDrawerlist = () => {
    if (countryID) {
      axios
        .get(`typecategories/${countryID}?secret=11f24438-b63a-4de2-ae92-e1a1048706f5`)
        .then((response) => {
          setTypes(response.data.category);
        })
        .catch((error) => {
          if (error?.message === 'Network Error') {
            showNotification({
              message: 'Network error',
              color: 'red',
            });
          } else {
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
      setOpenTypeDrawer(true);
    } else {
      showNotification({
        message: 'Please select country',
        color: 'error',
      });
    }
  };

  // institution selection
  function stageDrawerlist() {
    if (countryID && typeID) {
      axios
        .get(`subcategory/${typeID}?secret=11f24438-b63a-4de2-ae92-e1a1048706f5`)
        .then((response) => {
          setStages(response.data.category);
        })
        .catch((error) => {
          if (error?.message === 'Network Error') {
            showNotification({
              message: 'Network error',
              color: 'red',
            });
          } else {
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
      setOpenStageDrawer(true);
    } else {
      showNotification({
        message: 'Please select country and institute',
      });
    }
  }
  // major selection
  function categoryDrawerlist() {
    if (countryID && stageID && typeID) {
      axios
        .get(`childcategory/${countryID}/${stageID}?secret=11f24438-b63a-4de2-ae92-e1a1048706f5`)
        .then((response) => {
          // console.log(response);
          setCategories(response.data.childcategory);
        })
        .catch((error) => {
          if (error?.message === 'Network Error') {
            showNotification({
              message: 'Network error',
              color: 'red',
            });
          } else {
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
      setOpenCategoryDrawer(true);
    } else {
      showNotification({
        message: 'Please first select previous fields',
      });
    }
  }

  const handleSubmit = () => {
    const token = getCookie('access_token');
    setCookie(
      'initial_country',
      { name: country, id: countryID },
      {
        maxAge: 24 * 60 * 60 * 30,
      }
    );
    setCookie(
      'initial_stage',
      { name: stage, id: stageID },
      {
        maxAge: 24 * 60 * 60 * 30,
      }
    );
    setCookie(
      'initial_major',
      { name: major, id: majorId },
      {
        maxAge: 24 * 60 * 60 * 30,
      }
    );
    setCookie(
      'initial_type',
      { name: type, id: typeID },
      {
        maxAge: 24 * 60 * 60 * 30,
      }
    );

    //ZK: Send the cookies to RN
    //@ts-ignore
    if (window.ReactNativeWebView) {
      const obj = {
        event: 'setCookie',
        cookies: {
          access_token: token,
          initial_country: { name: country, id: countryID },
          initial_stage: { name: stage, id: stageID },
          initial_major: { name: major, id: majorId },
          initial_type: { name: type, id: typeID },
        },
      };
      const objStringfy = JSON.stringify(obj);
      //@ts-ignore
      window.ReactNativeWebView.postMessage(objStringfy);
    }

    if (country && stage && major && type && countryID && stageID && typeID && majorId) {
      setIsSumitting(true);
      // client.clear();
      if (token) {
        const obj = {
          main_category: countryID,
          sub_category: stageID,
          scnd_category_id: typeID,
          ch_sub_category: majorId,
        };
        const config = {
          method: 'post',
          url: 'user-categories',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: obj,
        };
        axios(config)
          .then((response) => {
            setIsSumitting(false);
            router.push({
              pathname: '/',
            });
          })
          .catch((error) => {
            setIsSumitting(false);
            if (error?.message === 'Network Error') {
              showNotification({
                message: 'Network error',
                color: 'red',
              });
            } else if (error?.response?.status == 422) {
              router.push({
                pathname: '/',
              });
            } else {
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
      } else {
        router.push({
          pathname: '/',
        });
      }
    } else {
      showNotification({
        message: 'Please select all fields',
        color: 'red',
      });
    }
  };

  return (
    <Container sx={{ overflowY: 'hidden' }}>
      <Drawer
        opened={openCountryDrawer}
        onClose={() => setOpenCountryDrawer(false)}
        position="right"
        size="100%"
        padding={0}
        withCloseButton={false}
        styles={(theme) => ({
          drawer: {
            background: theme.colorScheme === 'dark' ? '#333333' : '#F4F9FE',
          },
        })}
      >
        <ChooseCountry
          countries={countries}
          closeDrawer={setOpenCountryDrawer}
          setValue={setCountry}
          setItemID={setCountryID}
        />
      </Drawer>
      <Drawer
        opened={openTypeDrawer && !!country}
        onClose={() => {
          setOpenTypeDrawer(false);
        }}
        position="right"
        size="100%"
        padding={0}
        withCloseButton={false}
        styles={(theme) => ({
          drawer: {
            background: theme.colorScheme === 'dark' ? '#333333' : '#F4F9FE',
          },
        })}
      >
        <ChooseType
          types={types}
          setValue={setType}
          setItemID={setTypeID}
          closeDrawer={setOpenTypeDrawer}
        />
      </Drawer>
      <Drawer
        opened={openStageDrawer && country !== null && type !== null}
        onClose={() => setOpenStageDrawer(false)}
        position="right"
        size="100%"
        padding={0}
        withCloseButton={false}
        styles={(theme) => ({
          drawer: {
            background: theme.colorScheme === 'dark' ? '#333333' : '#F4F9FE',
          },
        })}
      >
        <ChooseStage
          stages={stages}
          setValue={setStage}
          setItemID={setStageID}
          closeDrawer={setOpenStageDrawer}
        />
      </Drawer>
      <Drawer
        opened={openCategoryDrawer && country !== null && stage !== null}
        onClose={() => setOpenCategoryDrawer(false)}
        position="right"
        size="100%"
        padding={0}
        withCloseButton={false}
        styles={(theme) => ({
          drawer: {
            background: theme.colorScheme === 'dark' ? '#333333' : '#F4F9FE',
          },
        })}
      >
        <ChooseCategory
          categories={categories}
          setValue={setMajor}
          setItemID={setMajorId}
          closeDrawer={setOpenCategoryDrawer}
        />
      </Drawer>
      <SimpleGrid
        sx={{
          minHeight: 'calc(100vh)',
          gridTemplateRows: '1fr max-content',
          gap: 30,
          paddingTop: '50%',
          paddingBottom: '10%',

          '@media only screen and (min-width: 580px)': {
            paddingTop: '30%',
          },
        }}
      >
        <Stack align="center" mt={60}>
          {/* <Image
            src="/assets/images/study-information.svg"
            width={150}
            height={150}
            objectFit="contain"
            priority
          /> */}
          <Stack spacing={1} sx={{ alignSelf: 'stretch' }}>
            <Text
              align="center"
              weight={500}
              sx={{
                fontSize: 20,
                color: colorScheme == 'dark' ? '#FFDD83' : 'Black',

                '@media only screen and (min-width: 580px)': {
                  fontSize: 35,
                },
              }}
            >
              {t.categories['enter-study-info']}
            </Text>
            <Text
              align="center"
              sx={(theme) => ({
                color: '#298EAE',
                fontSize: 12,

                '@media only screen and (min-width: 580px)': {
                  fontSize: 20,
                  width: '75%',
                  margin: 'auto',
                },
              })}
              weight={400}
              variant="text"
            >
              {t.categories['enter-study-info-description']}
            </Text>
            <Space h="lg" />
            <Stack>
              <DrawerButton id="btn-selectCountry" selected={country} onClick={countryDrawerlist}>
                {t.categories['select-country']}
              </DrawerButton>
              <DrawerButton id="btn-selectInstitute" selected={type} onClick={typeDrawerlist}>
                {t.categories['select-type-of-institute']}
              </DrawerButton>
              <DrawerButton id="btn-selectInstitution" selected={stage} onClick={stageDrawerlist}>
                {t.categories['select-institution']}
              </DrawerButton>
              <DrawerButton id="btn-selectMajor" selected={major} onClick={categoryDrawerlist}>
                {t.categories['select-your-major']}
              </DrawerButton>
            </Stack>
          </Stack>
        </Stack>
        {/* <Button
          color="blue"
          variant="filled"
          size="md"
          radius="xl"
          fullWidth
          onClick={handleSubmit}
          loading={isSubmitting}
          styles={{
            root: {
              maxWidth: '250px',
              margin: 'auto',
            },
            label: {
              color: 'white',
            },
            filled: {
              background: '#82B1CF',
              '&:hover': {
                background: '#82B1CF',
              },
            },
          }}
        >
          {t.get_started}
        </Button> */}
        <Button btnId="btn-onboradingGetStarted" onClick={handleSubmit} loading={isSubmitting} />
      </SimpleGrid>
    </Container>
  );
};
