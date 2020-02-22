import React from 'react';
import fullscreenSvg from './../../images/fullscreen-24px.svg';
import viewModuleSvg from './../../images/view_module-24px.svg';
import panoramaVertSvg from './../../images/panorama_vertical-24px.svg';
import { Action } from '../PostView';
import { Link } from 'react-router-dom';
import './PostViewActions.css';

export default function PostViewActions({dispatch}) {
  const titles = {
    showList: 'Go to index',
    fitHeight: 'Fit on screen (F)',
    viewLarge: 'View large version (V)'
  };

  return (
    <div className="PostViewActions">
      <Link to="/posts">
        <button title={titles.showList}>
          <img alt={titles.showList} src={viewModuleSvg} />
        </button>
      </Link>
      <button
        onClick={() => dispatch({type: Action.ToggleFitHeight})}
        title={titles.fitHeight}>
        <img alt={titles.fitHeight} src={panoramaVertSvg} />
      </button>
      <button
        onClick={() => dispatch({type: Action.EnterViewMode})}
        title={titles.viewLarge}>
        <img alt={titles.viewLarge} src={fullscreenSvg} />
      </button>
    </div>
  );
}
