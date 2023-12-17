import { Container } from '@mantine/core';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CoursesCard } from '@/components/ui/cards/courses-card';
import 'swiper/css';

export const CoursesCarousal = (props: any) => {
  const { isBundled = 'false' } = props;
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
        {props?.CCarousal?.map((item: any) => (
          <SwiperSlide key={item?.id} style={{ height: 'auto' }}>
            <CoursesCard
              ratio={props.ratio}
              id={item?.id}
              in_wishlist={item?.in_wishlist}
              href={{
                pathname: '/courses/[courseId]',
                query: { courseId: item?.id, isBundled },
                shallow: true,
              }}
              layoutGrid
              key={item?.id}
              {...item}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};
