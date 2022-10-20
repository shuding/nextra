export function OptionTable({ options }: { options: [string, string, any] }) {
  return (
    <div className="nx-mt-6 nx-mb-4 nx-pb-4 nx-overflow-x-auto nx-overscroll-x-contain">
      <table className="nx-border-collapse nx-w-full nx-text-sm">
        <thead>
          <tr className="nx-border-b nx-text-left nx-py-4 dark:nx-border-primary-100/10">
            <th className="nx-py-2 nx-font-semibold">Option</th>
            <th className="nx-py-2 nx-pl-6 nx-font-semibold">Type</th>
            <th className="nx-py-2 nx-pl-6 nx-pr-6 nx-font-semibold">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="nx-text-gray-900 dark:nx-text-gray-100 nx-align-baseline">
          {options.map(([option, type, description]) => (
            <tr
              key={option}
              className="nx-border-b nx-border-gray-100 dark:nx-border-zinc-800/50"
            >
              <td className="nx-py-2 nx-font-mono nx-font-semibold nx-text-xs nx-leading-6 nx-text-violet-600 nx-whitespace-pre dark:nx-text-violet-500">
                {option}
              </td>
              <td className="nx-py-2 nx-pl-6 nx-font-mono nx-font-semibold nx-text-xs nx-leading-6 nx-text-slate-500 nx-whitespace-pre dark:nx-text-slate-400">
                {type}
              </td>
              <td className="nx-py-2 nx-pl-6">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
