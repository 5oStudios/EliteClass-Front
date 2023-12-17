import React, { SVGProps } from 'react';

export const BellDark = (props: SVGProps<SVGSVGElement>) => {
  return (
    <div>
      <svg
        width={19}
        height={19}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 19 19"
        {...props}
      >
        <path
          stroke="#EDD491"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
          d="M9.5 5.098v2.637m.016-6.152a5.27 5.27 0 0 0-5.273 5.273v1.662c0 .539-.221 1.346-.498 1.805l-1.006 1.679c-.617 1.037-.19 2.193.95 2.573a18.477 18.477 0 0 0 11.662 0 1.757 1.757 0 0 0 .95-2.573l-1.006-1.679c-.277-.459-.499-1.274-.499-1.805V6.856c-.008-2.898-2.383-5.273-5.28-5.273Z"
        />
        <path
          stroke="#EDD491"
          strokeMiterlimit="10"
          strokeWidth="1.5"
          d="M12.136 14.9A2.646 2.646 0 0 1 9.5 17.534c-.72 0-1.385-.3-1.86-.775a2.64 2.64 0 0 1-.776-1.86"
        />
      </svg>
    </div>
  );
};
