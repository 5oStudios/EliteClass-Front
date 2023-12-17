import { Container } from '@mantine/core';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LiveSessionCard } from '@/components/ui/cards/live-session-card';
import 'swiper/css';

export const LiveSessionCarousal = ({ type, ...props }: any) => {
  return (
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
        {props?.LCarousal?.map((item: any, i: number) => (
          <SwiperSlide key={`${item?.title}-${item?.date}-${i}`} style={{ height: 'auto' }}>
            <LiveSessionCard
              ratio={props.ratio}
              id={item.id}
              typ={type}
              href={{
                pathname:
                  type == 'live' ? `/live-sessions/${item.id}` : `/in-person-sessions/${item.id}`,
                query: {
                  id: item.id,
                  type,
                },
              }}
              show_price={props.show_price || false}
              {...item}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};
