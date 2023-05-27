import { useRouter } from 'next/router'
import styles from './features.module.css'

const Feature = ({ text, icon }) => (
  <div className={styles.feature}>
    {icon}
    <h4>{text}</h4>
  </div>
)

const TITLE_WITH_TRANSLATIONS = {
  'en-US': 'React Hooks for Data Fetching',
  'es-ES': 'Biblioteca React Hooks para la obtención de datos',
  ru: 'React хуки для выборки данных'
}

// Translations for Features
const FEATURES_WITH_TRANSLATIONS = {
  'en-US': {
    lightweight: 'Lightweight',
    realtime: 'Realtime',
    suspense: 'Suspense',
    pagination: 'Pagination',
    backendAgnostic: 'Backend Agnostic',
    renderingStrategies: 'SSR / SSG Ready',
    typescript: 'TypeScript Ready',
    remoteLocal: 'Remote + Local'
  },
  'es-ES': {},
  ru: {
    lightweight: 'Лёгкий',
    realtime: 'В реальном времени',
    suspense: 'Задержка',
    pagination: 'Пагинация',
    backendAgnostic: 'Бэкэнд-независимый',
    renderingStrategies: 'SSR / SSG',
    typescript: 'TypeScript',
    remoteLocal: 'Удалённо + Локально'
  }
}

export default function Features() {
  const { locale, defaultLocale } = useRouter()

  const featureText = key =>
    FEATURES_WITH_TRANSLATIONS[locale]?.[key] ??
    FEATURES_WITH_TRANSLATIONS[defaultLocale][key] // Fallback for missing translations

  return (
    <div className="mx-auto mb-10 w-[880px] max-w-full px-4 text-center">
      <p className="mb-2 text-lg text-gray-600 md:!text-2xl">
        {TITLE_WITH_TRANSLATIONS[locale]}
      </p>
      <div className={styles.features}>
        <Feature
          text={featureText('lightweight')}
          icon={
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="15" />
            </svg>
          }
        />
        <Feature
          text={featureText('realtime')}
          icon={
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              shapeRendering="geometricPrecision"
              viewBox="0 0 24 24"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          }
        />
        <Feature
          text={featureText('suspense')}
          icon={
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="10" y1="15" x2="10" y2="9" />
              <line x1="14" y1="15" x2="14" y2="9" />
            </svg>
          }
        />
        <Feature
          text={featureText('pagination')}
          icon={
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          }
        />
        <Feature
          text={featureText('backendAgnostic')}
          icon={
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              shapeRendering="geometricPrecision"
            >
              <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
              <path d="M8 16h.01" />
              <path d="M8 20h.01" />
              <path d="M12 18h.01" />
              <path d="M12 22h.01" />
              <path d="M16 16h.01" />
              <path d="M16 20h.01" />
            </svg>
          }
        />
        <Feature
          text={featureText('renderingStrategies')}
          icon={
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              shapeRendering="geometricPrecision"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          }
        />
        <Feature
          text={featureText('typescript')}
          icon={
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              shapeRendering="geometricPrecision"
              viewBox="0 0 24 24"
            >
              <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
            </svg>
          }
        />
        <Feature
          text={featureText('remoteLocal')}
          icon={
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              shapeRendering="geometricPrecision"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="2" />
              <path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14" />
            </svg>
          }
        />
      </div>
    </div>
  )
}
