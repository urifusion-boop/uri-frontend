import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/terms-and-conditions',
      permanent: false,
    },
  };
};

export default function LegalTermsRedirect() {
  return null;
}
