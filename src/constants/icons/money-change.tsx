import { SVGProps } from 'react';

const MoneyChange = (props: SVGProps<SVGSVGElement>) => (
  <svg width={18} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1.5 8.25v-1.5C1.5 4.125 3 3 5.25 3h7.5C15 3 16.5 4.125 16.5 6.75v4.5c0 2.625-1.5 3.75-3.75 3.75H9"
      stroke="#82B1CF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.875 9a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0ZM13.875 7.125v3.75M1.5 11.625h4.005a.87.87 0 0 1 .87.87v.96"
      stroke="#82B1CF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m2.415 10.71-.915.915.915.915M6.375 15.585H2.37a.87.87 0 0 1-.87-.87v-.96"
      stroke="#82B1CF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m5.46 16.5.916-.915-.915-.915"
      stroke="#82B1CF"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default MoneyChange;
