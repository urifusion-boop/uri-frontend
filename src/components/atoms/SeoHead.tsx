import Head from "next/head";

interface IProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  title?: string;
}

const SeoHead: React.FC<IProps> = ({ title }) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>
        Uri -{" "}
        {title ??
          "AI-Powered Social Insights, Content Management, and Growth Tools Trusted by Top Brands"}
      </title>
      <meta name="description" content="Uri Website" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="icon" href="/logo.ico" />
      <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/icons/touch-icon-ipad.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/icons/touch-icon-iphone-retina.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="167x167"
        href="/icons/touch-icon-ipad-retina.png"
      />
      <link rel="manifest" href="/manifest.json" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://uricreative.com" />
      <meta
        name="twitter:title"
        content="Uri - AI-Powered Social Insights, Content Management, and Growth Tools Trusted by Top Brands"
      />
      <meta
        name="twitter:description"
        content="Uri - AI-Powered Social Insights, Content Management, and Growth Tools Trusted by Top Brands!"
      />
      <meta name="twitter:image" content="/icons/twitter.png" />
      {/* <meta name="twitter:creator" content="@DavidWShadow" /> */}
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Uri - AI-Powered Social Insights, Content Management, and Growth Tools Trusted by Top Brands"
      />
      <meta
        property="og:description"
        content="Uri - AI-Powered Social Insights, Content Management, and Growth Tools Trusted by Top Brands"
      />
      <meta property="og:site_name" content="URI - AI-Powered Social Insights, Content Management, and Growth Tools Trusted by Top Brandst" />
      <meta property="og:url" content="https://uricreative.com" />
      <meta property="og:image" content="/icons/upload-icon.png" />
      {/* add the following only if you want to add a startup image for Apple devices. */}
      <link
        rel="apple-touch-startup-image"
        href="/images/apple_splash_2048.png"
        sizes="2048x2732"
      />
      <link
        rel="apple-touch-startup-image"
        href="/images/apple_splash_1668.png"
        sizes="1668x2224"
      />
      <link
        rel="apple-touch-startup-image"
        href="/images/apple_splash_1536.png"
        sizes="1536x2048"
      />
      <link
        rel="apple-touch-startup-image"
        href="/images/apple_splash_1125.png"
        sizes="1125x2436"
      />
      <link
        rel="apple-touch-startup-image"
        href="/images/apple_splash_1242.png"
        sizes="1242x2208"
      />
      <link
        rel="apple-touch-startup-image"
        href="/images/apple_splash_750.png"
        sizes="750x1334"
      />
      <link
        rel="apple-touch-startup-image"
        href="/images/apple_splash_640.png"
        sizes="640x1136"
      />
    </Head>
  );
};

export default SeoHead;
