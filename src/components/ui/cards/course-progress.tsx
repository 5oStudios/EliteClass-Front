import { AspectRatio, Card, MediaQuery, Progress, SimpleGrid, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import React from 'react';
import en from '@/src/constants/locales/en-us/common.json';
import ar from '@/src/constants/locales/ar-kw/common.json';
import { useRouter } from 'next/router';
import ImageWithFallback from '../ImageWithFeedback';
import { shimmer, toBase64 } from '@/utils/utils';

type Props = {
  image: string;
  progress: number;
  title: {
    en: string;
  };
  course_id: number;
};

//const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
export const CourseProgressCard = ({ title, image, progress, course_id }: Props) => {
  //language
  const router = useRouter();
  const t = router.locale === 'en-us' ? en : ar;
  //language

  const progressLabel = (progress: number) => {
    if (progress === 0) {
      return 'Not progress yet...';
    }
    if (progress === 100) {
      return 'Completed 100%';
    }
    return `${t.overall_Progress} ${progress}%`;
  };

  return (
    <div>
      <Card
        radius={8}
        sx={{ position: 'relative', background: 'none', backgroundColor: 'none' }}
        p={8}
      >
        <SimpleGrid sx={{ gridTemplateColumns: '30% 1fr' }}>
          <MediaQuery smallerThan="xs" styles={{ display: 'none' }}>
            <AspectRatio ratio={16 / 9} sx={{ borderRadius: 8, overflow: 'hidden' }}>
              <ImageWithFallback
                src={image}
                objectFit="cover"
                layout="fill"
                fallbackSrc="/assets/images/default.png"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              />
            </AspectRatio>
          </MediaQuery>
          <MediaQuery largerThan="xs" styles={{ display: 'none' }}>
            <AspectRatio ratio={1 / 1} sx={{ borderRadius: 8, overflow: 'hidden' }}>
              <ImageWithFallback
                src={image}
                objectFit="cover"
                layout="fill"
                fallbackSrc="/assets/images/default.png"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
              />
            </AspectRatio>
          </MediaQuery>
          <Stack spacing={5}>
            <Text
              weight={500}
              sx={(theme) => ({ fontSize: 12, color: theme?.other?.headingColor })}
            >
              {title}
            </Text>
            <Stack>
              <Text size="xs" sx={{ color: '#666666' }}>
                {progressLabel(progress)}
              </Text>
              <Progress
                color={progress === 100 ? 'green' : progress > 70 ? 'red' : 'blue'}
                value={progress}
              />
            </Stack>
          </Stack>
        </SimpleGrid>
      </Card>
    </div>
  );
};
