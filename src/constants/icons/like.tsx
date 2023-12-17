import React from 'react';

export const LikeIcon = (color?: string) => {
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.47998 18.35L10.58 20.75C10.98 21.15 11.88 21.35 12.48 21.35H16.28C17.48 21.35 18.78 20.45 19.08 19.25L21.48 11.95C21.98 10.55 21.08 9.35 19.58 9.35H15.58C14.98 9.35 14.48 8.85 14.58 8.15L15.08 4.95C15.28 4.05 14.68 3.05 13.78 2.75C12.98 2.45 11.98 2.85 11.58 3.45L7.47998 9.55"
          stroke={color || '#82B1CF'}
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />
        <path
          d="M2.38 18.35V8.54999C2.38 7.14999 2.98 6.64999 4.38 6.64999H5.38C6.78 6.64999 7.38 7.14999 7.38 8.54999V18.35C7.38 19.75 6.78 20.25 5.38 20.25H4.38C2.98 20.25 2.38 19.75 2.38 18.35Z"
          stroke={color || '#82B1CF'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
