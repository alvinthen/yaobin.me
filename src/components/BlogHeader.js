import React from 'react';

export default ({ siteMetadata, post }) => (
  <header className="header-container">
    <div className="header entry-header">
      <div className="header-info">
        <h1 className="title">{post.title}</h1>
        <p className="subtitle">
          {post.frontmatter.excerpt || post.excerpt}
        </p>
      </div>

      <div className="meta">
        <span className="posted-on">
          <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="screen-reader">Posted on </span>
          <time className="date" dateTime={post.dateTime}>{post.date}</time>
        </span>

        <span className="byline">
          <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="M21,21V20c0-2.76-4-5-9-5s-9,2.24-9,5v1"></path>
            <path d="M16,6.37A4,4,0,1,1,12.63,3,4,4,0,0,1,16,6.37Z"></path>
          </svg>
          <span className="screen-reader"> by </span>
          <a href="#">{siteMetadata.author}</a>
        </span>

        <span className="reading-time">
          <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 15 15"></polyline>
          </svg>
          {post.timeToRead} min read
        </span>
      </div>
    </div>
  </header>
);

export const headerFragment = graphql`
  fragment BlogHeader_siteMetadata on Site {
    siteMetadata {
      author
    }
  }

  fragment BlogHeader_post on MarkdownRemark {
    timeToRead
    excerpt
    frontmatter {
      excerpt
      title
      date(formatString: "YYYY, MMM DD")
      dateTime: date
    }
  }
`;
