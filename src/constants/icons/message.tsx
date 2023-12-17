import { Box } from '@mantine/core';
import { SVGProps } from 'react';

export const MessageIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={17}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    viewBox="0 0 17 16"
  >
    <path
      d="M12.907 5.337 9.58 8.015a1.734 1.734 0 0 1-2.142 0L4.084 5.337"
      stroke="#298EAE"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.812 1h7.352a3.866 3.866 0 0 1 2.795 1.24 3.913 3.913 0 0 1 1.034 2.885v5.091a3.91 3.91 0 0 1-1.034 2.886 3.867 3.867 0 0 1-2.792 1.24H4.812C2.535 14.348 1 12.496 1 10.219V5.13C1 2.852 2.535 1 4.812 1Z"
      stroke="#298EAE"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
