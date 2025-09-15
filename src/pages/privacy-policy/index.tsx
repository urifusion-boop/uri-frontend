import { useState } from "react";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import TAndC from "@/components/landing/TAndC";
import styles from "@/styles/landing.module.css";
import FAQ from "@/components/landing/FAQ";
import SeoHead from "@/components/atoms/SeoHead";
import { Box, Link, Typography } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/router";
import { LightThemeColors } from "@/configs/colors.config";

interface IProps {
  togglePandPs: () => void;
}

export default function PrivacyPolicy({ togglePandPs }: IProps) {
  const [showTAndC, setShowTAndC] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    router.back();
    togglePandPs();
  };

  return (
    <>
      <SeoHead title="Privacy Policy" />

      <div className={styles.welcome}>
        <Header />
      </div>

      <>
        <Box className={styles.overlay} onClick={() => togglePandPs()}></Box>
        <Box className={`${styles.infoContainer} no-scroll`}>
          <Box sx={{ padding: "30px 30px" }}>
            <Box
              className="d-flex justify-between"
              sx={{ alignItems: "center", mb: "10px" }}
            >
              <Link href={process.env.NEXT_PUBLIC_CLIENT_HOST}>
                <img
                  src="/assets/images/logo.png"
                  alt="logo"
                  width={70}
                  height={40}
                  style={{ marginLeft: "-7px" }}
                />
              </Link>
              <IoMdClose
                style={{
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                }}
                onClick={handleClose}
              />
            </Box>
            <Box>
              <Typography variant="h5" gutterBottom>
                Privacy Policy for Uri
              </Typography>
              <Typography
                color="#000"
                variant="body1"
                gutterBottom
                fontWeight={600}
              >
                Effective Date: July 2024
              </Typography>
              <Typography color="#000" variant="body1" gutterBottom>
                UZURI CREATIVE LTD (Uri Creative), (&quot;we&quot;,
                &quot;us&quot;, &quot;our&quot;) is committed to protecting the
                privacy and security of your personal information. This Privacy
                Policy outlines how we collect, use, disclose, and protect your
                information when you use our mobile application
                (&quot;App&quot;) and website (&quot;Website&quot;).
              </Typography>
              <Typography
                color="#000"
                variant="body1"
                gutterBottom
                fontWeight={500}
                mt={2}
              >
                <strong> 1. Information We Collect</strong>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                1.1. Personal Information: We may collect personal information
                such as your name, email address, phone number, and payment
                details when you register on our App or Website, make purchases,
                or communicate with us.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                1.2. Usage Data: We collect information about your interactions
                with our App and Website, such as the pages visited, actions
                taken, and error logs.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                1.3. Device Information: We may collect information about the
                device you use to access our App, including device model,
                operating system version, unique device identifiers, and mobile
                network information.
              </Typography>
              <Typography
                color="#000"
                variant="body1"
                gutterBottom
                fontWeight={400}
                mt={2}
              >
                <strong>2. How We Use Your Information</strong>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                We use the information we collect for the following purposes:
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - To provide and maintain our services to you.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - To process your transactions and manage your account.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - To improve our App and Website performance, functionality, and
                user experience.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - To communicate with you, including responding to your
                inquiries and providing customer support.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - To send you promotional offers, updates, and marketing
                communications that may be of interest to you, where permitted
                by law.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - To detect, prevent, and address technical issues, fraud, or
                security concerns.
              </Typography>
              <Typography
                color="#000"
                variant="body1"
                gutterBottom
                fontWeight={500}
                mt={2}
              >
                <strong> 3. Sharing of Your Information</strong>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                We may share your information in the following circumstances:
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                3.1. With Service Providers:Uri may share your information with
                trusted service providers who assist in operating our business
                and providing our services. This includes:
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Payment Processors: Companies that process payments on our
                behalf when you make purchases through our App or Website.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Cloud Hosting Providers: Services that host our App and store
                data securely to ensure reliable performance and scalability.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Customer Support Tools: Platforms used to manage and respond
                to customer inquiries and support requests effectively.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>
                  3.2. With Third-Party Analytics and Advertising Partners:
                </strong>{" "}
                Uri may share non-personally identifiable information or
                aggregated data with analytics and advertising partners to:
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Analyze Usage Patterns: Understand how users interact with our
                App and Website to improve our services and user experience.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Deliver Targeted Advertisements: Serve advertisements that may
                be of interest to you based on your usage patterns, preferences,
                and demographic information. These partners may use tracking
                technologies like cookies to collect data for advertising
                purposes.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>3.3. When Required by Law or Legal Requests:</strong>{" "}
                Uri may disclose your information in response to valid legal
                requests, including subpoenas, court orders, or other legal
                processes. We may also share information if necessary to:
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Comply with Applicable Laws: To comply with applicable laws,
                regulations, or legal obligations.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Protect Rights and Safety: To protect the rights, property, or
                safety of Uri, our users, or others, as required or permitted by
                law.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>3.4. Managing Access to Third-Party Accounts:</strong>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>i. Google Account Management:</strong> Users can manage
                access to their Google Account by navigating to their Google
                Account settings, selecting &quot;Security,&quot; and then
                reviewing and managing third-party app access under the
                &quot;Third-party apps with account access&quot; section.
                <Typography>
                  You can refer to this Google article:
                  <Link
                    href="https://support.google.com/accounts/answer/3466521"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: LightThemeColors.primary }}
                  >
                    {" "}
                    How Google helps you share data safely
                  </Link>
                  .
                </Typography>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>ii. Meta (Facebook) Account Management:</strong> Users
                can manage access to their Meta (Facebook) Account by navigating
                to their Facebook settings, selecting &quot;Security and
                Login,&quot; and then reviewing and managing third-party app
                access under the &quot;Apps and Websites&quot; section.
                <Typography color="#000" variant="body1" mb={2}>
                  You can refer to this Meta article:
                  <Link
                    href="https://www.facebook.com/privacy/policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: LightThemeColors.primary }}
                  >
                    {" "}
                    How Meta helps you share data safely{" "}
                  </Link>
                  .
                </Typography>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>iii. TikTok Account Management:</strong> You can review
                which third-party apps you&apos;ve connected to with TikTok and
                remove uricreative app in your settings. You should review apps
                that you&apos;ve connected to regularly and remove any that you
                no longer use. To view and remove a connected third-party
                app&apos;s permissions: 1. In the TikTok app, tap
                &quot;Profile&quot; at the bottom. 2. Tap the &quot;Menu&quot; ☰
                button at the top. 3. Tap &quot;Settings and privacy.&quot; 4.
                Tap &quot;Security.&quot; 5. Tap &quot;Manage app
                permissions.&quot; 6. Tap the app you&apos;d like to review.
                From here, you can: ༚ View what the uricreative has permissions
                to (for example: Access your profile info). ༚ Tap &quot;Remove
                access&quot; to remove the app if you no longer want access.
                <Typography color="#000" variant="body1" mb={2}>
                  You can refer to this TikTok article:{" "}
                  <Link
                    href="https://support.tiktok.com/en/safety-hc/account-and-user-safety/connect-to-third-party-apps"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: LightThemeColors.primary }}
                  >
                    How to manage your TikTok account with uricreatve.
                  </Link>
                </Typography>
                See how TikTok manages your privacy:{" "}
                <Link
                  href="https://www.tiktok.com/legal/page/eea/privacy-policy/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: LightThemeColors.primary }}
                >
                  How TikTok helps you share data safely
                </Link>
                .
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>iv. X (Twitter) Account Management:</strong> Users can
                manage access to their X Account by navigating to their X
                settings, selecting &quot;Security and Account Access,&quot; and
                then reviewing and managing third-party app access under the
                &quot;Connected Apps&quot; section.
                <Typography>
                  You can refer to this X article:
                  <Link
                    href="https://x.com/en/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: LightThemeColors.primary }}
                  >
                    {" "}
                    How X helps you share data safely.
                  </Link>
                  .
                </Typography>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>v. LinkedIn Account Management:</strong> Users can
                manage access to their LinkedIn Account by navigating to their
                LinkedIn settings, selecting &quot;Data Privacy&quot; and then
                reviewing and managing third-party app access under the
                &quot;Permitted Services&quot; section.
                <Typography>
                  You can refer to this LinkedIn article:
                  <Link
                    href="https://support.google.com/accounts/answer/3466521"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: LightThemeColors.primary }}
                  >
                    {" "}
                    How LinkedIn helps you manage your data safely.
                  </Link>
                </Typography>
              </Typography>

              <Typography
                color="#000"
                variant="body1"
                gutterBottom
                fontWeight={500}
                mb={2}
              >
                <strong>4. Data Transfers</strong>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                Uri (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) may
                transfer your personal data to countries outside of Nigeria,
                including to our service providers and partners located in other
                jurisdictions. When transferring personal data outside Nigeria,
                we ensure compliance with the Nigerian Data Protection
                Regulation (NDPR) requirements for data export and protection.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>4.1. Legal Basis for Data Transfers:</strong> We will
                only transfer your personal data outside Nigeria when there is a
                lawful basis to do so under the NDPR, such as:
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Obtaining your explicit consent for the transfer.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Implementing appropriate safeguards, such as Standard
                Contractual Clauses (SCCs), Binding Corporate Rules (BCRs), or
                other mechanisms approved by the NDPRC, to ensure an adequate
                level of data protection.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - When the transfer is necessary for the performance of a
                contract between you and Uri, or for the implementation of
                pre-contractual measures taken at your request.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>4.2. Transparency and Notice:</strong> Prior to any
                transfer of your personal data outside Nigeria, we will inform
                you of the intended recipients, the purpose of the transfer, and
                the legal basis for the transfer, unless otherwise prohibited by
                law.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>4.3. Data Protection Measures:</strong> We will ensure
                that any transfer of your personal data outside Nigeria is
                conducted in a manner that maintains its confidentiality,
                integrity, and security, consistent with NDPR requirements.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>4.4. Your Rights:</strong> You have the right to obtain
                a copy of any safeguards used for the transfer of your personal
                data outside Nigeria. You may contact us as described in the
                &quot;Contact Us&quot; section below for more information.
              </Typography>
              <Typography
                color="#000"
                variant="body1"
                gutterBottom
                fontWeight={500}
                mb={2}
              >
                <strong> 5. Data Security</strong>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                We take the security of your personal information seriously and
                have implemented robust technical and organizational measures to
                protect it from unauthorized access, use, disclosure,
                alteration, or destruction. Our security measures include, but
                are not limited to:
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>5.1. Encryption:</strong> Data transmission between your
                device and our servers is encrypted using Secure Socket Layer
                (SSL) technology.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>5.2. Access Control:</strong> Access to your personal
                information is restricted to authorized personnel only, who are
                required to maintain the confidentiality of such information.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>5.3. Data Hosting:</strong> We host our services on
                Microsoft Azure, a leading cloud platform known for its
                stringent security protocols and compliance certifications.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>5.4. Monitoring and Auditing:</strong> We continuously
                monitor our systems for vulnerabilities and undertake regular
                security audits to ensure compliance with industry standards.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                While these measures reduce the risk of security incidents, it’s
                important to note that no method of transmission over the
                internet or electronic storage is completely secure. However, by
                hosting on Microsoft Azure, we benefit from their advanced
                security infrastructure to enhance the protection of your data.
              </Typography>
              <Typography
                color="#000"
                variant="body1"
                gutterBottom
                fontWeight={500}
                mb={2}
              >
                <strong>6. Your Choices and Rights</strong>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - You may access, update, or delete your personal information by
                contacting us directly.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - You may opt-out of receiving marketing communications from us
                at any time by following the unsubscribe instructions included
                in our emails or by contacting us.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Depending on your jurisdiction, you may have additional rights
                regarding your personal information, such as the right to
                access, rectify, or erase your data.
              </Typography>
              <Typography
                color="#000"
                variant="body1"
                gutterBottom
                fontWeight={500}
                mb={2}
              >
                <strong>7. Changes to This Privacy Policy</strong>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                Uri (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) reserves
                the right to update or modify this Privacy Policy at any time to
                reflect changes in our practices, legal requirements, or
                advancements in how we handle personal information. We encourage
                you to review this Privacy Policy periodically to stay informed
                about how we are protecting your information.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>7.1 Notification of Changes:</strong>
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>7.1.1. Notification Methods:</strong> When we make
                material changes to this Privacy Policy, we will notify you
                through one or more of the following methods:
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Direct Notification: We may send you an email or push
                notification informing you of the changes.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Website or App Notification: We may display a prominent notice
                within our App or Website to alert you to the updated Privacy
                Policy.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                - Effective Date Update: We will update the effective date at
                the top of this Privacy Policy to reflect the date of the most
                recent changes.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>7.1.2. Reviewing Changes:</strong> Upon notification of
                changes, it is important that you review the updated Privacy
                Policy to understand how the changes affect you. By continuing
                to use our services after the effective date of the updated
                Privacy Policy, you agree to the revised terms.
              </Typography>
              <Typography color="#000" variant="body1" mb={2}>
                <strong>7.1.3. Opt-out Option:</strong> If you do not agree with
                any changes made to this Privacy Policy, you may choose to
                discontinue the use of our services and request the deletion of
                your personal information as outlined in Section 6 (&quot;Your
                Choices and Rights&quot;).
              </Typography>
              <Typography
                color="#000"
                variant="body1"
                gutterBottom
                fontWeight={500}
                mt={2}
              >
                <strong> 8. Data Breach Procedure</strong>
              </Typography>
              <Typography color="#000" variant="body1">
                Uri (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is
                committed to protecting your personal information. In the event
                of a data breach that compromises your personal data, we have
                established procedures to detect, investigate, and report such
                incidents in accordance with Nigerian Data Protection Regulation
                (NDPR) requirements.
              </Typography>
              <Typography color="#000" variant="body1" mt={1}>
                <strong>8.1. Detection of Data Breaches:</strong> We maintain
                monitoring systems and conduct regular security assessments to
                detect any unauthorized access, breaches, or anomalies in our
                data processing activities.
              </Typography>
              <Typography color="#000" variant="body1" mt={1}>
                <strong>8.2. Investigation of Data Breaches:</strong> Upon
                detection of a data breach, our incident response team will
                promptly initiate an investigation to determine the scope and
                impact of the breach. The investigation will include identifying
                affected individuals, assessing the potential risks to their
                rights and freedoms, and identifying the root cause of the
                breach.
              </Typography>
              <Typography color="#000" variant="body1" mt={1}>
                <strong>8.3. Reporting Data Breaches:</strong>
              </Typography>
              <Typography color="#000" variant="body1">
                If a data breach is confirmed to pose a risk to your rights and
                freedoms, we will report the breach to the Nigerian Data
                Protection Regulation Commission (NDPRC) and affected users
                without undue delay.
              </Typography>
              <Typography color="#000" variant="body1">
                Notification to affected users will include:
              </Typography>
              <Typography color="#000" variant="body1">
                - Description of the nature of the breach.
              </Typography>
              <Typography color="#000" variant="body1">
                - Types of personal data affected.
              </Typography>
              <Typography color="#000" variant="body1">
                - Recommended measures for users to mitigate potential adverse
                effects.
              </Typography>
              <Typography color="#000" variant="body1" mt={1}>
                <strong>8.4. Stipulated Time frames:</strong> We will report
                data breaches to the NDPRC and affected users within 72 hours of
                becoming aware of the breach, as required by NDPR guidelines,
                unless we can demonstrate that the breach is unlikely to result
                in a risk to your rights and freedoms.
              </Typography>
              <Typography color="#000" variant="body1" mt={1}>
                <strong>8.5. Contact Us:</strong> If you have any questions or
                concerns about this Privacy Policy or our data practices, please
                contact us at{" "}
                <a
                  href="mailto:help@uricreative.com"
                  style={{ color: " rgb(201, 26, 121)" }}
                >
                  help@uricreative.com
                </a>
                .
              </Typography>
            </Box>
          </Box>
        </Box>
      </>

      <Footer
        toggleTAndC={() => setShowTAndC(!showTAndC)}
        toggleFAQs={() => setShowFAQs(!showFAQs)}
      />

      {showTAndC ? (
        <TAndC toggleTAndC={() => setShowTAndC(!showTAndC)} />
      ) : null}
      {showFAQs ? <FAQ toggleFAQs={() => setShowFAQs(!showFAQs)} /> : null}
    </>
  );
}
