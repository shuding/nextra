import React from 'react'
import {
  InformationCircleIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationIcon,
  XCircleIcon
} from '@heroicons/react/solid/'

const themes = {
  info: {
    className:
      'bg-blue-100 text-blue-800 dark:text-blue-300 dark:bg-blue-200 dark:bg-opacity-10',
    icon: <InformationCircleIcon className="w-5 h-5 mt-1" />
  },
  idea: {
    className:
      'bg-gray-100 text-gray-800 dark:text-gray-300 dark:bg-gray-200 dark:bg-opacity-10',
    icon: <LightBulbIcon className="w-5 h-5 mt-1" />
  },
  success: {
    className:
      'bg-green-200 text-green-900 dark:text-green-200 dark:bg-green-600 dark:bg-opacity-30',
    icon: <CheckCircleIcon className="w-5 h-5 mt-1" />
  },
  warning: {
    className:
      'bg-orange-100 text-orange-800 dark:text-orange-300 dark:bg-orange-200 dark:bg-opacity-10',
    icon: <ExclamationIcon className="w-5 h-5 mt-1" />
  },
  error: {
    className:
      'bg-red-200 text-red-900 dark:text-red-200 dark:bg-red-600 dark:bg-opacity-30',
    icon: <XCircleIcon className="w-5 h-5 mt-1" />
  }
}

interface CalloutProps {
  /** Callout Theme default to 'default' **/
  type?: keyof typeof themes
  /** no emoji by default **/
  emoji: string
}

const Callout: React.FC<CalloutProps> = ({
  children,
  type = 'idea',
  emoji
}) => {
  return (
    <div className={`${themes[type].className} flex rounded-lg callout mt-6`}>
      <div
        className="pl-3 pr-2 py-2 select-none text-xl"
        style={{
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
        }}
      >
        {emoji || themes[type].icon}
      </div>
      <div className="pr-4 py-2">{children}</div>
    </div>
  )
}

export default Callout
