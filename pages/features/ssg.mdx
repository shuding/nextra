# Next.js SSG in MDX

import { useSSG } from 'nextra/ssg'

export const getStaticProps = ({ params }) => {
  return fetch('https://api.github.com/repos/shuding/nextra')
    .then(res => res.json())
    .then(repo => ({
      props: {
        // We return an `ssg` object in the props.
        ssg: {
          stars: repo.stargazers_count
        }
      },
      revalidate: 5
    }))
}

export const StarsRenderer = () => {
  // And later we can get it inside MDX.
  const { stars } = useSSG()
  return <strong>{stars}</strong>
}

The [Nextra repository](https://github.com/shuding/nextra) has <StarsRenderer/> stars!

---

The page is prerendered at build time with [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)
and [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration).

Check the source code for more information.
