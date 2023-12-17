import { ActionIcon, Box } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useState } from 'react';
import { CameraIcon } from '@/src/constants/icons';
import axios from '../axios/axios.js';
import { showNotification } from '@mantine/notifications';
import { useMutation } from 'react-query';
import NextImage from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import { shimmer, toBase64 } from '@/utils/utils';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';
import { LoadingSnipper } from '@/components/ui/loading-snipper';

type Props = {
  name: string;
  url: string;
  isEditable: boolean;
  onView: any;
};
export const ProfileImageForm = ({ url, name, isEditable, onView }: Props) => {
  const [image, setImage] = useState<File | null>(null);
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');

  const mutation = useMutation(
    () => {
      const formData = new FormData();
      // @ts-ignore
      formData.append('user_img', image);
      formData.append('secret', '11f24438-b63a-4de2-ae92-e1a1048706f5');
      return axios.post('update/profile', formData);
    },
    {
      onSuccess: () => {
        showNotification({
          message: 'Profile Image updated Successfully',
          color: 'teal',
        });
      },
      onError: () => {
        setImage(null);
        showNotification({
          message: 'Failed to updated profile image',
          color: 'red',
        });
      },
    }
  );

  function onReject(err: any) {
    if (err[0].errors[0].code === 'file-invalid-type') {
      showNotification({
        message:
          'File type must be one of image/png, image/jpeg, image/jpg, image/heic, image/heif',
        color: 'red',
      });
    } else if (err[0].errors[0].code === 'file-too-large') {
      showNotification({
        message: 'File is larger than 20 mb',
        color: 'red',
      });
    } else {
      showNotification({
        message: err[0].errors[0].message,
        color: 'red',
      });
    }
  }

  return (
    <ActionIcon
      //p={0}
      styles={{
        root: {
          width: '80px',
          height: '80px',
          borderRadius: '100%',
          border: 'none',
        },
      }}
    >
      {mutation.isLoading ? (
        <LoadingSnipper height={30} width={30} />
      ) : (
        <ActionIcon
          id="btn-profileImage"
          onClick={() => (image || url) && onView(image)}
          variant="transparent"
          //loading={mutation.isLoading}
          //p={0}
          styles={{
            root: {
              width: '100%',
              height: '100%',
              borderRadius: '100%',
              border: 'none',
            },
          }}
        >
          <div style={{ borderRadius: '100%', overflow: 'hidden' }}>
            <ImageWithFallback
              src={
                image
                  ? URL.createObjectURL(image)
                  : !url
                  ? `https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${name}`
                  : url
              }
              width="100%"
              height="100%"
              fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${name}`}
              objectFit="cover"
              style={{
                borderRadius: '100%',
              }}
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
            />
          </div>
        </ActionIcon>
      )}
      <Dropzone
        //variant="filled"
        //size="sm"
        //radius="sm"
        disabled={isEditable}
        multiple={false}
        onDrop={(files) => {
          setImage(files[0]);
          mutation.mutate();
        }}
        onReject={onReject}
        maxSize={20 * 1024 ** 2}
        accept={['image/png', 'image/jpeg', 'image/jpg', 'image/heic', 'image/heif']}
        sx={(theme) => ({
          position: 'absolute',
          bottom: -3,
          right: -5,
          zIndex: 1,
          boxShadow: theme.shadows.xs,
        })}
        styles={{
          root: {
            backgroundColor: '#fff',
            '&:hover': {
              backgroundColor: '#fff',
            },
            display: 'grid',
            placeContent: 'center',
            padding: 0,
            width: '25px',
            height: '25px',
            borderRadius: '100%',
            border: 'none',
          },
        }}
        //radius="xl"
      >
        {() => <CameraIcon viewBox="-3 -3 30 30" width={20} height={20} />}
      </Dropzone>
    </ActionIcon>
  );
};
