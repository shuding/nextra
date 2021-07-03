import remark from 'remark'

// Part of this script comes from the remark-embed-images project.
// https://github.com/remarkjs/remark-embed-images
let relative = /^\.{1,2}\//
function transformStaticNextImage() {
  function visit(node, type, handler) {
    if (node.type === type) {
      handler(node)
    }
    if (node.children) {
      node.children.forEach(n => visit(n, type, handler))
    }
  }

  return function transformer(tree, file, done) {
    const importsToInject = []

    visit(tree, 'image', visitor)
    tree.children.unshift(...importsToInject)
    done()

    function visitor(node) {
      const url = node.url

      if (url && relative.test(url)) {
        // Unique variable name for the given static image URL.
        const tempVariableName = `$nextraImage${importsToInject.length}`

        // Replace the image node with a MDX component node, which is the Next.js image.
        node.type = 'html'
        node.value = `<$NextImageNextra src={${tempVariableName}} alt="${
          node.alt || ''
        }" placeholder="blur" />`

        // Inject the static image import into the root node.
        importsToInject.push({
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: `import ${tempVariableName} from "${url}"`
            }
          ]
        })
      }
    }
  }
}

export function transformStaticImage(source) {
  return new Promise((resolve, reject) => {
    remark()
      .use(transformStaticNextImage)
      .process(
        'import $NextImageNextra from "next/image"\n' + source,
        (err, file) => {
          // console.log(file)
          if (err) return reject(err)
          return resolve(String(file))
        }
      )
  })
}
