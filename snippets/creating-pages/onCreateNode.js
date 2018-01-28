// gatsby-node.js
exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;

  if (node.internal.type === `MarkdownRemark`) {
    const fileNode = getNode(node.parent);
    let slug;
    if (fileNode.relativeDirectory) {
      // We'll use the path to the MD file as the slug.
      // eg: http://localhost:8000/blog/my-first-post
      slug = `/${fileNode.relativeDirectory}`;
    }
    else {
      // If the MD file is at src/pages, we'll use the filename instead.
      // eg: http://localhost:8000/about
      slug = `/${fileNode.name}`;
    }

    if (slug) {
      // The slug will be available at node.fields.slug
      createNodeField({
        name: `slug`,
        node,
        value: slug,
      });
    }
  }
};
