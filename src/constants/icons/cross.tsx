import { SVGProps } from 'react';

const CrossIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={13} height={13} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6.335 0a6.335 6.335 0 1 0 0 12.669A6.335 6.335 0 0 0 6.335 0Zm3.167 8.75a.56.56 0 1 1-.792.791L6.335 7.166 3.959 9.549a.56.56 0 0 1-.792-.792l2.376-2.39L3.1 3.903a.56.56 0 1 1 .792-.792l2.443 2.47L8.777 3.14a.56.56 0 1 1 .792.791L7.126 6.366 9.502 8.75Z"
      fill="#ACB7CA"
    />
  </svg>
);

export default CrossIcon;
