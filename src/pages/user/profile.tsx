import { Seo } from '@/components/seo';
import { CountrySelect } from '@/components/ui/country-select';
import { Clock, CoursesIcon, MessageIcon, UserIcon } from '@/src/constants/icons';
import { validateEmail } from '@/utils/check-email-validation';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  CloseButton,
  Container,
  Group,
  InputWrapper,
  Modal,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ArrowLeftIcon } from '@modulz/radix-icons';
import axios from '@/components/axios/axios.js';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import PhoneInput, { formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input';
import { LoadingScreen } from '@/components/ui/loader-screen';
import { ProfileImageForm } from '@/components/forms';
import { showNotification } from '@mantine/notifications';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';
import { shimmer, toBase64 } from '@/utils/utils';
import { axiosServer } from '@/components/axios/axios-server';

export const ProfilePage = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  
  const [profiledata, setProfileData] = useState<any>([]);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [viewProfile, setViewProfileModal] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [major, setMajor] = useState<string>(profiledata?.major);
  const [majorValue, setMajorValue] = useState<number>(profiledata?.major);

  const [InstitudeValue, setInstitudeValue] = useState<number>(profiledata?.institute);
  const [typeOfInstitude, setTypeOfInstitude] = useState<string>();

  const [typeCategoryApi, setTypeCategoryApi] = useState([]);
  const [majorCategoryApi, setMajorCategoryApi] = useState([]);
  type typeCategoryApi = {
    title: string;
  };
  type majorCategoryApi = {
    title: string;
  };
  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
    description: string;
  }
  useEffect(() => {
    const config = {
      method: 'post',
      url: 'show/profile?secret=11f24438-b63a-4de2-ae92-e1a1048706f5',
    };
    axios(config)
      .then((response) => {
        setProfileData(response?.data);
        form.setValues((state) => ({
          ...state,
          email: response?.data?.email,
          mobile: response?.data?.mobile,
          fname: response?.data?.fname,
          lname: response?.data?.lname,
        }));
        setIsLoading(false);
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
  }, []);
  const form = useForm({
    initialValues: {
      email: '',
      mobile: '',
      fname: '',
      lname: '',
      institute: InstitudeValue,
      major: majorValue,

      // dob: 'jan 21, 2022',
    },
    validate: {
      email: validateEmail,
      mobile: (value) => {
        if (!value) {
          return 'Required';
        }
        if (!isValidPhoneNumber(value)) {
          return 'Invalid Phone number';
        }
        return null;
      },
      fname: (value) => {
        if (!value) {
          return 'Required';
        }
        return null;
      },
      lname: (value) => {
        if (!value) {
          return 'Required';
        }
        return null;
      },
    },
  });

  const handleSubmit = (formdata: any) => {
    setSubmitting(true);
    const obj = {
      user_img: '',
      secret: '11f24438-b63a-4de2-ae92-e1a1048706f5',
      fname: formdata.fname,
      lname: formdata.lname,
      email: formdata.email,
      password: '',
      mobile: formdata.mobile,
      dob: '',
      address: '',
      detail: '',
      institute: InstitudeValue,
      major: majorValue,
      country_code: formatPhoneNumberIntl(formdata.mobile).split(' ')[0],
    };

    const config = {
      method: 'post',
      url: 'update/profile',
      data: obj,
    };
    axios(config)
      .then((response) => {
        showNotification({ message: 'Profile  updated successfuly', color: 'green' });
        router.back();
      })
      .catch((error) => {
        setSubmitting(false);
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
  };

  const handleMajor = (e: any) => {
    setMajor(e);
    const getId: any = majorCategoryApi.find((a: any) => a?.value === e);
    setMajor(getId?.value);
    setMajorValue(getId?.value);
  };
  const handleInstitute = (e: any) => {
    setTypeOfInstitude(e);
    const getId: any = typeCategoryApi.find((a: any) => a?.value == e);
    setInstitudeValue(getId?.value);
  };

  const handleInstituteApi = async () => {
    const respProfile = await axios.post(
      'show/profile?secret=11f24438-b63a-4de2-ae92-e1a1048706f5'
    );
    setProfileData(respProfile?.data);
    const respInstitute = await axios.get('/institute/categories');
    setTypeCategoryApi(respInstitute?.data);
    setInstitudeValue(respProfile?.data?.institute);
    const getValue: any = await respInstitute?.data?.find(
      (a: any) => a?.value === respProfile?.data?.institute
    );
    setTypeOfInstitude(getValue?.value);
  };
  const handlemajorApi = async () => {
    const respInstitute = await axios.get('/major/categories');
    setMajorCategoryApi(respInstitute?.data);
    const getValue: any = majorCategoryApi?.find((e: any) => e?.value == profiledata?.major);
    setMajor(getValue?.value);
    setMajorValue(profiledata?.major);
  };

  useEffect(() => {
    if (typeCategoryApi.length <= 0 || majorCategoryApi.length <= 0) {
      handleInstituteApi();
      handlemajorApi();
    }
  }, [typeCategoryApi, majorCategoryApi]);
  function editHandle() {
    setIsEditable(!isEditable);
  }

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Seo title="Profile" description="Best CMS" path="user/profile" />

      <Modal
        opened={viewProfile}
        onClose={() => setViewProfileModal(false)}
        withCloseButton={false}
        centered
      >
        <Card sx={{ height: '50vh' }}>
          <ImageWithFallback
            src={
              newImage ? URL.createObjectURL(newImage) : profiledata?.image
              //'http://panel.lms.elite-class.com/images/course/16550189231000_F_65595070_yu9z2Z1Nd4oUSQxpeJHwiZu6y8yKDTq2.jpg'
            }
            layout="fill"
            objectFit="contain"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          />
        </Card>
        <CloseButton
          id="btn-profileImageClose"
          onClick={() => setViewProfileModal(false)}
          sx={(theme) => ({
            height: '10px',
            width: '10px',
            boxShadow: theme.shadows.xs,
            borderRadius: '100%',
            position: 'absolute',
            top: 5,
            right: 5,
            backgroundColor: 'white',
          })}
          aria-label="Close modal"
        />
      </Modal>
      <main>
        <Container p={0}>
          {/* @ts-ignore*/}
          <Card
            sx={(theme) => ({
              //@ts-ignore
              boxShadow: theme.shadows.shadow1,
              backgroundColor: '#FFDD83',
              //height: '25vh',
              borderRadius: 0,
              borderBottomRightRadius: '20px',
              borderBottomLeftRadius: '20px',
            })}
          >
            <Stack>
              <Group position="apart" align="center" noWrap>
                <ActionIcon variant="transparent" onClick={() => router.back()}>
                  <ArrowLeftIcon className="rtl" width={25} height={25} color="#000" />
                </ActionIcon>
                <ActionIcon id="btn-profileEdit" variant="transparent" onClick={editHandle}>
                  <Text color="blue">{t.edit}</Text>
                </ActionIcon>
              </Group>
              <Box
                sx={{
                  borderRadius: '100%',
                  paddingTop: '2px',
                  height: '85px',
                  width: '85px',
                  border: '1px solid gray',
                  //paddingBottom : '1px',
                  // width: 'max-content',
                  background: '#fff',
                  alignSelf: 'center',
                }}
              >
                {!isLoading && (
                  <Center sx={{ height: '100%' }}>
                    <ProfileImageForm
                      onView={(new_img: any) => {
                        setNewImage(new_img);
                        setViewProfileModal(true);
                      }}
                      url={profiledata.image}
                      name={`${profiledata?.fname} ${profiledata?.lname}`}
                      isEditable={isEditable}
                    />
                  </Center>
                )}
              </Box>
              <Group sx={{ alignSelf: 'center' }} noWrap>
                <Group align="center" spacing={5} noWrap>
                  <CoursesIcon color={'#000'} />
                  <Text color={'#000'}>
                    {profiledata?.courses <= 1
                      ? `${profiledata?.courses} ${t.course}`
                      : `${profiledata?.courses} ${t.courses}`}
                  </Text>
                </Group>
                <Group align="center" spacing={5} noWrap>
                  <Clock color={'black'} />
                  <Text color={'#000'}>
                    {profiledata?.hours <= 1
                      ? `${profiledata?.hours} ${t.hour}`
                      : `${profiledata?.hours} ${t.hours}`}
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Card>
        </Container>
        <Container>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack mt={30} mb={80}>
              <InputWrapper
                label={t.email}
                labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
              >
                <TextInput
                  id="inp-profileEmail"
                  icon={<MessageIcon />}
                  variant="filled"
                  placeholder={t.email}
                  aria-label="Your email"
                  type="email"
                  disabled
                  error={form.errors.email}
                  {...form.getInputProps('email')}
                  size="md"
                  radius={20}
                  styles={(theme) => ({
                    input: {
                      color: '#298EAE',
                      backgroundColor: '#F7F6F5', //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                    },
                  })}
                />
              </InputWrapper>

              <SimpleGrid sx={{ gridTemplateColumns: '1fr 1fr' }}>
                <InputWrapper
                  label={t.first_name}
                  labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
                >
                  <TextInput
                    id="inp-profileFirstName"
                    icon={<UserIcon />}
                    variant="filled"
                    placeholder={t.first_name}
                    aria-label="Your First name"
                    type="text"
                    disabled={isEditable}
                    error={form.errors.fname}
                    {...form.getInputProps('fname')}
                    size="md"
                    radius={20}
                    styles={(theme) => ({
                      input: {
                        color: '#298EAE',
                        backgroundColor: '#F7F6F5',
                        //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                      },
                    })}
                  />
                </InputWrapper>
                <InputWrapper
                  label={t.last_name}
                  labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
                >
                  <TextInput
                    id="inp-profileLastName"
                    variant="filled"
                    placeholder={t.last_name}
                    aria-label="Your Last name"
                    type="text"
                    disabled={isEditable}
                    error={form.errors.lname}
                    {...form.getInputProps('lname')}
                    size="md"
                    radius={20}
                    styles={(theme) => ({
                      input: {
                        color: '#298EAE',
                        backgroundColor: '#F7F6F5',
                        //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                      },
                    })}
                  />
                </InputWrapper>
              </SimpleGrid>
              <InputWrapper
                label={t?.selectInstitude}
                // className="handlePhone"
                labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
              >
                <Select
                  id="slt-profileInstitude"
                  placeholder={t?.selectInstitude}
                  data={typeCategoryApi}
                  searchable
                  className="selectSignUp"
                  disabled={isEditable}
                  onChange={handleInstitute}
                  value={typeOfInstitude}
                  // error="required"
                />
              </InputWrapper>

              <InputWrapper
                label={t?.selectMajor}
                className="handlePhone"
                labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
              >
                <Select
                  id="slt-profileMajor"
                  placeholder={t?.selectMajor}
                  data={majorCategoryApi}
                  searchable
                  onChange={handleMajor}
                  className="selectSignUp"
                  disabled={isEditable}
                  value={major}
                  // major error={isEditable  &&"required":""}
                />
              </InputWrapper>

              <Box>
                <InputWrapper
                  label={t.phone_number}
                  labelProps={{ style: { color: colorScheme == 'dark' ? '#EDD491' : '#000000' } }}
                >
                  <PhoneInput
                    defaultCountry="KW"
                    className={router.locale === 'ar-kw' ? 'phoneNumberRTL' : ''}
                    inputComponent={TextInput}
                    international={false}
                    withCountryCallingCode={false}
                    countrySelectComponent={CountrySelect}
                    useNationalFormatForDefaultCountryValue={true}
                    smartCaret={true}
                    disabled={isEditable}
                    variant="filled"
                    size="md"
                    styles={(theme: any) => ({
                      input: {
                        color: '#298EAE',
                        backgroundColor: '#F7F6F5',
                        //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
                      },
                    })}
                    radius={20}
                    placeholder={t.enter_phone_number}
                    aria-label="Phone number"
                    {...form.getInputProps('mobile', { withError: false })}
                    error={form.errors.mobile}
                  />
                </InputWrapper>
                {/* {form.errors && <Text color="red">{form.errors.mobile}</Text>} */}
              </Box>
              <Space h="xl" />
              <Button
                id="btn-profileSave"
                disabled={isEditable}
                loading={submitting}
                type="submit"
                size="md"
                radius={20}
                sx={{ color: '#000', fontWeight: 400 }}
              >
                {t.save}
              </Button>
            </Stack>
          </form>
        </Container>
      </main>
    </>
  );
};

export default ProfilePage;
