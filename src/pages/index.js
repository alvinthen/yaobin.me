import React from 'react'
import { Link, graphql } from 'gatsby'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import { rhythm } from '../utils/typography'
import Layout from '../components/layout'

class BlogIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = { author: null, quote: null };
  }

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = this.props.data.allMarkdownRemark.edges.filter(edge => edge.node.fields.slug.includes('/blog/'));

    return (
      <Layout location={this.props.location}>
        <main id="main" className="main">
          {this.state.quote &&
            <article className="entry">
              <div className="entry-content">
                <blockquote>
                  <p>{this.state.quote} - {this.state.author}</p>
                </blockquote>
              </div>
            </article>
          }
          <div className="home-sections-container">
            <div className="home-sections">
              <section id="recent-posts" className="home-section">
                <header>
                  <h2 className="home-section-title title">Recent Posts</h2>
                </header>

                <Helmet title={siteTitle} />

                <div className="list-container">
                  <ul className="list">
                    {posts.map(({ node }) => {
                      const title = get(node, 'frontmatter.title');
                      return (
                        <li className="list-item" key={node.frontmatter.title}>
                          <article>
                            <div className="meta">
                              <span>
                                <span className="screen-reader">Posted in</span>
                                <time dateTime={node.frontmatter.dateTime}>{node.frontmatter.date}</time>
                              </span>
                            </div>

                            <header className="list-item-header">
                              <h3 className="list-item-title">
                                <Link to={node.fields.slug}>
                                  {title}
                                </Link>
                              </h3>
                            </header>
                          </article>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </main>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            date(formatString: "YYYY, MMM DD")
            dateTime: date
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
