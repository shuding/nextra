// https://www.notion.so/Callout-blocks-5b2638247b54447eb2e21145f97194b0
export default ({ children, background = 'bg-orange-100', emoji = '💡' }) => {
  return <p className={`${background} flex rounded-lg`}>
    <span className="pl-3 pr-2 py-2 select-none text-xl">{emoji}</span>
    <span className="pr-4 py-2">{children}</span>
  </p>
}
