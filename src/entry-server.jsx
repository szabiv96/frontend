import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export function render(url, initialData) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App initialData={initialData} shouldBootstrapOnMount={false} />
      </StaticRouter>
    </React.StrictMode>
  );
}
