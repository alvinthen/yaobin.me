---
title: 'Creating tags in Gatsby'
date: '2018-03-11T13:19:07+0800'
categories: ['Code', 'Getting into Gatsby']
tags: ['Gatsby']
excerpt: 'We will go through how to add tags/categories to a post, create a page to show all posts with the same tag, and also create a page to list all the tags.'
---

> This is part of a series of Gatsby posts focusing on what I've learnt while setting up this blog, [see other related posts in the series here](/categories/getting-into-gatsby).

# Creating tags in Gatsby
The steps to tagging a Markdown-based Gatsby page are quite straightforward, here's what we're going to do:

1. Add some tags to the Markdown post
1. While creating the pages, collect all the tags
1. Create page to show posts of a specific tag
1. Create page to show all the tags

# Using metadata/frontmatter to tag post
Tagging/labeling a post in Markdown is as simple as adding a metadata to it, in an array. Shown below is the metadata related to this exact post.

```yaml
---
title: 'Creating tags in Gatsby'
date: '2018-03-11T13:19:07+0800'
categories: ['Code', 'Getting into Gatsby']
tags: ['Gatsby']
excerpt: 'We will go through how to add tags/categories to a post, and also creating a page to list the tags.'
---
```

Nothing's too hard right? Next...

# Collect all the tags
```js
const urlize = require('urlize').urlize;
const { allMarkdownRemark: { edges } } = result.data;
const allTags = {};

edges.forEach(({ node }) => {
  const { tags } = node.frontmatter;
  if (tags) {
    tags.forEach((tag) => {
      if (!allTags[tag]) {
        allTags[tag] = {
          slug: urlize(tag),
          posts: [],
        };
      }
      allTags[tag].posts.push(node);
    });
  }
});
```

Let's go through the codes swiftly.

First we import `urlize` to help us to form a more human-readable slug. So __Getting into Gatsby__ becomes `getting-into-gatsby`.

Then we get our posts from `result.data`. If you need a recap, `result.data` is what we query from Gatsby using GraphQL, [see related post here](/blog/creating-pages-in-gatsby).

Next, we iterate through the posts, collecting each of the tag into `allTags` with the tag name as the key, an object with slug and posts fields as the value. This is what `allTags` looks like;

```js
{
  'Getting into Gatsby': {
    slug: 'getting-into-gatsby',
    posts: [{ post1, post2 }]
  }
}
```

Now we're ready to create all the pages!

# Show posts of same tag
```js
Object.keys(allTags).forEach(tag => {
  const component = path.resolve(`src/templates/tags.js`);
  const { posts, slug } = allTags[tag];
  createPage({
    path: `/tags/${slug}`,
    component,
    context: {
      slug,
      posts,
      tag,
    }
  })
});
```

Yes, that's it, just iterate over the keys of `allTags`. We use `context` to pass the data that we don't normally (or easily) have access to via GraphQL.

This is one of the ways, the other being creating nodes, which will be too much for beginners. I have recently published a [plugin](https://www.npmjs.com/package/gatsby-source-firestore) utilizing Firestore, after spending days understanding Gatsby inside-out. That's the fun of open source project!

# Show list of tags
```js
createPage({
  path: '/tags',
  component,
  context: {
    slug: '/tags',
    allTags,
  }
});
```

That's that, we use `context` again to pass all the tags to our template component.

The component can access the context via `pathContext` in the supplied props, i.e.

```js
export default ({ pathContext }) => (
  <ul>
    {Object.keys(pathContext.allTags).map(tag => <li>{tag}</li>)}
  </ul>
);
```

That wasn't too hard, was it? It's always amazing to see how easy was it after spending hours/days to achieve something in programming. Well, that's the fun of it right?

Let me know what you think, share with me your best moment in software development!
