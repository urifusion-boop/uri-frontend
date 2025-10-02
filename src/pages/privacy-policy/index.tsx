import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Container, Typography } from '@mui/material';
import { AlertTriangle, Bell, ChevronDown, FileText, Globe, Lock, Mail, Shield, Users } from 'lucide-react';
import { useState } from 'react';

export default function PrivacyPolicy() {
  const [expanded, setExpanded] = useState<string | false>('section1');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const sections = [
    {
      id: 'section1',
      icon: <FileText size={24} />,
      title: '1. Information We Collect',
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>1.1. Personal Information:</strong> We may collect personal information such as your name, email address, phone number, and payment details when you register on our App or Website,
            make purchases, or communicate with us.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>1.2. Usage Data:</strong> We collect information about your interactions with our App and Website, such as the pages visited, actions taken, and error logs.
          </Typography>
          <Typography variant="body1" sx={{ color: '#141416' }}>
            <strong>1.3. Device Information:</strong> We may collect information about the device you use to access our App, including device model, operating system version, unique device
            identifiers, and mobile network information.
          </Typography>
        </>
      ),
    },
    {
      id: 'section2',
      icon: <Users size={24} />,
      title: '2. How We Use Your Information',
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            We use the information we collect for the following purposes:
          </Typography>
          <Box sx={{ pl: 2 }}>
            {[
              'To provide and maintain our services to you',
              'To process your transactions and manage your account',
              'To improve our App and Website performance, functionality, and user experience',
              'To communicate with you, including responding to your inquiries and providing customer support',
              'To send you promotional offers, updates, and marketing communications that may be of interest to you, where permitted by law',
              'To detect, prevent, and address technical issues, fraud, or security concerns',
            ].map((item, idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: 1.5, color: '#141416', display: 'flex', alignItems: 'flex-start' }}>
                <Box component="span" sx={{ mr: 1, color: '#c91a79', fontWeight: 'bold' }}>
                  •
                </Box>
                {item}
              </Typography>
            ))}
          </Box>
        </>
      ),
    },
    {
      id: 'section3',
      icon: <Globe size={24} />,
      title: '3. Sharing of Your Information',
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            We may share your information in the following circumstances:
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>3.1. With Service Providers:</strong> Uri may share your information with trusted service providers who assist in operating our business and providing our services, including
            payment processors, cloud hosting providers, and customer support tools.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>3.2. With Third-Party Analytics and Advertising Partners:</strong> Uri may share non-personally identifiable information or aggregated data with analytics and advertising partners
            to analyze usage patterns and deliver targeted advertisements.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>3.3. When Required by Law or Legal Requests:</strong> Uri may disclose your information in response to valid legal requests, including subpoenas, court orders, or other legal
            processes.
          </Typography>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f5f7', borderRadius: 2, borderLeft: '4px solid #c91a79' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#141416' }}>
              3.4. Managing Access to Third-Party Accounts
            </Typography>
            <Typography variant="body2" sx={{ color: '#141416', fontSize: '0.95rem' }}>
              You can manage third-party app access through your account settings on Google, Meta (Facebook), TikTok, X (Twitter), and LinkedIn. Visit each platform&apos;s security settings to review
              and revoke permissions as needed.
            </Typography>
          </Box>
        </>
      ),
    },
    {
      id: 'section4',
      icon: <Globe size={24} />,
      title: '4. Data Transfers',
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            Uri may transfer your personal data to countries outside of Nigeria. When doing so, we ensure compliance with the Nigerian Data Protection Regulation (NDPR) requirements.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>4.1. Legal Basis:</strong> We only transfer data when there&apos;s a lawful basis, such as obtaining your explicit consent or implementing appropriate safeguards like Standard
            Contractual Clauses.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>4.2. Transparency and Notice:</strong> Prior to any transfer, we will inform you of the intended recipients, purpose, and legal basis for the transfer.
          </Typography>

          <Typography variant="body1" sx={{ color: '#141416' }}>
            <strong>4.3. Your Rights:</strong> You have the right to obtain a copy of any safeguards used for the transfer of your personal data outside Nigeria.
          </Typography>
        </>
      ),
    },
    {
      id: 'section5',
      icon: <Lock size={24} />,
      title: '5. Data Security',
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            We take the security of your personal information seriously and have implemented robust technical and organizational measures to protect it.
          </Typography>

          <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
            {[
              { title: 'Encryption', desc: 'Data transmission is encrypted using Secure Socket Layer (SSL) technology' },
              { title: 'Access Control', desc: 'Access is restricted to authorized personnel only' },
              { title: 'Data Hosting', desc: 'We host our services on Microsoft Azure with stringent security protocols' },
              { title: 'Monitoring', desc: 'Continuous monitoring and regular security audits' },
            ].map((item, idx) => (
              <Box key={idx} sx={{ p: 2, bgcolor: '#fffcfe', borderRadius: 2, border: '1px solid #d6ddeb80' }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#c91a79', mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#141416' }}>
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      ),
    },
    {
      id: 'section6',
      icon: <Shield size={24} />,
      title: '6. Your Choices and Rights',
      content: (
        <>
          <Box sx={{ pl: 2 }}>
            {[
              'You may access, update, or delete your personal information by contacting us directly',
              'You may opt-out of receiving marketing communications at any time',
              'Depending on your jurisdiction, you may have additional rights regarding your personal information',
            ].map((item, idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: 1.5, color: '#141416', display: 'flex', alignItems: 'flex-start' }}>
                <Box component="span" sx={{ mr: 1, color: '#c91a79', fontWeight: 'bold' }}>
                  •
                </Box>
                {item}
              </Typography>
            ))}
          </Box>
        </>
      ),
    },
    {
      id: 'section7',
      icon: <Bell size={24} />,
      title: '7. Changes to This Privacy Policy',
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            Uri reserves the right to update this Privacy Policy at any time. We encourage you to review it periodically.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>7.1. Notification Methods:</strong> We will notify you through email, push notifications, or prominent notices within our App/Website.
          </Typography>

          <Typography variant="body1" sx={{ color: '#141416' }}>
            <strong>7.2. Opt-out Option:</strong> If you disagree with changes, you may discontinue using our services and request deletion of your data.
          </Typography>
        </>
      ),
    },
    {
      id: 'section8',
      icon: <AlertTriangle size={24} />,
      title: '8. Data Breach Procedure',
      content: (
        <>
          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            Uri is committed to protecting your personal information. In the event of a data breach, we have established procedures in accordance with NDPR requirements.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>8.1. Detection:</strong> We maintain monitoring systems to detect unauthorized access or breaches.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>8.2. Investigation:</strong> Our incident response team will promptly investigate the scope and impact.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            <strong>8.3. Reporting:</strong> We will report breaches to the NDPRC and affected users within 72 hours of becoming aware.
          </Typography>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #fffbfd 0%, #f8f5f7 100%)',
          pt: 6,
          pb: 8,
          borderBottom: '1px solid #d6ddeb40',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Chip
              label="Last Updated: July 2024"
              sx={{
                bgcolor: '#c91a79',
                color: 'white',
                fontWeight: 500,
                mb: 3,
              }}
            />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontFamily: 'poorich, serif',
              fontSize: { xs: '36px', md: '48px' },
              fontWeight: 400,
              color: '#141416',
              textAlign: 'center',
              mb: 2,
            }}
          >
            Privacy Policy for Uri
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: '18px',
              color: '#141416',
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
            }}
          >
            UZURI CREATIVE LTD (Uri Creative) is committed to protecting the privacy and security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect
            your information.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 6 }}>
          {sections.map((section) => (
            <Accordion
              key={section.id}
              expanded={expanded === section.id}
              onChange={handleChange(section.id)}
              sx={{
                mb: 2,
                borderRadius: '8px !important',
                border: '1px solid #d6ddeb80',
                boxShadow: expanded === section.id ? '0 8px 24px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
                '&:before': { display: 'none' },
                transition: 'all 0.3s ease',
                bgcolor: '#fffcfe',
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown color="#c91a79" />}
                sx={{
                  py: 2,
                  '& .MuiAccordionSummary-content': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: expanded === section.id ? '#c91a79' : '#f8f5f7',
                    color: expanded === section.id ? 'white' : '#c91a79',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {section.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 600,
                    color: '#141416',
                  }}
                >
                  {section.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>{section.content}</AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Box
          sx={{
            mt: 6,
            p: 4,
            bgcolor: '#f8f5f7',
            borderRadius: 3,
            border: '1px solid #d6ddeb80',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: '#c91a79',
              color: 'white',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Mail size={32} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#141416' }}>
            Questions About Your Privacy?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#141416' }}>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
          </Typography>
          <a
            href="mailto:help@uricreative.com"
            style={{
              color: '#c91a79',
              fontSize: '18px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            help@uricreative.com
          </a>
        </Box>
      </Container>
    </Box>
  );
}
