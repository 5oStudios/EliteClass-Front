import { ActionIcon, AspectRatio, Box, Progress, SimpleGrid, Slider, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { VideoStopIcon } from '@/src/constants/icons/video-stop-icon';
import { VideoPlayIcon } from '@/src/constants/icons/video-play-icon';
import { FullScreenIcon } from '@/src/constants/icons/full-screen';
import { PlayPrev } from '@/src/constants/icons/play-prev';
import { DotsGroup, PlayNext } from '@/src/constants/icons';
import { secondsToTime } from '@/utils/utils';

type Props = {
  src: string;
};

export const Videoplayer = ({ src }: Props) => {
  // const [isPlaying, setIsPlaying] = useState(true);
  // const [played, setPlayed] = useState(0);
  // const [loaded, setLoaded] = useState(0);
  // const [playedSeconds, setPlayedSeconds] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const playerRef = useRef<ReactPlayer>(null);
  // // @ts-ignore
  // const { hovered, ref } = useHover(null);
  //
  // const handleSeek = (value: number) => {
  //   setPlayed(value);
  //   // @ts-ignore
  //   playerRef.current.seekTo(value);
  // };

  return (
    <>
      <AspectRatio ratio={16 / 9}>
        <Box
          sx={{
            borderRadius: 9,
            maxWidth: '100',
            maxHeight: '90vh',
            position: 'relative',
            background: 'black',
          }}
        >
          <ReactPlayer
            style={{
              borderRadius: 10,
              overflow: 'hidden',
              margin: 'auto',
            }}
            width="100%"
            height="100%"
            // playing={isPlaying}
            // progressInterval={1000}
            // onProgress={(e) => {
            //   setPlayedSeconds(e.playedSeconds);
            //   setLoaded(e.loaded);
            //   setPlayed(e.played);
            // }}
            // onDuration={(e) => setDuration(e)}
            controls={true}
            url={src}
            config={{
              youtube: { playerVars: { disablekb: 1 } },
              vimeo: {
                playerOptions: {
                  autoplay: 1,
                  responsive: true,
                  title: true,
                  texttrack: 'en.captions',
                  pip: true,
                },
              },
            }}
          />

          {/* <Box */}
          {/*   sx={{ */}
          {/*     opacity: hovered ? '1' : '0', */}
          {/*     position: 'absolute', */}
          {/*     top: 10, */}
          {/*     right: 10, */}
          {/*   }} */}
          {/* > */}
          {/*   <ActionIcon variant="transparent"> */}
          {/*     <DotsGroup /> */}
          {/*   </ActionIcon> */}
          {/* </Box> */}
          {/* <SimpleGrid */}
          {/*   sx={{ */}
          {/*     gridTemplateColumns: '1fr 1fr 1fr', */}
          {/*     opacity: hovered ? '1' : '0', */}
          {/*     position: 'absolute', */}
          {/*   }} */}
          {/* > */}
          {/*   <ActionIcon variant="transparent"> */}
          {/*     <PlayPrev /> */}
          {/*   </ActionIcon> */}
          {/*   <ActionIcon variant="transparent" onClick={() => setIsPlaying(!isPlaying)}> */}
          {/*     {!isPlaying ? <VideoPlayIcon /> : <VideoStopIcon />} */}
          {/*   </ActionIcon> */}
          {/*   <ActionIcon variant="transparent"> */}
          {/*     <PlayNext /> */}
          {/*   </ActionIcon> */}
          {/* </SimpleGrid> */}
          {/* <SimpleGrid */}
          {/*   sx={{ */}
          {/*     gridTemplateColumns: 'max-content 1fr max-content max-content', */}
          {/*     opacity: hovered ? '1' : '0', */}
          {/*     alignItems: 'center', */}
          {/*     position: 'absolute', */}
          {/*     zIndex: 3, */}
          {/*     bottom: 10, */}
          {/*     left: '2%', */}
          {/*     right: '2%', */}
          {/*   }} */}
          {/* > */}
          {/*   <Text sx={{ color: 'white' }} weight={500} size="xs"> */}
          {/*     {secondsToTime(playedSeconds)} */}
          {/*   </Text> */}
          {/*   <Box> */}
          {/*     <Progress */}
          {/*       size="sm" */}
          {/*       styles={(theme) => ({ */}
          {/*         root: { */}
          {/*           position: 'relative', */}
          {/*           top: 7, */}
          {/*           background: theme.colors.gray[6], */}
          {/*         }, */}
          {/*         bar: { */}
          {/*           background: theme.colors.gray[1], */}
          {/*           opacity: 0.5, */}
          {/*         }, */}
          {/*       })} */}
          {/*       value={loaded * 100} */}
          {/*     /> */}
          {/*     <Slider */}
          {/*       value={played} */}
          {/*       onChange={handleSeek} */}
          {/*       min={0} */}
          {/*       max={1} */}
          {/*       step={0.05} */}
          {/*       label={null} */}
          {/*       defaultValue={0} */}
          {/*       labelTransition="fade" */}
          {/*       size={5} */}
          {/*       styles={(theme) => ({ */}
          {/*         bar: { */}
          {/*           background: 'white', */}
          {/*         }, */}
          {/*         track: { */}
          {/*           '&:before': { */}
          {/*             backgroundColor: 'transparent', */}
          {/*           }, */}
          {/*         }, */}
          {/*         thumb: { */}
          {/*           height: 12, */}
          {/*           width: 12, */}
          {/*           backgroundColor: theme.white, */}
          {/*           borderWidth: 1, */}
          {/*           borderColor: 'white', */}
          {/*           boxShadow: theme.shadows.sm, */}
          {/*         }, */}
          {/*       })} */}
          {/*     /> */}
          {/*   </Box> */}
          {/*   <Text sx={{ color: 'white' }} weight={500} size="xs"> */}
          {/*     {secondsToTime(duration)} */}
          {/*   </Text> */}
          {/*   <ActionIcon variant="transparent"> */}
          {/*     <FullScreenIcon /> */}
          {/*   </ActionIcon> */}
          {/* </SimpleGrid> */}
        </Box>
      </AspectRatio>
    </>
  );
};
