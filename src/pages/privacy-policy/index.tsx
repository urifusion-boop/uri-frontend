import SeoHead from '@/components/atoms/SeoHead';
import Footer from '@/components/landing/Footer';
import Navigation from '@/components/Navigation';
import styles from '@/styles/landing.module.css';
import { Box, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { IoMdClose } from 'react-icons/io';

export default function PrivacyPolicy() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <SeoHead title="Privacy Policy" />

      <div className={styles.welcome}>
        <Navigation />
      </div>

      <>
        <Box className={styles.overlay}></Box>
        <Box className={`${styles.infoContainer} no-scroll`}>
          <Box sx={{ padding: '30px 30px' }}>
            <Box className="d-flex justify-between" sx={{ alignItems: 'center', mb: '10px' }}>
              <Link href={process.env.NEXT_PUBLIC_CLIENT_HOST}>
                <img src="/assets/images/logo.png" alt="logo" width={70} height={40} style={{ marginLeft: '-7px' }} />
              </Link>
              <IoMdClose
                style={{
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                }}
                onClick={handleClose}
              />
            </Box>

            <Typography variant="h5" gutterBottom>
              Privacy Policy
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={700}>
              Introduction
            </Typography>
            <Typography variant="body2" gutterBottom>
              This Privacy Policy describes how UZURI CREATIVE LTD ("Uri Creative", "we", "us", or "our") collects, uses, and protects your information when you use the Uri web and mobile applications
              (the "App"). By using the App, you agree to the practices described in this Policy.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Information We Collect
            </Typography>
            <Typography variant="body2" gutterBottom>
              We collect information you provide directly, such as account details (name, email, phone number), profile information, content you upload, and communications. We also collect information
              automatically, including device information, log data, usage analytics, cookies and similar technologies, and, where permitted, social account identifiers you choose to link.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              How We Use Information
            </Typography>
            <Typography variant="body2" gutterBottom>
              We use information to operate and improve the App, personalize experiences, provide customer support, process payments for subscriptions, enable integrations, enforce our Terms, and
              comply with legal obligations. Where required, we rely on your consent; otherwise, we use legitimate interests or contractual necessity as our legal bases.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Data Sharing and Transfers
            </Typography>
            <Typography variant="body2" gutterBottom>
              We do not sell your personal data. We may share information with trusted service providers (e.g., hosting, analytics, payments), only as necessary to perform services on our behalf and
              under appropriate confidentiality agreements. If information is transferred across borders, we use safeguards consistent with applicable laws.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Linked Accounts and Integrations
            </Typography>
            <Typography variant="body2" gutterBottom>
              If you choose to link external accounts (e.g., Google, Meta, TikTok, X, LinkedIn), we access only the scopes you authorize to provide features in the App. You can revoke access at any
              time via your external account settings.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Cookies and Tracking
            </Typography>
            <Typography variant="body2" gutterBottom>
              We use cookies and similar technologies to remember preferences, measure usage, and improve performance. You can control cookies through your browser settings; however, disabling certain
              cookies may affect functionality.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Data Retention
            </Typography>
            <Typography variant="body2" gutterBottom>
              We retain information for as long as necessary to provide the App, comply with legal obligations, resolve disputes, and enforce agreements. When no longer needed, we delete or anonymize
              data.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Your Rights
            </Typography>
            <Typography variant="body2" gutterBottom>
              Subject to applicable law, you may have rights to access, correct, delete, restrict, or object to our processing of your information, and to portability. You may also withdraw consent
              where processing is based on consent. To exercise rights, contact us using the details below.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Security
            </Typography>
            <Typography variant="body2" gutterBottom>
              We implement administrative, technical, and physical safeguards designed to protect your information. No method of transmission or storage is perfectly secure; we strive to protect your
              data but cannot guarantee absolute security.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Children’s Privacy
            </Typography>
            <Typography variant="body2" gutterBottom>
              The App is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we will take
              steps to delete it.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Changes to This Policy
            </Typography>
            <Typography variant="body2" gutterBottom>
              We may update this Privacy Policy from time to time. We will post the updated Policy in the App and update the effective date. Your continued use of the App after changes indicates
              acceptance.
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              Contact Us
            </Typography>
            <Typography variant="body2">
              For questions or requests regarding this Policy, contact us at{' '}
              <a href="mailto:help@uricreative.com" style={{ color: '#CD1B78' }}>
                help@uricreative.com
              </a>{' '}
              or{' '}
              <a href="mailto:hello@uri.africa" style={{ color: '#CD1B78' }}>
                hello@uri.africa
              </a>
              .
            </Typography>
          </Box>
        </Box>
      </>

      <Footer />
    </>
  );
}
