import '@/styles/flaticon.css';
import '@/styles/globals.css';
import '@fontsource/urbanist/400.css';
import '@fontsource/urbanist/500.css';
import '@fontsource/urbanist/600.css';
import '@fontsource/urbanist/700.css';
import '@fontsource/urbanist/800.css';
import 'nprogress/nprogress.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-image-crop/dist/ReactCrop.css';
import 'react-phone-number-input/style.css';
import 'react-responsive-modal/styles.css';
import 'swiper/css';

import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';

import ErrorFallback from '@/components/atoms/ErrorFallback';
import { LoadingProvider } from '@/components/atoms/LoadingContext';
import Toaster from '@/components/atoms/Toaster';
import SubscriptionModal from '@/components/modals/SubscriptionModal';
import { UriHttpClient } from '@/configs/http.config';
import { theme } from '@/configs/muitheme.config';
import { queryClient } from '@/configs/query-client.config';
import { WorkflowFilterProvider } from '@/contexts/WorkflowFilterContext';
import CustomThemeProvider from '@/providers/ThemeProvider';
import { ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { ErrorBoundary } from 'react-error-boundary';
import initServiceWorker from '../lib/initServiceWorker';
import { NotificationSoundProvider } from '../providers/NotificationProvider';

UriHttpClient.initialize();

const publicRoutes = [
  '/auth/login',
  '/auth/signup-as',
  '/auth/email-verification',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/password-reset-successful',
  '/auth/client-signup',
  '/auth/creative-signup',
  '/',
  '/how-it-works',
  '/admin/login-confirmation',
  '/privacy-policy',
  '/terms-and-conditions',
  '/delete-account',
  '/faqs',
  '/blog',
  '/pricing',
  '/agencies',
  '/startups',
  '/media-and-entertainment',
  '/product-teams',
  '/business-owners',
  '/dummy-dashboard',
];

const ProtectedRoutes = () => {
  const router = useRouter();
  const { isAuthenticated, logoutUser, isPending, userDetails } = useAuth();

  // pages/_app.js or any other component

  useEffect(() => {
    if (isPending) return;

    const pathIsProtected =
      !publicRoutes.includes(router.pathname) &&
      !router.pathname.startsWith('/faqs/') &&
      !router.pathname.startsWith('/blog/') &&
      !router.pathname.startsWith('/resources/') &&
      !router.pathname.startsWith('/company/') &&
      !router.pathname.startsWith('/tools/') &&
      !router.pathname.startsWith('/legal/');
    if (!isAuthenticated && pathIsProtected) {
      if (logoutUser) {
        logoutUser();
      }
    }
    // Note: Login page redirect is handled by login.hook.ts navigateUser function
    // to properly redirect to lastAccessedModule or primaryModule
  }, [router, router.route, isAuthenticated, logoutUser, isPending, userDetails]);

  return null;
};

export default function App({ Component, pageProps }: AppProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const router = useRouter();
  const { logoutUser, isPending } = useAuth();

  useEffect(() => {
    initServiceWorker();
  }, []);

  useEffect(() => {
    const handleUnauthorizedAccess = () => {
      if (logoutUser) {
        logoutUser();
      }
    };

    const handlePaymentRequired = () => {
      setShowSubscriptionModal(true);
    };

    window.addEventListener('unauthorized', handleUnauthorizedAccess);
    window.addEventListener('payment-required', handlePaymentRequired);

    NProgress.configure({ showSpinner: false });
    router.events.on('routeChangeStart', () => NProgress.start());
    router.events.on('routeChangeComplete', () => NProgress.done());
    router.events.on('routeChangeError', () => NProgress.done());

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorizedAccess);
      window.removeEventListener('payment-required', handlePaymentRequired);
      router.events.off('routeChangeStart', NProgress.start);
      router.events.off('routeChangeComplete', NProgress.done);
      router.events.off('routeChangeError', NProgress.done);
    };
  }, [router, logoutUser]);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {isPending && !publicRoutes.includes(router.pathname) ? (
          <AuthProvider>
            <LoadingProvider>
              <ProtectedRoutes />
            </LoadingProvider>
          </AuthProvider>
        ) : (
          <AuthProvider>
            <LoadingProvider>
              <ProtectedRoutes />
              <NotificationSoundProvider>
                <Toaster />
                <ReactQueryDevtools initialIsOpen={false} />
                <WorkflowFilterProvider>
                  <CustomThemeProvider>
                    <ThemeProvider theme={theme}>
                      {showSubscriptionModal && <SubscriptionModal />}
                      {/* <FeedbackModal /> */}
                      <Component {...pageProps} />
                    </ThemeProvider>
                  </CustomThemeProvider>
                </WorkflowFilterProvider>
              </NotificationSoundProvider>
            </LoadingProvider>
          </AuthProvider>
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
