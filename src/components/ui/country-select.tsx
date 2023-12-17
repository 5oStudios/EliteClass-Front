import { getCountryCallingCode, getCountries } from 'react-phone-number-input';
import { forwardRef } from 'react';
import { Box, Select, Text } from '@mantine/core';
import { ChevronDownIcon } from '@modulz/radix-icons';
import { CountryCode } from 'libphonenumber-js/types';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  name: CountryCode;
  Icon: any;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, name, Icon, ...others }: ItemProps, ref) => (
    <Box sx={{ display: 'flex', gap: '9px' }} ref={ref} {...others}>
      <Text size="sm">{name}</Text>
      <Text>+{getCountryCallingCode(name)}</Text>
    </Box>
  )
);

export const CountrySelect = ({
  value,
  disabled,
  onChange,
  options,
  iconComponent: Icon,
  ...rest
}: any) => {
  const data = getCountries().map((country) => ({
    value: country,
    label: `+${getCountryCallingCode(country)}`,
    name: country,
    image: country,
    Icon,
  }));

  return (
    <div>
      <Select
        data={data}
        value={value}
        onChange={onChange}
        disabled={disabled}
        itemComponent={SelectItem}
        variant="filled"
        size="md"
        radius={20}
        styles={(theme: any) => ({
          filledVariant: {
            '@media (min-width: 800px)': {
              height: '60px',
            },
          },
          root: {
            maxWidth: '150px',
          },
          input: {
            backgroundColor: '#F7F6F5', //theme.colorScheme === 'dark' ? theme.colors.gray[9] : '#fff',
            color: '#000000',
          },
        })}
        icon={
          <Box sx={{ width: 50 }} mx={10}>
            <Icon country={value} label={value} aspectRatio={1.133} />
          </Box>
        }
      />
    </div>
  );
};
