import { Box } from '@mantine/core';
import { SVGProps } from 'react';

export const SearchIcon = (props: SVGProps<SVGSVGElement> & { color?: any }) => {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.5 16C12.6421 16 16 12.6421 16 8.5C16 4.35786 12.6421 1 8.5 1C4.35786 1 1 4.35786 1 8.5C1 12.6421 4.35786 16 8.5 16Z"
        stroke={props.color || '#ACB7CA'}
        strokeWidth={'1.5'}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6195 14.0742L19 17"
        stroke={props.color || '#ACB7CA'}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
