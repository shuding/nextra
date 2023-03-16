import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

export interface HProperties {
  id?: string;
}

export const remarkHeaderIds: Plugin<[], Root> = function() {
  return (tree, _file, done) => {
    visit(tree, 'heading', node => {
      const lastChild = node.children[node.children.length - 1];
      if (lastChild && lastChild.type === 'text') {
        let string = lastChild.value.replace(/ +$/, '');
        const matched = string.match(/ \[#([^]+?)]$/);

        if (matched) {
          const id = matched[1];
          if (id.length) {
            node.data ||= {};
            node.data.hProperties ||= {} as HProperties;
            node.data.id = (node.data.hProperties as HProperties).id = id;

            string = string.slice(0, Math.max(0, matched.index ?? 0));
            lastChild.value = string;
          }
        }
      }
    })
    done()
  }
}
