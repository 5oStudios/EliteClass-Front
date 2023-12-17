import { Global } from '@mantine/core';

export const GlobalStyles = () => {
  return (
    <Global
      styles={(theme) => ({
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },

        body: {
          ...theme.fn.fontStyles(),
          backgroundColor: theme.colorScheme === 'dark' ? '#333333' : '#FFFFFF',
          minHeight: '100vh',
          color: theme.colorScheme === 'dark' ? '#EDD491' : theme.black,
        },
        'html[dir="rtl"] .rtl': {
          transform: 'rotate(180deg)',
        },
        'html[dir="ltr"] .rtl': {
          transform: 'rotate(0deg)',
        },
        'html[dir="rtl"] .horizontal_pagination': {
          display: 'flex',
          gap: '2px',
          marginLeft: '-10px',
        },
        '.pdfZoomBtn': {
          background: 'none',
          position: 'fixed',
          display: 'flex',
          bottom: '50px',
          right: '10px',
          justifyContent: 'end',
          flexDirection: 'column',
        },
        '.pdfZoomBtn > button:child': {
          // background: 'none',
          marginTop: '1rem',
          border: 'none',
        },
        '.pdfZoomBtn > button': {
          background: '#ebd691',
          margin: '1rem',
          padding: '0.7rem',
        },
        'html[dir="ltr"] .horizontal_pagination': {
          display: 'flex',
          gap: '2px',
          marginLeft: '10px',
        },
        '.PhoneInput': {
          display: 'grid',
          gridTemplateColumns: '120px 1fr',
          gap: '0.5rem',
        },
        '.handlePhone .PhoneInput .PhoneInputInput .mantine-TextInput-wrapper input[aria-invalid="true"]':
          {
            position: 'relative',
            top: '15px',
          },
        '.handlePhone .PhoneInput .PhoneInputInput .mantine-TextInput-error': {
          position: 'relative',
          top: '15px',
        },
        '.my-courese .mantine-Select-rightSection': {
          display: 'none',
        },
        '.rotate-90': {
          transform: 'rotate(90deg)',
        },
        pdf_container: {
          maxWidth: '900px',
        },
        pdf: {
          width: '15vw',
          maxWidth: '900px',
        },
        '.linkAnnotation ': {
          position: 'absolute',
        },
        '.linkAnnotation a': {
          display: 'flex',
          width: '100%',
          height: '100%',
        },
        '.pdf-viewer': {
          background: 'blue',
          minHeight: '100vh',
        },
        '.pdf-page': {
          marginTop: 10,
          borderRadius: 5,
          overflow: 'hidden',
          marginInline: '10px',
        },
        '.handleCheckBoxWidth label': {
          width: '100%',
        },
        '.handleCheckBoxWidth': {
          width: '100%',
        },
        '.btnRemoveCoupon > div > span': {
          background: 'none',
          fontSize: '10px',
          color: 'red !important',
          fontWeight: 700,
        },
        
        '.btnapplyCoupon,.btnRemoveCoupon': {
          background: 'none !important',
          padding: '0px',
        },
        '.btnapplyCoupon > div > span': {
          background: 'none',
          fontSize: '10px',
          color: '#298EAE !important',
          fontWeight: 700,
        },
        '.selectSignUp > div >div >input': {
          background: '#f7f6f5',
          color: '#298EAE',
          borderRadius: '20px',
          padding: '1.3rem 0.9rem',
          border: 'none',
        },
        '.selectSignUp > div >div >div >svg': {
          color: '#298EAE',
          fill: '#298EAE',
          stroke: '#298EAE',
        },
        '.mantine-uquezq': {
          right: '10px',
        },
        // '.phoneNumberRTL .PhoneInputInput .mantine-TextInput-wrapper input': {
        //   'unicode-bidi': 'bidi-override',
        // },
        '.SwitchToggle > input ': {
          // width: '50%',
          height: '50px',
          backgroundColor: '#298eae',
          width: '100%',
        },
        '.SwitchToggle > input::after ': {
          fontSize: '1rem',
          color: 'white !important',
        },
        '.SwitchToggle > input:checked::before ': {
          fontSize: '1rem',
          color: 'white !important',
          transform: 'translateX(195px) !important',
        },
        '.SwitchToggle > input::before ': {
          fontSize: '1rem',
          color: 'white !important',
          transform: 'translateX(20px) !important',
        },
        '.togglebtn': {
          background: '#298eae !important',
          color: 'white',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
        },
        '.togglebtn >div >span': {
          color: 'white',
        },
        '.unSelect': {
          color: 'black',
          background: 'none !important',
        },
        '.amountText': {
          paddingLeft: '2rem',
        },

        '.paymentMethod': {
          position: 'relative',

          // border: '1px solid #ffdd83',
        },
        '.forPostInput >div > textarea': {
          color: theme.colorScheme === 'dark' ? 'black' : 'black',
        },
        '.paymentAndSummary': {
          position: 'fixed',
          bottom: 0,
          backgroundColor: theme.colorScheme === 'dark' ? '#333333' : '#FFFFFF',
          // maxWidth: '96%',
          width: '100%',
          // border: '1px solid red',
          display: 'block',
          margin: '0 auto',
        },
        '.viewImage >span > img': {
          height: 'unset !important',
          maxHeight: '100vh !important',
        },
        '@media (min-width:600px)': {
          '.paymentAndSummary': {
            position: 'relative',
            bottom: 0,
            backgroundColor: theme.colorScheme === 'dark' ? '#333333' : '#FFFFFF',
            // maxWidth: '96%',
            width: '-webkit-fill-available',
            // display: 'block',
            margin: '0 auto',
          },
        },
        '.paymentModal >div': {
          alignItems: 'end',
          padding: '0 !important',
          overflowX: 'hidden',
        },
        '.paymentBtn': { display: 'flex', justifyContent: 'end' },
        '.paymentBtn > button': { background: '#298eae' },
        '.paymentBtn > button >div >span': { color: 'white' },

        '.paymentModal > div > .mantine-1abbsss': {
          width: '100% !important',
        },
        '.mantine-1bgwvoq': {
          height: 'unset',
          minHeight: 'unset',
        },
        '.paymentAndSummary >div +div': {
          padding: '0.2rem',
        },
        '.showMessage >div> div': {
          backgroundColor: theme.colorScheme === 'dark' ? 'white' : 'white',
          color: theme.colorScheme === 'dark' ? 'black' : 'black',
        },
        '.summaryMain > div +div': {
          padding: '0.2rem',
          // border:'1px solid red'
        },
        '.removeCouponBtn': {
          background: 'none !important',
          backgroundColor: 'none',
          padding: '0px',
          color: 'red',
        },
        '.mantine-rtl-6y1794': {
          margin: '0 auto',
          display: 'block !important',
        },
        '.mantine-6y1794': {
          display: 'block !important',
        },
        '.button.mantine-Button-filled.mantine-Button-root.mantine-rtl-mw681o': {
          width: '100%',
        },
        '.showMessage >div': {
          display: 'flex',
          justifyContent: 'center',
          padding: '0 5rem',
        },
        '.showMessage >div >div': {
          display: 'flex',
          justifyContent: 'center',
          top: '45%',
          borderRadius: '20px',
        },
        '.splashHeight > span': {
          height: 'calc(100% - 35vh) !important',
          objectFit: 'cover',
          objectPosition: 'bottom',
        },
        '.removeCouponBtn > div > span': {
          background: 'none !important',
          backgroundColor: 'none',
          padding: '0px',
          color: 'red !important',
          fontSize: '10px',
          fontWeight: 700,
        },
        '.mantine-77cy5j:disabled+.__mantine-ref-icon': {
          color: '#339af0',
        },

        '.loaderback > div > div': {
          background: '#FFDD83',
        },

        'a#no-renderer-download': {
          display: 'none',
        },
        'div#pdf-controls': {
          display: 'none !important',
        },
        'div#header-bar': {
          display: 'none',
        },
        'div#no-renderer': {
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          alignItem: 'center',
          height: '100vh',
        },
        '.priceOfcourse': {
          // border:"1px? red",
          // transform:"translateX(-22px)"
        },
        '.splashtextAndLogo >span >img': {
          height: '100vh !important',
          // border: '20px solid red !important',\
        },
        '.nextStepNext >span >img': {
          height: '100vh !important',
          // border: '20px solid red !important',\
        },
        '.PageInfo': {
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          height: '100vh',
          alignItem: 'center',
        },
        '.splashText': {
          position: 'absolute',
          bottom: '200px',
        },
        '.splashInfo': {
          width: '100%',
        },

        '.resetInput >div >div >div >input': {
          color: 'black',
        },
        '.reportcardRadio >div >input': {
          borderColor: theme.colorScheme === 'dark' ? 'white !important' : 'black !important',
        },
        '.questions >div >div >div >input': {
          // border:"3rem solid red",
          borderColor: theme.colorScheme === 'dark' ? 'white' : 'black',
        },

        '.zipAndRarText': {
          margin: '2rem 0',
          fontWeight: 'bolder',
          textAlign: 'center',
        },
        '.forgotpassword': {
          textAlign: 'center',
          fontSize: '2rem',
          // fontWeight:"bolder"
        },
        '.Sub_forgotpassword': {
          textAlign: 'center',
          fontSize: '1.5rem',
        },
        '@media (min-width:800px)': {
          '.mantine-bkxd9d': {
            height: 'unset',
          },
          '.PhoneInput >div >div >div >div >div + input': {
            height: 'unset !important',
          },
        },
        '@media (min-width:600px) && (max-width: 900px)': {
          '.amountText': {
            paddingLeft: '0rem',
          },
        },
        '@media (min-width: 600px)': {
          '.paymentMethod': {
            padding: '1rem',
          },
        },

        '@media (max-width: 600px)': {
          '.paymentAndSummary': {
            width: '90%',
            // padding: '0rem 2rem 0 1rem',
          },

          '.amountText': {
            paddingLeft: '0rem',
          },
          '.paymentMethod': {
            padding: '0 0',
            sm: '1rem',
          },
          '.mantine-77cy5j:disabled+.__mantine-ref-icon': {
            color: 'red',
          },
          '.mantine-77cy5j:disabled': {
            borderColor: 'unset',
          },
          '.forgotpassword': {
            textAlign: 'center',
            fontSize: '1.4rem',
            // fontWeight:"bolder"
          },
          '.Sub_forgotpassword': {
            textAlign: 'center',
            fontSize: '1rem',
          },
        },
      })}
    />
  );
};
