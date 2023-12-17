import { Avatar, Stack, Text, Anchor, Group, Container } from '@mantine/core';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Link from 'next/link';
import NextImage from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import { shimmer, toBase64 } from '@/utils/utils';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';
import ImageWithFallback from '@/components/ui/ImageWithFeedback';

export const InstructorsCarousal = (props: any) => {
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  return (
    <Container p={0}>
      <Group
        position="center"
        p={0}
        sx={{
          background: 'rgba(245, 181, 44, 0.3)',
          minHeight: '90px',
          '@media screen and (min-width: 740px)': {
            padding: '10px 0 5px 0',
            borderRadius: 8,
          },
        }}
      >
        <Swiper
          spaceBetween={10}
          style={{ padding: '0 10px 0 10px', width: '100%', height: 'max-content' }}
          breakpoints={{
            100: {
              slidesPerView: 3.2,
            },
            300: {
              slidesPerView: 4.2,
            },
            500: {
              slidesPerView: 5,
            },
          }}
        >
          {props?.ICarousal?.map((item: any) => (
            <SwiperSlide key={item?.id} style={{ height: 'auto' }}>
              <Link href={`/instructors/${item?.id}`} passHref>
                <Anchor underline={false} style={{ cursor: 'pointer' }}>
                  <Stack align="center" spacing={0} sx={{ position: 'relative' }}>
                    <Avatar
                      radius="xl"
                      sx={{
                        width: '60px',
                        height: '60px',
                        '@media screen and (min-width: 740px)': {
                          width: '90px',
                          height: '90px',
                          borderRadius: '100%',
                        },
                      }}
                    >
                      <ImageWithFallback
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                        src={item?.image}
                        placeholder="blur"
                        layout="fill"
                        fallbackSrc={`https://ui-avatars.com/api/?bold=true&background=D8DDE7&rounded=true&format=png&size=256&name=${item?.name}`}
                      />
                    </Avatar>
                    <Text
                      color="dark"
                      sx={{
                        fontSize: 10,
                        whiteSpace: 'nowrap',
                        '@media screen and (min-width: 740px)': {
                          fontSize: 14,
                        },
                      }}
                    >
                      <EllipsisText text={item?.name || ''} length={13} />
                    </Text>
                  </Stack>
                </Anchor>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Group>
    </Container>
  );
};
