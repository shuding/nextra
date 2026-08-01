import type * as HeadlessUI from '@headlessui/react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  cloneElement,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode
} from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Search } from '../components/search.js'

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// jsdom doesn't implement ResizeObserver, which @headlessui/react relies on.
;(
  globalThis as typeof globalThis & { ResizeObserver?: unknown }
).ResizeObserver ??= ResizeObserverMock

interface PagefindSearchMock {
  debouncedSearch: () => Promise<never>
}

const pagefindWindow = window as Window & { pagefind?: PagefindSearchMock }

const { capturedOptionsChildren } = vi.hoisted(() => ({
  capturedOptionsChildren: { value: undefined as unknown }
}))

// The `.svg` icons are compiled by the svgr esbuild plugin during build; vitest has
// no svgr plugin, so stub them out (they are irrelevant to this test).
vi.mock('../icons/index.js', () => ({
  InformationCircleIcon: () => createElement('svg'),
  SpinnerIcon: () => createElement('svg')
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href?: string
    children?: ReactNode
  }) => createElement('a', { href, ...props }, children)
}))

vi.mock('next/dist/client/add-base-path', () => ({
  addBasePath: (path: string) => path
}))

vi.mock('@headlessui/react', async importOriginal => {
  const actual = await importOriginal<typeof HeadlessUI>()
  return {
    ...actual,
    ComboboxOptions: ((
      props: React.ComponentProps<typeof actual.ComboboxOptions>
    ) => {
      capturedOptionsChildren.value = props.children
      return createElement(actual.ComboboxOptions, props)
    }) as typeof actual.ComboboxOptions
  }
})

describe('Search', () => {
  const errorSpy = vi.spyOn(console, 'error')

  afterEach(() => {
    errorSpy.mockClear()
    pagefindWindow.pagefind = undefined
    capturedOptionsChildren.value = undefined
  })

  async function renderLoadingState() {
    render(<Search />)
    const input = screen.getByRole('combobox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'foo' } })
    })
    await waitFor(() => {
      expect(capturedOptionsChildren.value).toBeDefined()
    })
  }

  function expectNoFragmentRefWarning() {
    // Mirror `@headlessui/react` >= 2.2.10 `Frozen`, which clones a single element
    // child with a `ref`. If the child were a `Fragment`, React 19 would warn.
    const children = capturedOptionsChildren.value
    if (isValidElement(children)) {
      render(
        cloneElement(children as ReactElement<Record<string, unknown>>, {
          ref: () => {}
        })
      )
    }

    expect(
      errorSpy.mock.calls.some(args =>
        String(args[0]).includes('React.Fragment')
      )
    ).toBe(false)
  }

  it('does not render a `Fragment` as `ComboboxOptions` children in the loading state', async () => {
    // Keep the pagefind request pending so the loading state stays rendered.
    pagefindWindow.pagefind = {
      debouncedSearch: () => new Promise(() => {})
    }

    await renderLoadingState()
    // The wrapper `<div>` must still render the loading content unchanged.
    await waitFor(() => {
      expect(screen.getByText('Loading…')).toBeTruthy()
    })
    expectNoFragmentRefWarning()
  })

  it('does not render a `Fragment` as `ComboboxOptions` children in the error state', async () => {
    // No pagefind index: `importPagefind()` fails, leaving the error state rendered.
    delete pagefindWindow.pagefind

    await renderLoadingState()
    // The wrapper `<div>` must still render the error content unchanged.
    await waitFor(() => {
      expect(screen.getByText('Failed to load search index.')).toBeTruthy()
    })
    expectNoFragmentRefWarning()
  })
})
