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

export async function Features({
  lang,
  title
}: {
  lang: Locale
  title: string
}) {
  const dictionary = await getDictionary(lang)

  return (
    <div className="mx-auto mb-10 w-[880px] max-w-full px-4 text-center">
      <p className="mb-2 text-lg text-gray-600 md:!text-2xl">{title}</p>
      <ul className="features">
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
          <li key={name} className="feature">
            <Icon height="24" />
            <h4>{name}</h4>
          </li>
        ))}
      </ul>
    </div>
  )
}
