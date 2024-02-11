import { Badge, BadgeProps } from '@mantine/core';

interface DiscountBadge {
  value: string | number | undefined;
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
        borderRadius: props.dir === 'right' ? '0 0 0 10px' : '0 0 10px 0',
      }}
      color="orange"
      {...props}
    >
      {props.value}
    </Badge>
  );
};
