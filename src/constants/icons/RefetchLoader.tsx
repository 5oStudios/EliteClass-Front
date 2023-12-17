import { Affix, Loader } from '@mantine/core';
import React from 'react';

export const RefetchLoader = ({ isRefetching }: { isRefetching: boolean }) => {
  return (
    <div>
      <Affix
        position={{ right: 5, top: 5 }}
        sx={{
          display: isRefetching ? 'block' : 'none',
        }}
      >
        <Loader size={25} />
      </Affix>
    </div>
  );
};
