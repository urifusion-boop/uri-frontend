import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/DeletedAccount.module.css";
import CustomButton from "@/components/atoms/CustomButton";
import { useRouter } from "next/router";

const DeletedAccount: NextPage = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    // Redirect to home page
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Account Deleted</title>
        <meta name="description" content="Your account has been deleted." />
      </Head>

      <main className={styles.main}>
        <div className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={styles.checkmark}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4"
            />
          </svg>
        </div>
        <h1 className={styles.title}>Your account is deleted</h1>
        <p className={styles.description}>
          Thanks for using our product!
          <br />
          We look forward to seeing you again.
        </p>
        <CustomButton mode="primary" onClick={handleBackToHome}>
          Back to home
        </CustomButton>
      </main>
    </div>
  );
};

export default DeletedAccount;
