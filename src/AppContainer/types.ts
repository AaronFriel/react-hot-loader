import PropTypes from 'prop-types';
import React, { Component } from 'react';

export interface IContainerProps<P> {
  component?: React.ComponentType<P>;
  props?: P;
  children?: React.ReactNode;
  errorReporter?: React.ComponentType<IContainerState>;
}

export interface IContainerState {
  error: any;
}
