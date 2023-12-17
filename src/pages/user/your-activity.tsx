import { Seo } from '@/components/seo';
import { PageHeader } from '@/components/ui/pageHeader';
import { Container, Group, Space, Stack, Tabs, Text } from '@mantine/core';
import React from 'react';

export const YourActivity = () => (
  <div>
    <Seo title="Your activity" description="Your activity" path="/user/your-activity" />
    <PageHeader
      title="Your activity"
      rightSection={
        <Text sx={{ color: '#82B1CF' }} size="sm">
          50 points
        </Text>
      }
    />

    <Space h={20} />
    <Container>
      <Tabs
        tabPadding="xs"
        variant="unstyled"
        styles={(theme) => ({
          tabControl: {
            backgroundColor: theme.white,
            color: theme.colors.gray[9],
            fontSize: theme.fontSizes.sm,
            borderRadius: 3,
            flexGrow: 1,
            height: 32,
            '&:first-of-type': {
              borderRadius: '6px 0 0 6px',
            },
            '&:last-of-type': {
              borderRadius: '0 6px 6px 0',
            },
          },
          tabsList: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(50px,1fr))',
            width: '100%',
            paddingInline: '16px',
          },
          tabActive: {
            backgroundColor: '#82B1CF',
            boxShadow: 'inset 0px 1px 4px rgba(0, 0, 0, 0.25)',
            color: theme.white,
          },
        })}
      >
        <Tabs.Tab label="Earn" tabKey="earn">
          <Space h={15} />
          <Stack>
            {[1, 2].map((item) => (
              <Stack
                key={item}
                spacing={0}
                sx={{
                  '& .item:not(:last-of-type)': {
                    borderBottom: '1px solid #E3E4E5',
                  },
                }}
              >
                <Text px={16} size="xs" weight={500}>
                  {item + 2} May 2022
                </Text>
                <Space h={10} />
                {[1, 2].map((item) => (
                  <Group
                    className="item"
                    key={item}
                    px={16}
                    sx={{ background: 'white', height: '45px' }}
                    position="apart"
                    align="center"
                  >
                    <Text size="xs">you have subscribed to a course</Text>
                    <Text size="xs">+10 points</Text>
                  </Group>
                ))}
              </Stack>
            ))}
          </Stack>
        </Tabs.Tab>
        <Tabs.Tab label="consumed" tabKey="consumed">
          <Space h={15} />
          <Stack>
            {[1, 2].map((item) => (
              <Stack
                key={item}
                spacing={0}
                sx={{
                  '& .item:not(:last-of-type)': {
                    borderBottom: '1px solid #E3E4E5',
                  },
                }}
              >
                <Text px={16} size="xs" weight={500}>
                  {item + 2} May 2022
                </Text>
                <Space h={10} />
                {[1, 2].map((item) => (
                  <Group
                    className="item"
                    key={item}
                    px={16}
                    sx={{ background: 'white', height: '45px' }}
                    position="apart"
                    align="center"
                  >
                    <Text size="xs">you have subscribed to a course</Text>
                    <Text size="xs">-10 points</Text>
                  </Group>
                ))}
              </Stack>
            ))}
          </Stack>
        </Tabs.Tab>
      </Tabs>
    </Container>
  </div>
);

export default YourActivity;
