import { SVGProps } from 'react';

const GiftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width={28} height={28} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M22.718 11.862H4.663v9.028c0 3.385 1.129 4.514 4.514 4.514h9.028c3.385 0 4.513-1.129 4.513-4.514v-9.028ZM24.445 8.477v1.129c0 1.24-.598 2.256-2.257 2.256H5.261c-1.726 0-2.256-1.015-2.256-2.256V8.477c0-1.241.53-2.257 2.256-2.257h16.927c1.659 0 2.257 1.016 2.257 2.257Z"
      stroke="#82B1CF"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.319 6.22h-6.23a1.057 1.057 0 0 1 .034-1.467l1.603-1.602a1.083 1.083 0 0 1 1.523 0l3.07 3.07ZM20.349 6.22h-6.23l3.07-3.07a1.083 1.083 0 0 1 1.523 0l1.603 1.603c.406.406.417 1.05.034 1.467ZM10.272 11.862v5.8c0 .903.993 1.434 1.749.948l1.06-.7a1.127 1.127 0 0 1 1.242 0l1.004.678a1.125 1.125 0 0 0 1.75-.937v-5.789h-6.805Z"
      stroke="#82B1CF"
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default GiftIcon;
