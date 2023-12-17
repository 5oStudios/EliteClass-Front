import useNextBlurhash from 'use-next-blurhash';

export const useBlur = () => {
  const [blurDataUrl] = useNextBlurhash('LEHV6nWB2yk8pyo0adR*.7kCMdnj');
  return [blurDataUrl] as const;
};
