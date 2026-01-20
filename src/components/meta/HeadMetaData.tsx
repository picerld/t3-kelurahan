import Head from "next/head";
import React from "react";

export const HeadMetaData: React.FC<{
  title?: string;
  metaDescription?: string;
  ogImageUrl?: string;
  pathName?: string;
}> = ({ title = "Kelurahan", metaDescription, ogImageUrl, pathName = "" }) => {
  const defaultTitle = "Kelurahan";

  const baseUrl = "http://localhost:3001";

  const pageUrl = new URL(pathName, baseUrl).toString();

  return (
    <Head>
      <title>{title + " | " + defaultTitle}</title>
      <link rel="icon" href="/" />

      {/* metadata */}
      <meta name="title" content={title + " | " + defaultTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="og:image" content={ogImageUrl} />
      <meta property="og:url" content={pageUrl} />
    </Head>
  );
};
