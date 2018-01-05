import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'

import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = { author: null, quote: null };
  }

  componentDidMount() {
    this.getQuote();
  }

  getQuote() {
    if (this.props.location.pathname === '/') {
      fetch('https://random-quote-generator.herokuapp.com/api/quotes/random')
        .then(res => res.json())
        .then((data) => {
          const { quote, author } = data;
          this.setState({
            quote,
            author,
          });
        })
        .catch(e => console.log(e));
    }
  }

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = this.props.data.allMarkdownRemark.edges.filter(edge => edge.node.fields.slug.includes('/blog/'));

    return (
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
                            <span className="screen-reader">Posted on </span>
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
                <li className="list-item">
                  <article>
                    <header className="list-item-header">
                      <h3 className="list-item-title">
                        <code>// TODO: Get a logo</code>
                      </h3>
                    </header>
                  </article>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
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
