import { getDictionary } from '../_dictionaries/get-dictionary'
import type { Locale } from '../_dictionaries/i18n-config'
import {
  BoxIcon,
  DotsVerticalIcon,
  FeatherIcon,
  LayersIcon,
  LightningIcon,
  PauseIcon,
  PulseIcon,
  RainIcon
} from '../_icons'
import styles from './features.module.css'

export default async function Features({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang)

  return (
    <div className="mx-auto mb-10 w-[880px] max-w-full px-4 text-center">
      <p className="mb-2 text-lg text-gray-600 md:!text-2xl">
        {dictionary.baseDescription}
      </p>
      <div className={styles.features}>
        {[
          {
            name: dictionary.lightweight,
            icon: FeatherIcon
          },
          {
            name: dictionary.realtime,
            icon: LightningIcon
          },
          {
            name: dictionary.suspense,
            icon: PauseIcon
          },
          {
            name: dictionary.pagination,
            icon: DotsVerticalIcon
          },
          {
            name: dictionary.backendAgnostic,
            icon: RainIcon
          },
          {
            name: dictionary.renderingStrategies,
            icon: LayersIcon
          },
          {
            name: dictionary.typescript,
            icon: BoxIcon
          },
          {
            name: dictionary.remoteLocal,
            icon: PulseIcon
          }
        ].map(({ name, icon: Icon }) => (
          <div key={name} className={styles.feature}>
            <Icon />
            <h4>{name}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}
