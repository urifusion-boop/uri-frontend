import SeoHead from '@/components/atoms/SeoHead';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import TAndC from '@/components/landing/TAndC';
import { LightThemeColors } from '@/configs/colors.config';
import useCustomTheme from '@/hooks/theme.hook';
import styles from '@/styles/landing.module.css';
import { Box, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

export default function PrivacyPolicy() {
  const [showTAndC, setShowTAndC] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  const { themeColors } = useCustomTheme();
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <SeoHead title="Terms and Conditions" />

      <div className={styles.welcome}>
        <Header />
      </div>

      <>
        <Box className={styles.overlay} onClick={() => setShowTAndC(showTAndC)}></Box>
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
              Terms and Conditions
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={700}>
              Introduction
            </Typography>
            <Typography variant="body2" gutterBottom>
              Welcome to UZURI CREATIVE LTD (Uri Creative), the premier platform connecting local and global businesses with talented African creatives. These Terms and Conditions (&quot;Terms&quot;)
              govern your use of the Uri mobile application (&quot;App&quot;). By downloading, installing, or using the App, you agree to comply with these Terms. If you do not agree with these Terms,
              please do not use the App.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              1. Definitions
            </Typography>
            <Typography variant="body2">- &quot;Uri,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot; refers to Uri Creative, the provider of the App.</Typography>
            <Typography variant="body2">- &quot;User,&quot; &quot;you,&quot; or &quot;your&quot; refers to any person or entity using the App.</Typography>
            <Typography variant="body2">- &quot;Content&quot; refers to all text, images, audio, video, and other material available on the App.</Typography>
            <Typography variant="body2">
              - &quot;Services&quot; refers to the functionalities provided through the App, including job postings, user profiles, messaging, and other related services.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              2. Eligibility
            </Typography>
            <Typography variant="body2">
              You must be at least 18 years old to use the App. By using the App, you represent and warrant that you meet this age requirement. We may request proof of age and other information to
              verify your eligibility.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              3. Account Registration
            </Typography>
            <Typography variant="body2">To access certain features of the App, you may be required to create an account. You agree to:</Typography>
            <Typography variant="body2">- Provide accurate, current, and complete information during the registration process.</Typography>
            <Typography variant="body2">- Maintain the security of your account by safeguarding your password and restricting access to your account.</Typography>
            <Typography variant="body2">- Notify us immediately of any unauthorized use of your account.</Typography>
            <Typography variant="body2">- We highly recommend enabling two-factor authentication to further secure your account.</Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              4. Use of the App
            </Typography>
            <Typography variant="body2">You agree to use the App only for lawful purposes and in accordance with these Terms. Prohibited uses include, but are not limited to:</Typography>
            <Typography variant="body2">- Engaging in any conduct that is harmful, fraudulent, deceptive, or illegal.</Typography>
            <Typography variant="body2">- Posting any Content that is offensive, defamatory, obscene, or otherwise objectionable.</Typography>
            <Typography variant="body2">- Attempting to interfere with the App`s operation or security.</Typography>
            <Typography variant="body2">- Spamming, harassment, posting false information, or conducting unauthorized commercial activities.</Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              5. User Content
            </Typography>
            <Typography variant="body2">
              You retain ownership of any Content you submit, post, or display on the App. By submitting Content, you grant Uri a non-exclusive, worldwide, royalty-free license to use, reproduce,
              modify, and display your Content in connection with the App. However, you are solely responsible for the Content you provide and any consequences arising from your Content.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              6. Intellectual Property
            </Typography>
            <Typography variant="body2">
              All intellectual property rights in the App, including but not limited to software, design, and Content, are owned by Uri or its licensors. You may not use, copy, modify, or distribute
              any part of the App without prior written consent from Uri. Any violation of these intellectual property rights may result in immediate termination of your account and legal action.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              7. Privacy
            </Typography>
            <Typography variant="body2">
              Your use of the App is also governed by our Privacy Policy, which explains how we collect, use, and disclose your information. By using the App, you consent to our data practices as
              described in the Privacy Policy.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              8. Subscription and Payments
            </Typography>
            <Typography variant="body2">
              Certain features of the App may require payment of fees. You agree to pay all applicable fees and charges associated with your use of the App. All fees are non-refundable except as
              required by law or as explicitly stated by us.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              9. Termination
            </Typography>
            <Typography variant="body2">
              We reserve the right to terminate or suspend your account and access to the App at our sole discretion, without notice or liability, for any reason, including but not limited to:
              violation of these Terms, fraudulent activity, or harmful behavior.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              10. Disclaimers
            </Typography>
            <Typography variant="body2">
              The App is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. We do not warrant that the App will be uninterrupted, error-free, or free of viruses or other harmful
              components. Your use of the App is at your own risk. We do not warrant that any defects in the App will be corrected.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              11. Limitation of Liability
            </Typography>
            <Typography variant="body2">
              To the fullest extent permitted by law, Uri shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the App.
              Our total liability to you for any damages shall not exceed the amount you paid to use the App.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              12. Indemnification
            </Typography>
            <Typography variant="body2">
              You agree to indemnify and hold Uri harmless from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of the App or your violation of
              these Terms.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              13. Third-Party Account Access
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              i. Google Account Integration:
            </Typography>
            <Typography variant="body2" gutterBottom>
              By linking your Google Account with the Uri mobile application, you allow Uri to access certain information from your Google Account. You can manage and revoke access by navigating to
              your Google Account settings, selecting &quot;Security,&quot; and then reviewing and managing third-party app access under the &quot;Third-party apps with account access&quot; section.
              For more information, please refer to Google`s help article:
              <Link href="https://support.google.com/accounts/answer/3466521" target="_blank" rel="noopener noreferrer" style={{ color: themeColors.primary }}>
                {' '}
                How Google helps you share data safely
              </Link>
              .
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              ii. Meta (Facebook) Account Integration:
            </Typography>
            <Typography variant="body2" gutterBottom>
              By linking your Meta (Facebook) Account with the Uri mobile application, you allow Uri to access certain information from your Facebook account. You can manage and revoke access by
              navigating to your Facebook settings, selecting &quot;Security and Login,&quot; and then reviewing and managing third-party app access under the &quot;Apps and Websites&quot; section.
              For more information, please refer to Meta`s help article:
              <Link href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" style={{ color: themeColors.primary }}>
                {' '}
                How Meta helps you share data safely
              </Link>
              .
            </Typography>

            <Typography variant="body2" fontWeight={500}>
              iii. TikTok Account Integration:
            </Typography>
            <Typography variant="body2" gutterBottom>
              By linking your TikTok Account with the Uri mobile application, you allow Uri to access certain information from your TikTok account. You can manage access by navigating to your TikTok
              app. In the TikTok app, tap &quot;Profile&quot; at the bottom. Tap the &quot;Menu&quot; ☰ button at the top. Tap &quot;Settings and privacy.&quot; Tap &quot;Security.&quot;, Tap
              &quot;Manage app permissions.&quot; For more information, please refer to TikTok`s help article:{' '}
              <Link
                href="https://support.tiktok.com/en/safety-hc/account-and-user-safety/connect-to-third-party-apps"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: LightThemeColors.primary }}
              >
                {' '}
                How to manage your TikTok account with uricreatve.
              </Link>{' '}
              How TikTok helps you share data safely:{' '}
              <Link href="https://www.tiktok.com/legal/page/eea/terms-of-service/en" target="_blank" rel="noopener noreferrer" style={{ color: LightThemeColors.primary }}>
                How TikTok helps you share data safely
              </Link>
              .
            </Typography>

            <Typography variant="body2" fontWeight={500}>
              iv. X (formerly Twitter) Account Integration:
            </Typography>
            <Typography variant="body2" gutterBottom>
              By linking your X (formerly Twitter) Account with the Uri mobile application, you allow Uri to access certain information from your X account. This access may include basic profile
              information, tweet data, and account interactions, which Uri may use to enhance your experience on the App. You can manage and revoke this access by navigating to your X account
              settings. To do this, tap on your profile icon, select &quot;Settings and Support,&quot; then &quot;Settings and Privacy,&quot; and go to &quot;Security and account access.&quot; Under
              the &quot;Apps and sessions&quot; section, review and manage third-party app access. For more information, please refer to X’s help article on how to manage third-party apps and
              permissions:
              <Link
                href="https://help.twitter.com/en/managing-your-account/connect-or-revoke-access-to-third-party-apps"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: LightThemeColors.primary }}
              >
                How X helps you share data safely.
              </Link>
            </Typography>

            <Typography variant="body2" fontWeight={500}>
              v.LinkedIn Account Integration:
            </Typography>
            <Typography variant="body2" gutterBottom>
              By linking your LinkedIn Account with the Uri mobile application, you allow Uri to access certain information from your LinkedIn profile. This may include your public profile data, work
              experience, education, and network connections. Uri may use this information to enhance your user experience, such as by suggesting relevant job opportunities or networking connections
              within the App. You can manage and revoke access by navigating to your LinkedIn account settings. To do this, click on your profile icon, go to &quot;Settings & Privacy,&quot; then
              select &quot;Data privacy&quot; and choose &quot;Other applications.&quot; Here, you can review and manage third-party app access. For more information, please refer to LinkedIn’s help
              article on managing third-party apps:
              <Link href="https://www.linkedin.com/legal/l/service-terms" target="_blank" rel="noopener noreferrer" style={{ color: LightThemeColors.primary }}>
                How Linkedin helps you share data safely.
              </Link>
            </Typography>

            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              14. Changes to Terms
            </Typography>
            <Typography variant="body2">
              We may update these Terms from time to time. Any changes will be posted on the App and, where appropriate, notified to you by email. Your continued use of the App after such changes have
              been posted constitutes your acceptance of the new Terms.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              15. Governing Law
            </Typography>
            <Typography variant="body2">
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law principles.
            </Typography>
            <Typography variant="body1" gutterBottom fontWeight={600} mt={2}>
              16. Contact Us
            </Typography>
            <Typography variant="body2">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:help@uricreative.com" style={{ color: themeColors.primary }}>
                help@uricreative.com
              </a>
              .
            </Typography>
          </Box>
        </Box>
      </>

      <Footer />

      {showTAndC ? <TAndC toggleTAndC={() => setShowTAndC(!showTAndC)} /> : null}
      {showFAQs ? <FAQ /> : null}
    </>
  );
}
