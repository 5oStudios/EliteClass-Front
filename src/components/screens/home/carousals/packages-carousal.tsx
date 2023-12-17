import { Container } from '@mantine/core';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { PackagesCard } from '@/components/ui/cards/packages-card';

export const PackagesCarousal = (props: any) => (
  <Container p={0}>
    <Swiper
      slidesPerView={props.slides?.[0] || 1.8}
      spaceBetween={10}
      freeMode
      breakpoints={{
        600: {
          slidesPerView: props.slides?.[1] || 3,
        },
      }}
    >
      {props?.PCarousal?.map((item: any) => (
        <SwiperSlide key={item.id} style={{ height: 'auto' }}>
          <PackagesCard
            ratio={props.ratio}
            id={item.id}
            in_wishlist={item?.in_wishlist}
            href={`/packages/${item.id}`}
            {...item}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </Container>
);
