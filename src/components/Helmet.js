import React from "react";
import Helmet from "react-helmet";

export default ({ post, siteMetadata }) => {
  const URL = process.env.NODE_ENV === 'production' ? siteMetadata.siteUrl : '';
  const title = `${post.frontmatter.title} | ${siteMetadata.siteTitle}`;
  const description = post.frontmatter.excerpt || post.excerpt;
  const image = post.frontmatter.cover
    ? `${URL}${post.frontmatter.cover.childImageSharp.resize.src}`
    : '/myface.jpg';
  const postURL = `${URL}${post.fields.slug}`;
  const blogURL = `${URL}/blog/`;
  const alternateName = 'Yaobin';

  const schemaOrgJSONLD = [
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      url: blogURL,
      name: title,
      alternateName,
    }
  ];
  if (post) {
    schemaOrgJSONLD.push([
      {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": postURL,
              name: title,
              image
            }
          }
        ]
      },
      {
        "@context": "http://schema.org",
        "@type": "BlogPosting",
        url: blogURL,
        name: title,
        alternateName,
        headline: title,
        image: {
          "@type": "ImageObject",
          url: image
        },
        description
      }
    ]);
  }
  return (
    <Helmet title={`${post.frontmatter.title} | ${siteMetadata.title}`}>
      {/* General tags */}
      <meta name="description" content={description} />
      <meta name="image" content={image} />

      {/* Schema.org tags */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>

      {/* OpenGraph tags */}
      <meta property="og:url" content={post ? postURL : blogURL} />
      {post ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta
        property="fb:app_id"
        content={"2176625045898163"}
      />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:creator"
        content={"@yaobinme"}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
