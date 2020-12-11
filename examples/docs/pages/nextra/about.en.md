# About

Nextra also supports .md files.

1. one
2. two
3. three

- one
- two
- three

---

# **Hello**, This Is a _Title_ Inside `h1`

## **Hello**, This Is a _Title_ Inside `h2`

### **Hello**, This Is a _Title_ Inside `h3`

#### **Hello**, This Is a _Title_ Inside `h4`

##### **Hello**, This Is a _Title_ Inside `h5`

###### **Hello**, This Is a _Title_ Inside `h6`

Use [MDX](https://mdxjs.com/about) to use React components inside your Markdown file:

import Callout from 'nextra-theme-docs/callout'

<Callout emoji="✅">
  MDX (the library), at its core, transforms MDX (the syntax) to JSX. It receives an MDX string and outputs a JSX string. It does this by parsing the MDX document to a syntax tree and then generates a JSX document from that tree. 
</Callout>

Code highlighting with focused lines using

````markdown
```jsx highlight=2,3
function App() {
  // these 2 lines will be highlighted
  return <App>My JSX Code</App>
}
```
````

```jsx highlight=4,8
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

Inline code: `let x = 1`.  
Multiple lines: `x += 1`.

> Where some people measure progress in answers-right per test or tests-passed per year, we are more interested in Sistine-Chapel-Ceilings per Lifetime.
>
> — Alan Kay, A Personal Computer for Children of All Ages

And quote inside quote:

> > Where some people measure progress in answers-right per test or tests-passed per year, we are more interested in Sistine-Chapel-Ceilings per Lifetime.
> >
> > — Alan Kay, A Personal Computer for Children of All Ages
>
> This is **great**.
>
> — Shu Ding.

| Syntax        | Description |   Test Text |
| :------------ | :---------: | ----------: |
| Header        |    Title    | Here's this |
| Paragraph     |    Text     |    And more |
| Strikethrough |             |    ~~Text~~ |

Task list

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

---

Click the "Edit on GitHub" link below to see the code.
