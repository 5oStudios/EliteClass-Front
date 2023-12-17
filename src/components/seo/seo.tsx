import { NextSeo, NextSeoProps } from 'next-seo';

interface SeoProps extends NextSeoProps {
  path: string;
}

export const Seo = ({ title, description, path }: SeoProps) => (
  <NextSeo
    title={title}
    description={description}
    openGraph={{
      url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${path}`,
      title,
      description,
      images: [
        {
          url: '/assets/images/og-image-01.png', //TODO: this is not a valid image
          width: 800,
          height: 600,
          alt: 'Og Image Alt',
        },
        {
          url: '/assets/images/og-image-02.png', //TODO: this is not a valid image
          width: 900,
          height: 800,
          alt: 'Og Image Alt Second',
        },
      ],
    }}
  />
);
