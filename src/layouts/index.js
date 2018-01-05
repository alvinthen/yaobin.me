import React from 'react'
import Link from 'gatsby-link'
import { Container } from 'react-responsive-grid'

import Favicon from '../components/Favicon';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { rhythm, scale } from '../utils/typography'

class Template extends React.Component {
  render() {
    const { data: { site: { siteMetadata } }, children, location } = this.props
    const showMetadata = location.pathname === '/'
      || location.pathname === '/blog';

    return (
      <div className={showMetadata ? 'home' : 'page'}>
        <div className="site">
          <Favicon />
          <Header siteMetadata={siteMetadata} showMetadata={showMetadata} />
          {children()}
          <Footer />
        </div>
      </div>
    )
  }
}

export default Template

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        author
        description
      }
    }
  }
`
