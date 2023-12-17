import { SVGProps } from 'react';

export const UserIcon = (props: SVGProps<SVGSVGElement> & { active?: boolean; dark?: boolean }) => {
  const { active = false, dark = false, ...rest } = props;
  return (
    <svg width={14} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M7 11.486c-3.236 0-6 .49-6 2.45 0 1.96 2.746 2.466 6 2.466 3.236 0 6-.49 6-2.449 0-1.959-2.746-2.467-6-2.467ZM7 8.691a3.846 3.846 0 1 0-3.846-3.845A3.832 3.832 0 0 0 7 8.69v0Z"
        stroke={'#298EAE'}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UserIcon2 = (props: SVGProps<SVGSVGElement> & { active: boolean; dark?: boolean }) => {
  const { active = false, dark = false, ...rest } = props;
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
        stroke={props.active ? '#EDD491' : dark ? '#FFFFFF' : '#ACB7CA'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
        stroke={props.active ? '#EDD491' : dark ? '#FFFFFF' : '#ACB7CA'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
