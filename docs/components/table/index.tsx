export function OptionTable({ options }: { options: [string, string, any] }) {
  return (
    <div className="mt-6 mb-4 pb-4 overflow-x-auto overscroll-x-contain">
      <table className="border-collapse w-full text-sm">
        <thead>
          <tr className="border-b text-left py-4 dark:border-primary-100/10">
            <th className="py-2 font-semibold">Option</th>
            <th className="py-2 pl-6 font-semibold">Type</th>
            <th className="py-2 pl-6 pr-6 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="text-gray-900 dark:text-gray-100 align-baseline">
          {options.map(([option, type, description]) => (
            <tr
              key={option}
              className="border-b border-gray-100 dark:border-zinc-800/50"
            >
              <td className="py-2 font-mono font-semibold text-xs leading-6 text-violet-600 whitespace-pre dark:text-violet-500">
                {option}
              </td>
              <td className="py-2 pl-6 font-mono font-semibold text-xs leading-6 text-slate-500 whitespace-pre dark:text-slate-400">
                {type}
              </td>
              <td className="py-2 pl-6">{description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
