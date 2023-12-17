import { Anchor, Box, Group, Paper, SimpleGrid, Text, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { mobileNavigation } from '@/src/constants/settings/site-navigation';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';

export const TabsMenu = () => {
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  const { colorScheme } = useMantineColorScheme();
  return (
    <Box>
      <Paper p={0} sx={{ backgroundColor: colorScheme == 'dark' ? '#333333' : '#ffffff' }}>
        <Group align="center" sx={{ height: 80, width: '100%' }}>
          <Group
            spacing={30}
            sx={{
              margin: 'auto',
              width: '100%',
              justifyContent: 'space-evenly',
            }}
          >
            {mobileNavigation.map((item, index) => (
              <Link href={item.url} prefetch passHref key={index}>
                <Anchor color="gray" underline={false}>
                  <SimpleGrid
                    sx={{ gridTemplateRows: '60% 40%', justifyItems: 'center' }}
                    spacing={2}
                  >
                    <item.icon
                      active={item.url === router.pathname}
                      dark={colorScheme == 'dark'}
                    />
                    <Text
                      component="span"
                      sx={{
                        fontSize: '10px',
                        color:
                          item.url === router.pathname
                            ? '#EDD491'
                            : colorScheme == 'dark'
                            ? '#fff'
                            : '#ACB7CA',
                      }}
                      weight={300}
                    >
                      {/* @ts-ignore */}
                      {t[item.label]}
                    </Text>
                  </SimpleGrid>
                </Anchor>
              </Link>
            ))}
          </Group>
        </Group>
      </Paper>
    </Box>
  );
};
