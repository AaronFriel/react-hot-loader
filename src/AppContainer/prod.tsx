import * as React from 'react';

import { IContainerProps, IContainerState } from './types';

export class AppContainer<P> extends React.Component<IContainerProps<P>, IContainerState> {
  public render() {
    if (this.props.component !== undefined) {
      if (this.props.props !== undefined) {
        return <this.props.component {...this.props.props} />;
      } else {
        return <this.props.component/>;
      }
    } else {
      return React.Children.only(this.props.children);
    }
  }
}
