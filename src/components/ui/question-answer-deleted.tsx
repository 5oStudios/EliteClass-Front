import { Box, Button, Stack, Text, Image } from '@mantine/core';
import React from 'react';
import { useRouter } from 'next/router';

export const QuestionOrAnswerDeleted = () => {
  const router = useRouter();

  return (
    <Box>
      <Stack align="center" mt={50}>
        <Box sx={{ width: '150px', maxWidth: '100%' }}>
          <Image src="/assets/page_not_found.svg" />
        </Box>
        <Text align="center" weight={500} sx={{ fontSize: 20, color: "#535C7D" }}>
          Resource Deleted
        </Text>
        <Text pl={50} pr={50} align="center" sx={{ fontSize: 15, color: "#939393" }}>
          The page you are looking for doesn&apos;t seem to exit
        </Text>
        <Button
          color="blue"
          variant="filled"
          size="md"
          radius="xl"
          fullWidth
          onClick={() => router.back()}
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
          Go to Back
        </Button>
      </Stack>
    </Box>
  )
};

