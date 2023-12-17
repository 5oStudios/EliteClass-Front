import React, { SVGProps } from 'react';

export const Filter = (props: SVGProps<SVGSVGElement> & { active?: boolean; color?: string }) => {
  return (
    <div>
      <svg
        width={20}
        height={20}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 20"
        {...props}
      >
        <path
          stroke={props.color || '#200E32'}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
          d="M8.234 15.604H1m18.235.001a2.88 2.88 0 1 1-5.76 0 2.88 2.88 0 0 1 5.76 0ZM12 3.88h7.235M1 3.88a2.88 2.88 0 1 0 5.76 0 2.88 2.88 0 0 0-5.76 0v0Z"
        />
      </svg>
    </div>
  );
};
