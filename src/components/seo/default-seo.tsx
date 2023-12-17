import { DefaultSeo as NextDefaultSeo } from 'next-seo';
import { AppConfig } from '@/src/constants/settings/app-config';

export const DefaultSeo = () => (
  <NextDefaultSeo
    title={AppConfig.name}
    titleTemplate={`${AppConfig.name} | %s`}
    defaultTitle={AppConfig.name}
    description={AppConfig.description}
    canonical=""
    openGraph={{
      type: 'website',
      locale: 'en_IE',
      site_name: AppConfig.name,
    }}
    twitter={{
      handle: '@handle',
      site: '@site',
      cardType: 'summary_large_image',
    }}
    additionalMetaTags={[
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1 maximum-scale=1',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ]}
  />
);
