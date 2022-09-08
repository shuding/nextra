// https://gist.github.com/janily/04d7fb0861e053d4679b38743ffc05a7

import { Component } from 'react'
import { createPortal } from 'react-dom'

export class Shadow extends Component {
  componentDidMount() {
    if (this.shadowAttached) return
    this.shadowAttached = true
    this.shadowRoot = this.node.attachShadow({ mode: this.props.mode })
    this.forceUpdate()
  }

  render() {
    const { children, ...rest } = this.props
    return (
      <div {...rest} ref={node => (this.node = node)}>
        {this.shadowRoot && createPortal(children, this.shadowRoot)}
      </div>
    )
  }
}
