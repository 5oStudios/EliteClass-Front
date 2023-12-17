import { AspectRatio, Card, Text, Space, Stack, SimpleGrid } from '@mantine/core';
import React, { useState } from 'react';
import useNextBlurhash from 'use-next-blurhash';
import NextImage from 'next/image';
import Link from 'next/link';
import defultImage from '@/public/assets/images/placeholders/instructor.png';
// @ts-ignore
import EllipsisText from 'react-ellipsis-text';
import { shimmer, toBase64 } from '@/utils/utils';

type Props = {
  name: string;
  image_path: string;
  job_title: string;
  layoutGrid: boolean;
  href: string;
};

export const InstructorCard = ({ name, job_title, image_path, layoutGrid, href }: Props) => {
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  const [defaultImage, setDefaultImage] = useState(false);
  const [img, setImg] = useState(image_path)

  return layoutGrid ? (
    <Link href={href} passHref>
      <Text component="a" sx={{ cursor: 'pointer' }}>
        <Card radius={8} sx={{ width: '100%', height: '100%', position: 'relative' }} p={8}>
          <AspectRatio
            ratio={17 / 16}
            sx={{ maxWidth: '100%', maxHeight: 250 }}
            mx="auto"
            style={{ overflow: 'hidden', borderRadius: 9 }}
          >
            <NextImage
              src={img}
              layout="fill"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              onError={() => {
                setImg('/assets/images/placeholders/instructor.png');
              }}
            />
          </AspectRatio>
          <Space h="sm" />
          <Text weight={500} size="xs" transform="capitalize">
            {name}
          </Text>
          <Text
            size="xs"
            sx={{
              color: '#666666',
              lineHeight: '1.3em',
            }}
          >
            <EllipsisText text={job_title} length={60} />
          </Text>
        </Card>
      </Text>
    </Link>
  ) : (
    <div>
      <Link href={href} passHref>
        <Text component="a" sx={{ cursor: 'pointer' }}>
          <Card radius={8} sx={{ width: '100%', height: '100%', position: 'relative' }} p={8}>
            <SimpleGrid sx={{ gridTemplateColumns: '1fr 2fr', alignContent: 'stretch' }}>
              <AspectRatio
                ratio={1 / 1}
                sx={{ width: '100%', maxHeight: 250 }}
                mx="auto"
                style={{ overflow: 'hidden', borderRadius: 9 }}
              >
                <NextImage
                  src={img}
                  layout="fill"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                  onError={() => {
                    setImg('/assets/images/placeholders/instructor.png');
                  }}
                />
              </AspectRatio>
              <Stack>
                <Text weight={500} size="xs">
                  {name}
                </Text>
                <Text size="xs" sx={{ color: '#666666', lineHeight: '1.3em' }}>
                  <EllipsisText text={job_title} length={80} />
                </Text>
              </Stack>
            </SimpleGrid>
          </Card>
        </Text>
      </Link>
    </div>
  );
};
