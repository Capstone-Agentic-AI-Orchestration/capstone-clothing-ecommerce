/** @jest-environment node */

import { renderToString } from 'react-dom/server';
import { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';

import { App } from '../../src/App';

describe('React/Jest compatibility', () => {
  it('keeps React and React DOM on the exact same runtime version', () => {
    expect(reactDomVersion).toBe(reactVersion);
  });
});

describe('App', () => {
  it('renders the default title', () => {
    expect(renderToString(<App />)).toContain('Northline');
  });

  it('renders a custom title', () => {
    expect(renderToString(<App title="custom" />)).toContain('custom');
  });
});
