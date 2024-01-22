import { Badge, BadgeProps } from '@mantine/core';

interface DiscountBadge {
  value: string | number;
  dir: 'left' | 'right';
}
export const DiscountBadge = (props: BadgeProps<any> & DiscountBadge) => {
  return (
    <Badge
      sx={{
        width: 'fit-content',
        position: 'absolute',
        [props.dir]: 0,
        top: 0,
        borderRadius: '0 0 0 8px',
      }}
      color="orange"
      {...props}
    >
      {props.value}
    </Badge>
  );
};
