import React, { useEffect } from 'react';
import dragScroll from './dragScroll';
import './PostImage.css';

export default function PostImage({ imageUrl, parent, style, fit, onImageLoad }) {
  useEffect(() => {
    if (parent) {
      const drag = dragScroll(parent.querySelector('.PostImage img'), parent);
      return () => drag.stop();
    }
  }, [parent]);

  const classes = ['PostImage'];
  if (fit) {
    classes.push('PostImage--fit');
  }

  return (
    <div className={classes.join(' ')} style={style}>
      <img
        alt={'Post'}
        src={imageUrl}
        draggable="false"
        onLoad={onImageLoad} />
    </div>
  );
}
