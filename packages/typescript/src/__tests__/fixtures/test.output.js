import {Fragment as _Fragment, jsx as _jsx} from "react/jsx-runtime";
function _createMdxContent(props) {
  const _components = {
    p: "p",
    ...props.components
  }, {TypeTable} = _components;
  if (!TypeTable) _missingMdxReference("TypeTable", true);
  return _jsx(_Fragment, {
    children: _jsx(_Fragment, {
      children: _jsx(TypeTable, {
        type: {
          name: {
            "type": "string",
            "default": "Henry",
            description: _jsx(_Fragment, {
              children: _jsx(_components.p, {
                children: "The name of player"
              })
            })
          },
          age: {
            "type": "timestamp",
            "default": undefined
          }
        }
      })
    })
  });
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
