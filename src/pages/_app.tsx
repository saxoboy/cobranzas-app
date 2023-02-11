import {
  QueryClient,
  QueryClientProvider,
  QueryOptions,
} from '@tanstack/react-query';
import { AppProps } from 'next/app';
import Router from 'next/router';
import nProgress from 'nprogress';
import { SWRConfig } from 'swr';

import '@/styles/globals.css';
import '@/styles/nprogress.css';

import axiosClient from '@/lib/axios';

import DismissableToast from '@/components/DismissableToast';
import Layout from '@/components/layout/Layout';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const defaultQueryFn = async ({ queryKey }: QueryOptions) => {
  const { data } = await axiosClient.get(`${queryKey?.[0]}`);
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <DismissableToast />
        <SWRConfig
          value={{
            fetcher: (url) => axiosClient.get(url).then((res) => res.data),
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </Layout>
    </QueryClientProvider>
  );
}

export default MyApp;
