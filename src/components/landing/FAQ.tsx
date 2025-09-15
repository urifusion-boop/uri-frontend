import { Box, Link } from "@mui/material";
import React from "react";
import styles from "../../styles/landing.module.css";
import { IoMdClose } from "react-icons/io";

interface IProps {
  toggleFAQs: () => void;
}

const FAQ: React.FC<IProps> = ({ toggleFAQs }) => {
  return (
    <>
      <Box className={styles.overlay} onClick={() => toggleFAQs()}></Box>
      <Box className={styles.connectContainer}>
        <Box className={styles.infoContainer}>
          <Box sx={{ padding: "30px 30px" }}>
            <Box className="d-flex justify-between">
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
                  // translate: "0px 20px",
                  cursor: "pointer",
                }}
                onClick={() => toggleFAQs()}
              />
            </Box>

            <span className={styles.tancLine}>{`FAQs`}</span>

            <span className={styles.tancLine}>{`1. What is URI?`}</span>
            <span
              className={styles.tancLine}
            >{`URI is a platform that connects creative talents (models, hostess, actors etc) with clients and businesses looking for talent for their events, jobs or project.`}</span>

            <span
              className={styles.tancLine}
            >{`2. How can I sign up on URI?`}</span>
            <span
              className={styles.tancLine}
            >{`To sign up, click on the "Sign Up" button on the homepage. Choose whether you want to sign up as a creative or a client and follow the simple registration process.`}</span>

            <span className={styles.tancLine}>{`3. Is URI free to use?`}</span>
            <span
              className={styles.tancLine}
            >{`Yes, URI is free to use for both creatives and clients. However, there may be additional features or services that could have associated costs.`}</span>

            <span
              className={styles.tancLine}
            >{`4. How can creatives showcase their work on URI?`}</span>
            <span
              className={styles.tancLine}
            >{`Creatives can showcase their work by creating a profile. Upload portfolio images, highlight skills, and provide information that showcases your talents.`}</span>

            <span
              className={styles.tancLine}
            >{`5. Can clients post jobs for free?`}</span>
            <span
              className={styles.tancLine}
            >{`Yes, clients can post jobs for free on URI. Simply navigate to the "Post a Job" section and follow the prompts to create a job posting.`}</span>

            <span
              className={styles.tancLine}
            >{`6. How does the collaboration process work?`}</span>
            <span
              className={styles.tancLine}
            >{`Once a client posts a job, creatives can apply for the job by submitting their profiles. Clients review applications, communicate with creatives, and choose the best fit for their project.`}</span>

            <span
              className={styles.tancLine}
            >{`7. Is my information secure on URI?`}</span>
            <span
              className={styles.tancLine}
            >{`URI prioritizes the security and privacy of user information. We implement robust measures to ensure that your data is safe and protected.`}</span>

            <span
              className={styles.tancLine}
            >{`8. Can I edit my profile to change certain info after signing up?`}</span>
            <span
              className={styles.tancLine}
            >{`Yes, both creatives and clients can edit their profiles after signing up. Simply log in to your account and navigate to the profile section to make any necessary changes.`}</span>

            <span
              className={styles.tancLine}
            >{`9. How do reviews and ratings work on URI?`}</span>
            <span
              className={styles.tancLine}
            >{`After collaborating on a project, clients and creatives can leave reviews and ratings for each other. This feedback helps build a trustworthy community on URI.`}</span>

            <span
              className={styles.tancLine}
            >{`10. What types of creatives can I find on URI?`}</span>
            <span
              className={styles.tancLine}
            >{`URI hosts a diverse range of creatives, including models, hostess, actors, and more. Explore the platform to discover the right talent for your specific needs or what category matches your unique skills.`}</span>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FAQ;
