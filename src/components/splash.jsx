import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';

import logo from '../assets/catwalk.svg';

import './splash.css';

export default function Splash({
  docs = null,
  error = null,
  engineURL = '',
}) {
  let content;

  function updateEngineURL(url, appId) {
    let newURL = url;
    if (appId) {
      newURL = `${new URL(newURL).origin}${appId}`;
    }
    window.history.replaceState({}, '', `${window.location.pathname}?engine_url=${encodeURI(newURL)}`);
    window.location.reload(false);
  }

  const form = (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        updateEngineURL(evt.target[0].value);
      }}
    >
      <label htmlFor="engineURL">
        <input id="engineURL" type="text" defaultValue={engineURL} />
      </label>
      <input type="submit" value="Connect" />
    </form>
  );

  if (Array.isArray(docs) && docs.length) {
    content = (
      <div>
        <p>WebSocket connected, but no open app. Choose one below:</p>
        <ul className="doc-list">
          {docs.map(doc => (
            <li onClick={() => updateEngineURL(engineURL, doc.qDocId)} key={doc.qDocId}>
              <i className="icon" />
              <span className="title">
                {doc.qTitle}
                {' '}
(
                {doc.qMeta.description || 'No description'}
)
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (Array.isArray(docs)) {
    content = (
      <div>
        <p>WebSocket connected but no open app, in addition the app list was empty.</p>
        <p>Please make sure there are apps accessible on this engine and reload the page, or connect to another one:</p>
        {form}
      </div>
    );
  } else if (!engineURL || (error && error.target && error.target.constructor.name === 'WebSocket')) {
    content = (
      <div>
        <p>WebSocket connection failed. Please pass in a valid WebSocket URL below:</p>
        {form}
      </div>
    );
  } else if (error) {
    throw error;
  }

  if (content) {
    return (
      <div className="center-content">
        <div className="splash">
          <SVGInline className="logo" svg={logo} />
          {content}
        </div>
      </div>
    );
  }

  return null;
}

Splash.propTypes = {
  docs: PropTypes.array,
  error: PropTypes.object,
  engineURL: PropTypes.string,
};

Splash.defaultProps = {
  docs: null,
  error: null,
  engineURL: '',
};