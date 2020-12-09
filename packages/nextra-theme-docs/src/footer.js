import React from "react"
import ArrowRight from "./arrow-right"
import Link from "next/link"

import renderComponent from "./utils/render-component"

const NextLink = ({ route, title }) => {
  return (
    <Link href={route}>
      <span className="text-lg font-medium p-4 -m-4 no-underline text-gray-600 hover:text-blue-600 flex items-center ml-2">
        {title}
        <ArrowRight className="inline ml-1 flex-shrink-0" />
      </span>
    </Link>
  )
}

const PrevLink = ({ route, title }) => {
  return (
    <Link href={route}>
      <span className="text-lg font-medium p-4 -m-4 no-underline text-gray-600 hover:text-blue-600 flex items-center mr-2">
        <ArrowRight className="transform rotate-180 inline mr-1 flex-shrink-0" />
        {title}
      </span>
    </Link>
  )
}

// Make sure path is a valid url path,
// adding / in front or in the back if missing
const fixPath = (path) => {
  const pathWithFrontSlash = path.startsWith("/") ? path : `/${path}`
  const pathWithBackSlash = pathWithFrontSlash.endsWith("/")
    ? pathWithFrontSlash
    : `${pathWithFrontSlash}/`

  return pathWithBackSlash
}

const createEditUrl = (repository, branch, path, filepathWithName) => {
  const normalizedPath = fixPath(path)
  return `${repository}/tree/${branch}${normalizedPath}${filepathWithName}`
}

const EditOnGithubLink = ({
  repository,
  branch,
  path,
  footerEditOnGitHubText,
  filepathWithName,
}) => {
  const href = createEditUrl(repository, branch, path, filepathWithName)
  console.log({ href })
  return (
    <a className="text-sm" href={href} target="_blank">
      {footerEditOnGitHubText
        ? renderComponent(footerEditOnGitHubText, {
            locale,
          })
        : "Edit this page on GitHub"}
    </a>
  )
}

const Footer = ({
  config,
  flatDirectories,
  currentIndex,
  filepathWithName,
}) => {
  let prev = flatDirectories[currentIndex - 1]
  let next = flatDirectories[currentIndex + 1]

  return (
    <footer className="mt-24">
      <nav className="flex flex-row items-center justify-between">
        <div>
          {prev && config.PrevLink ? (
            <PrevLink route={prev.route} title={prev.route} />
          ) : null}
        </div>
        <div>
          {config.nextLinks && next ? (
            <NextLink route={next.route} title={next.route} />
          ) : null}
        </div>
      </nav>

      <hr />

      {config.footer ? (
        <div className="mt-24 flex justify-between flex-col-reverse md:flex-row items-center md:items-end">
          <span className="text-gray-600">
            {renderComponent(config.footerText, { locale })}
          </span>
          <div className="mt-6" />
          {config.footerEditOnGitHubLink ? (
            <EditOnGithubLink
              repository={config.repository}
              branch={config.branch}
              path={config.path}
              footerEditOnGitHubText={config.footerEditOnGitHubText}
              filepathWithName={filepathWithName}
            />
          ) : null}
        </div>
      ) : null}
    </footer>
  )
}

export default Footer
