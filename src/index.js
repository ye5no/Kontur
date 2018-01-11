import React from 'react';
import { render } from 'react-dom';
import App from './App';

const renderApp = Component => {
  render(<Component />, document.getElementById('content'));
};

renderApp(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    import('./App').then((module) => {
      renderApp(module.default);
    });
  });
}