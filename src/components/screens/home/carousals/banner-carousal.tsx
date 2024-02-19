import { Container } from '@mantine/core';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import styles from '@/src/styles/swiper-paginiation.module.css';
import NextImage from 'next/image';
import useNextBlurhash from 'use-next-blurhash';
import { shimmer, toBase64 } from '@/utils/utils';
import { useOs } from '@mantine/hooks';
const Card1 = (props: any) => {
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const [defaul, setDefaul] = useState(false);
  return (
    <Container
      py={10}
      sx={{
        background: '#EDD491',
        height: 150,
        borderRadius: 8,
        position: 'relative',

        img: {
          objectFit: 'fill',
        },

        '@media screen and (min-width: 740px)': {
          height: 250,

          img: {
            objectFit: 'cover',
          },
        },
      }}
    >
      <NextImage
        alt="image"
        src={defaul ? '/assets/images/default.png' : props?.carddata?.image}
        layout="fill"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        priority
        style={{ borderRadius: 8 }}
        onError={() => setDefaul(true)}
      />
    </Container>
  );
};

export const BannerCarousal = (props: any) => {
  const os = useOs();
  let cards = [];
  cards = props?.bCarousal;

  const handleClick = (item: any) => {
    if (item.link.startsWith('https://lms') || item.link.startsWith('https://lms')) {
      window.open(item.link);
    } else {
      if (os === 'ios' || os === 'android') {
        console.log('link to open: ', item.link);
      } else {
        window.open(item.link, '_blank');
      }
    }
  };
  return (
    <Container
      p={0}
      sx={{
        position: 'relative',
      }}
    >
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        autoHeight
        onAutoplayPause={(swiper) => {
          swiper.autoplay.start();
        }}
        modules={cards?.length > 1 ? [Pagination, Autoplay] : [Autoplay]}
        pagination={{
          clickable: true,
          bulletActiveClass: styles.active,
          bulletClass: styles.bullet,
          horizontalClass: 'horizontal_pagination',
        }}
      >
        {cards?.map((item: any, index: any) => (
          <SwiperSlide
            key={index}
            onClick={() => {
              handleClick(item);
            }}
          >
            <Card1 key={item?.id} carddata={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};
