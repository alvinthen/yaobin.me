import React from 'react';

import Favicon from '../components/Favicon';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../styles/syntax.scss';
import '../styles/fonts/fira_code.css';

const pagesToShowHeader = ['/', '/blog', '/blog/'];

export default ({ data: { site: { siteMetadata } }, children, location: { pathname } }) => (
  <div className={pagesToShowHeader.includes(pathname) ? 'home' : 'page'}>
    <div className="site">
      <Favicon />
      <Header siteMetadata={siteMetadata} />
      {children()}
      <Footer siteMetadata={siteMetadata} />
    </div>
  </div>
);

export const query = graphql`
  query LayoutQuery {
    site {
      ...Footer_siteMetadata
      ...Header_siteMetadata
    }
  }
`;
