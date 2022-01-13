# 프리패칭 데이터

## 최상위 레벨 페이지 데이터

SWR을 위한 데이터 프리패칭 방법은 다양합니다. 최상위 요청에 대해서는 [`rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)를 적극적으로 권장합니다.

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

HTML `<head>` 안에 넣기만 하면 됩니다. 쉽고 빠르며 네이티브입니다.

심지어 JavaScript가 다운로드 되기 전에 HTML을 로드할 때 데이터를 프리패칭 합니다. 동일한 URL로의 모든 가져오기 요청은 결과를 재사용합니다(물론 SWR도 포함).

## 프로그래밍 방식으로 프리패치

조건부로 리소스를 프리로드 하길 원할 수도 있습니다. 예를 들면, 사용자가 [어떤](https://github.com/guess-js/guess) [링크](https://instant.page)를 [호버링](https://github.com/GoogleChromeLabs/quicklink)할 때 데이터 프리로딩. 가장 직관적인 방법은 전역 [mutate](/docs/mutation)를 통해 캐시를 다시 가져오고 설정하는 함수를 두는 것입니다.

```js
import { mutate } from 'swr'

function prefetch () {
  mutate('/api/data', fetch('/api/data').then(res => res.json()))
  // 두 번째 파라미터는 Promise입니다
  // 프로미스가 이행될 때 SWR은 그 결과를 사용합니다
}
```

Next.js내의 [페이지 프리패칭](https://nextjs.org/docs/api-reference/next/router#routerprefetch)같은 기술과 함께 다음 페이지와 데이터 모두를 즉시 로드할 수 있습니다.

## 데이터 프리필

이미 존재하는 데이터를 SWR 캐시에 미리 채우길 원한다면, `fallbackData` 옵션을 사용할 수 있습니다. 예를 들면: 

```jsx
useSWR('/api/data', fetcher, { fallbackData: prefetchedData })
```

SWR가 데이터를 아직 가져오지 않았다면, 이 hook은 폴백으로 `prefetchedData` 를 반환할 것입니다. 

`<SWRConfig>` 및 `fallback` 옵션을 사용하여 모든 SWR hooks 및 다중 키에 대해서도 이것을 구성할 수 있습니다. 자세한 내용은 [Next.js SSG 및 SSR](/docs/with-nextjs)을 확인하세요.
