import React from 'react';

export const SaveIcon = (props:any) => {
  return (
    <div>
      <svg
        width="13"
        height="13"
        viewBox="0 -0.5 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.75024 5.60596H5.25024"
          stroke={props?.color}
          strokeWidth="1.3"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.90967 1.28076H4.08967C3.02467 1.28076 2.15967 2.15076 2.15967 3.21076V10.2558C2.15967 11.1558 2.80467 11.5358 3.59467 11.1008L6.03467 9.74576C6.29467 9.60076 6.71467 9.60076 6.96967 9.74576L9.40967 11.1008C10.1997 11.5408 10.8447 11.1608 10.8447 10.2558V3.21076C10.8397 2.15076 9.97467 1.28076 8.90967 1.28076Z"
          stroke={props?.color}
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
