import { InstallmentsTab } from '@/components/invoices/installments-tab';
import { InvoicesTab } from '@/components/invoices/invoices-tab';
import { PayPendingInstallments } from '@/components/invoices/PayPendingInstallments';
import { Seo } from '@/components/seo';
import { TabsHeader } from '@/components/tabs/TabsHeader';
import { Skeletons } from '@/components/saved-cards/Skeletons';
import { PageHeader } from '@/components/ui/pageHeader';
import { Container, Modal, Space, Tabs, Group, Button, Text, Box } from '@mantine/core';
import { useRouter } from 'next/router';
import ar from '@/src/constants/locales/ar-kw/common.json';
import en from '@/src/constants/locales/en-us/common.json';
import { useState, useEffect } from 'react';
import axios from '@/components/axios/axios.js';
import { NoRecordFound } from '@/components/ui/no-record-found';
import { CartLoadingScreen } from '@/components/ui/cart-loader-screen';
import { LoadingScreen } from '@/components/ui/loader-screen';
import authMiddleware from '@/src/authMiddleware';
const Invoices = () => {
  // language
  const router = useRouter();
  const t = router.locale === 'ar-kw' ? ar : en;
  // language
  const { id, success, message } = router.query;
  var decodedMessage = decodeURI(message + '');
  const [activeTab, setActiveTab] = useState(success == undefined && success == null ? 0 : 1);
  const [getPendingData, setGetPendingData] = useState([]);
  const [screenLoader, setScreenLoader] = useState(true);
  const [showapiMessages, setShowApiMessages] = useState(true);
  // const { card, success, id, message } = router.query;
  console.log('message of the success', success, message);

  useEffect(() => {
    if (success !== undefined && success == '0') {
      setActiveTab(0);
    } else if (success !== undefined && success == '1') {
      setActiveTab(1);
    }
  }, []);
  const test = async () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: '/pending/instalments',
    };

    axios
      .request(config)
      .then((response) => {
        setGetPendingData(response?.data?.installments);
        setScreenLoader(false);
      })
      .catch((error) => {
        setScreenLoader(false);
        console.log(error);
      });
  };
  useEffect(() => {
    test();
  }, []);
  useEffect(() => {
    setScreenLoader(true);
  }, []);

  console.log('getPendingData', getPendingData);
  return (
    <div>
      {success == '0' || success == '1' ? (
        <Modal
          opened={showapiMessages}
          onClose={() => setShowApiMessages(false)}
          withCloseButton={false}
          className="showMessage"
        >
          {success !== undefined && success == '0' ? (
            <>
              <Text>{message && message}</Text>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Button
                  id="btn-invoiceModalDone"
                  style={{
                    background: 'red',
                    marginTop: '2rem',
                  }}
                  onClick={() => setShowApiMessages(false)}
                >
                  <Text
                    sx={{
                      color: 'white',
                    }}
                  >
                    Done
                  </Text>
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Text>{message && message}</Text>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Button
                  id="btn-invoiceModalDone"
                  style={{
                    marginTop: '2rem',
                  }}
                  onClick={() => setShowApiMessages(false)}
                >
                  <Text
                    sx={{
                      color: 'black',
                    }}
                  >
                    Done
                  </Text>
                </Button>
              </Box>
            </>
          )}
        </Modal>
      ) : (
        ''
      )}

      <Seo title="Invoices" description="Invoices" path="/user/invoices" />
      <main
        style={
          {
            // border:"1px solid red",
            // overflow:"hidden"
          }
        }
      >
        <PageHeader title={id ? `${t.invoice.pay_installment}` : `${t.invoice.title}`} />
        {id ? (
          <div
            style={{
              height: '100vh',
            }}
          >
            <PayPendingInstallments />
          </div>
        ) : (
          <Container>
            <Tabs
              active={activeTab}
              onTabChange={setActiveTab}
              variant="unstyled"
              styles={(theme) => ({
                tabControl: {
                  backgroundColor: '#F7F6F5',
                  color: theme.colors.gray[9],
                  fontSize: theme.fontSizes.sm,
                  borderRadius: 20,
                  flexGrow: 1,
                  height: 32,
                  whiteSpace: 'nowrap',
                },
                tabsList: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(50px,1fr))',
                  width: '100%',
                  //padding: '0px 0px 10px 0px',
                  borderRadius: 20,
                  backgroundColor: '#F7F6F5',
                },
                tabActive: {
                  backgroundColor: '#FFDD83',
                  color: '#000',
                },
              })}
            >
              <Tabs.Tab
                id="tab-pendingInstallments"
                label={t.invoice['pending-installments']}
                tabKey="installments"
                tabIndex={1}
                sx={{
                  whiteSpace: 'break-spaces',

                  overflow: 'none',
                }}
              >
                <Space h={15} />

                <InstallmentsTab />
              </Tabs.Tab>
              <Tabs.Tab id="tab-invoices" label={t.invoice.invoices} tabKey="invoices" tabIndex={2}>
                <Space h={15} />

                <InvoicesTab />
              </Tabs.Tab>
            </Tabs>
            <Space h={90} />
          </Container>
        )}
      </main>
    </div>
  );
};
export default authMiddleware(Invoices);
