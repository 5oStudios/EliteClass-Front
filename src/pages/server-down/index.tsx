import { Box, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import React from 'react';

export const ServerDown = () => {

    return (
        <Box>
            <Stack align="center" mt={50}>
                <Box sx={{ width: '150px', maxWidth: '100%' }}>
                    {/* <Image src="/assets/page_not_found.svg" /> */}
                </Box>
                <Text align="center" weight={500} sx={{ fontSize: 20, color: "#535C7D" }}>
                    Something went wrong
                </Text>
                {/* <Text pl={50} pr={50} align="center" sx={{ fontSize: 15, color: "#939393" }}>
              The page you are looking for doesn&apos;t seem to exit
            </Text> */}
                {/* <Button
              color="blue"
              variant="filled"
              size="md"
              radius="xl"
              fullWidth
              onClick={() => router.replace('/')}
              styles={{
                root: {
                  maxWidth: '200px',
                  margin: 'auto',
                },
                label: {
                  color: 'white',
                },
                filled: {
                  background: '#82B1CF',
                  '&:hover': {
                    background: '#82B1CF',
                  },
                },
              }}
            >
              {t.go_to_tome}
            </Button> */}
            </Stack>
        </Box>
    )
};

export default ServerDown;
