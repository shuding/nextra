export default ({ height = 24, ...props }) => {
  return (
    <svg
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M3 12h18m0 0l-6.146-6M21 12l-6.146 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
