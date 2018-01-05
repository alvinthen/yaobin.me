import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'

import BlogHeader from '../components/BlogHeader'
import { rhythm, scale } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const author = get(this.props, 'data.site.siteMetadata.author')
    const { next, prev } = this.props.pathContext;
    const tags = post.frontmatter.tags || [];
    const categories = post.frontmatter.categories || [];

    return (
      <main className="main">
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <article lang="en" className="entry">
          <BlogHeader
            title={post.frontmatter.title}
            author={author}
            date={post.frontmatter.date}
            dateTime={post.frontmatter.dateTime}
            timeToRead={post.timeToRead}
            excerpt={post.frontmatter.excerpt || post.excerpt}
          />
          <div className="entry-content" dangerouslySetInnerHTML={{ __html: post.html }} />
          {(tags.length > 0 || categories.length > 0) &&
            <footer className="entry-footer-container">
              <div className="entry-footer">
                {categories.length > 0 &&
                  <div className="categories">
                    <span className="taxonomyTerm-icon">
                      <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M22,19a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V5A2,2,0,0,1,4,3H9l2,3h9a2,2,0,0,1,2,2Z"></path>
                    </svg>
                    </span>
                    <span className="screen-reader">Categories: </span>
                    {categories.map((category) => (
                      <Link key={category} className="category" to={`/categories/${category}`}>
                        {category}
                      </Link>
                    ))}
                  </div>
                }
                {tags.length > 0 &&
                  <div className="tags">
                    <span className="taxonomyTerm-icon">
                      <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <path d="M20.59,13.41l-7.17,7.17a2,2,0,0,1-2.83,0L2,12V2H12l8.59,8.59A2,2,0,0,1,20.59,13.41Z"></path>
                        <line x1="7" y1="7" x2="7" y2="7"></line>
                      </svg>
                    </span>
                    <span className="screen-reader">Tags: </span>
                    {tags.map((tag) => (
                      <Link key={tag} className="tag" to={`/tags/${tag}`}>
                        {tag}
                      </Link>
                    ))}
                  </div>
                }
              </div>
            </footer>
          }
        </article>
        {(prev || next) &&
          <nav className="entry-nav-container">
            <div className="entry-nav">
              {prev &&
                <div className="prev-entry">
                  <Link to={prev.fields.slug}>
                    <span>
                      <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <line x1="20" y1="12" x2="4" y2="12"></line>
                        <polyline points="10 18 4 12 10 6"></polyline>
                      </svg>
                      &nbsp;Previous
                    </span>
                    <span className="screen-reader">Previous post: </span>
                    {prev.frontmatter.title}
                  </Link>
                </div>
              }
              {next &&
                <div className="next-entry">
                  <Link to={next.fields.slug}>
                    <span className="screen-reader">Next post: </span>
                    {next.frontmatter.title}
                    <span>
                      Next&nbsp;
                      <svg className="icon" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                        <line x1="4" y1="12" x2="20" y2="12"></line>
                        <polyline points="14 6 20 12 14 18"></polyline>
                      </svg>
                    </span>
                  </Link>
                </div>
              }
            </div>
          </nav>
        }
      </main>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      excerpt
      frontmatter {
        excerpt
        title
        date(formatString: "YYYY, MMM DD")
        dateTime: date
        tags
        categories
      }
    }
  }
`
