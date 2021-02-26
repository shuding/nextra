
export default function (source, map) {
  this.cacheable()

  source = '/* @jsxRuntime classic */\n' + source

  this.callback(null, source, map)
}
