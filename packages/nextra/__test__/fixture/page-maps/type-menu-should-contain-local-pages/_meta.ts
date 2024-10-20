export default {
  mix: {
    type: 'menu',
    title: 'mix',
    items: {
      nextra: {
        title: 'Nextra',
        href: 'https://nextra.site'
      },
      '---': {
        type: 'separator'
      },
      qux: {
        title: 'Qux'
      }
    }
  },
  hrefOnly: {
    type: 'menu',
    title: 'Two',
    items: {
      nextra: {
        title: 'Nextra',
        href: 'https://nextra.site'
      },
      '---': {
        type: 'separator'
      },
    }
  },
  one: {
    type: 'menu',
    title: 'One',
    items: {
      '---': {
        type: 'separator'
      },
      bar: {
        title: 'One'
      },
      foo: {
        title: 'Foo'
      }
    }
  }
}
