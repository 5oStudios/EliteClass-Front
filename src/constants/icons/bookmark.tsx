import React from 'react';

export const BookmarkIcon = ({ color }: { color?: string }) => {
  return (
    <>
      <svg
        width="14"
        height="17"
        viewBox="0 0 14 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.70426 13.3718L2.11252 15.9048C1.9361 15.997 1.73102 16.0165 1.5406 15.9592C1.35019 15.9018 1.18937 15.772 1.09213 15.5973V15.5973C1.03408 15.4857 1.00254 15.362 1 15.236L1 3.99969C1 1.85839 2.45239 1 4.54348 1H9.45419C11.481 1 13 1.79986 13 3.85688V15.236C13 15.4386 12.9201 15.633 12.778 15.7762C12.6359 15.9195 12.4431 16 12.2421 16C12.1138 15.998 11.9877 15.9662 11.8735 15.9071L7.25006 13.3718C7.16624 13.3261 7.07245 13.3021 6.97716 13.3021C6.88187 13.3021 6.78808 13.3261 6.70426 13.3718Z"
          stroke={color || '#200E32'}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.15405 6.10742H9.80567"
          stroke={color || '#200E32'}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
