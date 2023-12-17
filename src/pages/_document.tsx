import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';
import { ServerStyles, createStylesServer } from '@mantine/next';
import rtlPlugin from 'stylis-plugin-rtl';
// import OneSignal from '../../public/OneSignalSDKWorker';

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const stylesServer = createStylesServer(
      ctx.locale === 'ar-kw'
        ? { key: 'mantine-rtl', stylisPlugins: [rtlPlugin] }
        : { key: 'mantine' }
    );

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}

          <ServerStyles html={initialProps.html} server={stylesServer} />
        </>
      ),
    };
  }
  render() {
    const { locale } = this.props.__NEXT_DATA__;
    const dir = locale === 'ar-kw' ? 'rtl' : 'ltr';
    return (
      <Html lang={locale} dir={dir}>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />

          {/* <script src="https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js" async /> */}
          <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async />
        

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />

        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
