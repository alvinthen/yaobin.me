const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

const createTagPages = (createPage, edges) => {
  const tagTemplate = path.resolve(`src/templates/tags.js`);
  const posts = {};

  edges
    .forEach(({ node }) => {
      if (node.frontmatter.tags) {
        node.frontmatter.tags
          .forEach(tag => {
            if (!posts[tag]) {
              posts[tag] = [];
            }
            posts[tag].push(node);
          });
      }
    });

  createPage({
    path: '/tags',
    component: tagTemplate,
    context: {
      posts
    }
  });

  Object.keys(posts)
    .forEach(tagName => {
      const post = posts[tagName];
      createPage({
        path: `/tags/${tagName}`,
        component: tagTemplate,
        context: {
          posts,
          post,
          tag: tagName
        }
      })
    });
};

const createCategoryPages = (createPage, edges) => {
  const categoryTemplate = path.resolve(`src/templates/tags.js`);
  const posts = {};

  edges
    .forEach(({ node }) => {
      if (node.frontmatter.categories) {
        node.frontmatter.categories
          .forEach(category => {
            if (!posts[category]) {
              posts[category] = [];
            }
            posts[category].push(node);
          });
      }
    });

  createPage({
    path: '/categories',
    component: categoryTemplate,
    context: {
      posts
    }
  });

  Object.keys(posts)
    .forEach(category => {
      const post = posts[category];
      createPage({
        path: `/categories/${category}`,
        component: categoryTemplate,
        context: {
          posts,
          post,
          tag: category
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

    createTagPages(createPage, posts);
    createCategoryPages(createPage, posts);

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
