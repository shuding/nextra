---
'nextra-theme-docs': minor
'nextra': minor
---

feat: add Copy Documentation button/dropdown feature as LLM-Optimized Prompt

![](https://private-user-images.githubusercontent.com/7361780/473206831-aa851d94-3b83-46e8-8b00-5bf06c33314f.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTQ0NjgwNzUsIm5iZiI6MTc1NDQ2Nzc3NSwicGF0aCI6Ii83MzYxNzgwLzQ3MzIwNjgzMS1hYTg1MWQ5NC0zYjgzLTQ2ZTgtOGIwMC01YmYwNmMzMzMxNGYucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDgwNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA4MDZUMDgwOTM1WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MjgwZTI3YWMzODYwNjEwNTgwNGUyOTJkMDg5MzNjOGRjZWE0MWYzMWQwZmM3ZDJkMjQzMDc2ZDRjMzQ4ZTRlZSZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.C7LZXaay7uuPQsDBb3MKLrbiBWxTPM2q9nfSqUGp3_0)

> **Note**
> 
> If you are using [`content` directory](https://nextra.site/docs/file-conventions/content-directory), you **must** pass the `sourceCode` prop to enable this feature.
>
> ```diff
> const {
>   default: MDXContent,
>   toc,
>   metadata,
> + sourceCode
> } = await importPage(params.mdxPath)
> return (
> - <Wrapper toc={toc} metadata={metadata}>
> + <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
>     <MDXContent {...props} params={params} />
>   </Wrapper>
> )
> ```
