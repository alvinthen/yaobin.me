---
title: Using GraphQL in Gatsby components
date: "2018-02-19T16:34:58+0800"
categories: ['Code', 'Getting into Gatsby']
tags: ['Gatsby', 'GraphQL']
excerpt: Gatsby by default only support GraphQL query in components that directly rendered/invoked by Gatsby, these include components in `layouts`, `pages`, and components used as templates when calling the bound action creator `createPage`.
---

> This is part of a series of Gatsby posts focusing on what I've learnt while setting up this blog, [see other related posts in the series here](/categories/getting-into-gatsby).

# Using GraphQL in Gatsby components

Gatsby by default only support GraphQL query in components that directly rendered/invoked by Gatsby, these include components in `layouts`, `pages`, and components used as templates when calling the bound action creator `createPage`.

Hence, when you're refactoring your code into components, you lost the ability to declare what your components wants from GraphQL.

There are two ways around this.

## The React Way

This is the conventional way, using props. Consider that I have extracted a `Header` component from the main layout, and the component requires a `title` props, which is available from the `siteMetadata`. Here's how the React way looks like.

```jsx
// components/Header.js
export default ({ title }) => (
  <h1>{title}</h1>
);

// layouts/index.js
export default ({ data: { site: { siteMetadata } } }) => (
  <Header title={siteMetadata.title} />
);

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
```

Notice how we declare the title in the GraphQL query and pass the data to the `Header` component. This looks ok, but when the data required grows, our `Header` component will have to declare a lot of props, which leads to longer codes, and longer codes smell.

We can make it better by allowing the `Header` to declare what it wants, and pass that responsibility for querying to the main query.

## The GraphQL Fragment Way

Here's how it looks like.

```jsx
// components/Header.js
export default ({ siteMetadata: { title } }) => (
  <h1>{title}</h1>
);

export const query = graphql`
  fragment Header_siteMetadata on Site {
    siteMetadata {
      title
    }
  }
`;

// layouts/index.js
export default ({ data: { site: { siteMetadata } } }) => (
  <Header siteMetadata={siteMetadata} />
);

export const query = graphql`
  query LayoutQuery {
    site {
      ...Header_siteMetadata
    }
  }
`;
```

Now the `Header`, using GraphQL fragment, declares that it wants the `title` from the `siteMetadata` of type `Site`. Without knowing the details, the layout only needs to _spread_ it into the main query, then pass all the `siteMetadata` to the `Header`.

That's about it, simple and clear, with proper encapsulation. Now go refactor your codes, extract into components, and write better code.

Next up: tagging.

Until then, and __Happy Chinese New Year__!
