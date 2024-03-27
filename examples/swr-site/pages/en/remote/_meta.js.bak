/* eslint-disable */

module.exports = async () => {
  const token = process.env.GITHUB_TEST_REMOTE_MDX
  const res = await fetch(
    'https://api.github.com/gists/c204a2da82cd3ed8e676f35c493ab59f/comments',
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  )
  const comments = await res.json()
  if (!Array.isArray(comments)) {
    throw new Error(JSON.stringify(comments, null, 4))
  }
  return Object.fromEntries(
    comments.map(comment => [comment.id, comment.user.login + '_' + comment.id])
  )
}
