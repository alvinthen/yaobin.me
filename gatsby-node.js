const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

const createTagPages = (createPage, edges, title) => {
  const tagTemplate = path.resolve(`src/templates/tags.js`);
  const tags = {};

  edges.forEach(({ node }) => {
    // Quick and dirty hack
    if (node.frontmatter[`${title.toLowerCase()}`]) {
      node.frontmatter[`${title.toLowerCase()}`].forEach((tag) => {
        if (!tags[tag]) {
          tags[tag] = [];
        }
        tags[tag].push(node);
      });
    }
  });

  const tagsPath = `/${title.toLowerCase()}/`
  createPage({
    path: tagsPath,
    component: tagTemplate,
    context: {
      slugPrefix: tagsPath,
      tags,
      title,
    }
  });

  Object.keys(tags).forEach(tagName => {
    const posts = tags[tagName];
    const tagPath = `${tagsPath}${tagName}`;
    createPage({
      path: tagPath,
      component: tagTemplate,
      context: {
        slug: tagPath,
        posts,
        tag: tagName,
        title,
      }
    })
  });
};

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);
  return graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "YYYY, MMM DD")
            dateTime: date
            tags
            categories
          }
          fields {
            slug
          }
        }
      }
    }
    about: markdownRemark(fields: { slug: { eq: "/about/" }}) {
      frontmatter {
        title
      }
    }
  }`)
  .then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    // Create About page
    const about = result.data.about;
    createPage({
      path: '/about/',
      component: blogPostTemplate,
      context: {
        slug: '/about/',
      }
    });


    // Create pages for each markdown file.
    const posts = result.data.allMarkdownRemark.edges.filter(edge => edge.node.fields.slug.includes('/blog/'));
    posts.forEach(({ node }, index) => {
      const prev = index === 0 ? null : posts[index - 1].node;
      const next = index === posts.length - 1 ? null : posts[index + 1].node;
      createPage({
        path: node.fields.slug,
        component: blogPostTemplate,
        context: {
          slug: node.fields.slug,
          prev,
          next
        }
      });
    });

    createTagPages(createPage, posts, 'Tags');
    createTagPages(createPage, posts, 'Categories');

    return posts;
  })
  .catch(e => console.error(e))
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark` && getNode(node.parent).internal.type === `File`) {
    const fileNode = getNode(node.parent);
    if (fileNode.sourceInstanceName === 'pages') {
      let slug;
      if (fileNode.relativeDirectory)
        slug = `/${fileNode.relativeDirectory}/`;
      else
        slug = `/${fileNode.name}/`;

      if (slug) {
        createNodeField({
          name: `slug`,
          node,
          value: slug,
        })
      }
    }

  }
};
