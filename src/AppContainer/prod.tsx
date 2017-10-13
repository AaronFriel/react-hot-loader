import React, { Component } from 'react'

import { IContainerProps, IContainerState } from './types'

export default class AppContainer<P> extends Component<IContainerProps<P>, IContainerState> {
  render() {
    if (this.props.component !== undefined) {
      if (this.props.props !== undefined) {
        return <this.props.component {...this.props.props} />
      } else {
        return <this.props.component/>
      }
    } else {
      return React.Children.only(this.props.children);
    }
  }
}
