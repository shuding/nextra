export function gitUrlParse(url: string) {
  const { href, origin, pathname } = new URL(url)

  const [, owner, name] = pathname.split('/')

  return {
    href,
    origin,
    owner,
    name
  }
}
