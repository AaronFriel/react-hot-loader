import { IContainerProps, IContainerState } from './types';

import * as global from 'global';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import deepForceUpdate = require('react-deep-force-update');

export class AppContainer<P> extends React.Component<IContainerProps<P>, IContainerState> {
  public static propTypes = {
    children(props: any): any {
      if (React.Children.count(props.children) !== 1) {
        return new Error(
          'Invalid prop "children" supplied to AppContainer. ' +
            'Expected a single React element with your app’s root component, e.g. <App />.',
        );
      }

      return;
    },
    errorReporter: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]),
  };

  constructor(props: P) {
    super(props);
    this.state = { error: null };
  }

  public componentDidMount() {
    if (typeof global.__RLYEH__ === 'undefined') {
      console.error(
        'React Hot Loader: It appears that "rlyeh/lib/patch" ' +
          'did not run immediately before the app started. Make sure that it ' +
          'runs before any other code. For example, if you use Webpack, ' +
          'you can add "rlyeh/lib/patch" as the very first item to the ' +
          '"entry" array in its config. Alternatively, you can add ' +
          'require("rlyeh/lib/patch") as the very first line ' +
          'in the application code, before any other imports.',
      );
    }
  }

  public componentWillReceiveProps() {
    // Hot reload is happening.
    // Retry rendering!
    this.setState({
      error: null,
    });
    // Force-update the whole tree, including
    // components that refuse to update.
    deepForceUpdate(this);
  }

  public componentDidCatch(error: any) {
    this.setState({
      error,
    });
  }

  public render() {
    const { error } = this.state;

    if (this.props.errorReporter && error) {
      console.error(error);
      return <this.props.errorReporter error={error} />;
    } else if (error) {
      console.error(error);
    }

    return React.Children.only(this.props.children);
  }
}
