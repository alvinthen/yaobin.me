import React from 'react';
import Link from 'gatsby-link'

import Nav from './Nav';

export default ({ siteMetadata }) => (
  <header id="header" className="header-container">
    <div className="header site-header">
      <Nav />
      <div className="header-info">
        <h1 className="site-title title">{siteMetadata.author}</h1>
        <p className="site-description subtitle">{siteMetadata.description}</p>
      </div>
    </div>
  </header>
);

export const headerFragment = graphql`
  fragment Header_siteMetadata on Site {
    siteMetadata {
      author
      description
    }
  }
`;
