import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import Favicon from './Favicon';
import Header from './Header';
import Footer from './Footer';

import '../styles/syntax.scss';
import '../styles/fonts/fira_code.css';

const pagesToShowHeader = ['/', '/blog', '/blog/'];

export default ({ children, location: { pathname } }) => (
  <StaticQuery
    query={graphql`
      {
        site {
          ...Footer_siteMetadata
          ...Header_siteMetadata
        }
      }
    `}
    render={data => (
      <div className={pagesToShowHeader.includes(pathname) ? 'home' : 'page'}>
        <div className="site">
          <Favicon />
          <Header siteMetadata={data.site.siteMetadata} />
          {children}
          <Footer siteMetadata={data.site.siteMetadata} />
        </div>
      </div>
    )}
  />
);
