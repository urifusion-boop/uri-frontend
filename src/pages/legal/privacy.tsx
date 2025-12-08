import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/privacy-policy',
      permanent: false,
    },
  };
};

export default function LegalPrivacyRedirect() {
  return null;
}
