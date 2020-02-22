import React, { useCallback, useState, useEffect } from 'react';
import './ImageNavigator.css'

export default function ImageNavigator({post, onNavigation, scrollPosition}) {
  const imageScale = post ? post.previewWidth / post.width : 0  ;
  const [img, setImg] = useState();
  const [cursorSize, setCursorSize] = useState({width: '0px', height: '0px'});

  const cursorPosition = {
    left: scrollPosition[0] * imageScale - parseFloat(cursorSize.width.match(/(\d+)/)) * .5,
    top: scrollPosition[1] * imageScale - parseFloat(cursorSize.height.match(/(\d+)/)) * .5
  };

  const imageRef = useCallback((node) => {
    if (node) {
      setImg(node)
    }
  }, []);

  useEffect(() => {
    if (!post) {
      return;
    }

    // Reset cursor style
    const imageScale = post.previewWidth / post.width;
    setCursorSize({
      width: `${Math.min(post.previewWidth, window.innerWidth * imageScale)}px`,
      height: `${Math.min(post.previewHeight, window.innerHeight * imageScale)}px`
    });
  }, [post]);

  function handleOnClick(ev) {
    window.addEventListener('mousemove', handleNavigation);
    window.addEventListener('mouseup', removeNavigationHandler);
    handleNavigation(ev);
  }

  function handleNavigation(ev) {
    const rect = img.getBoundingClientRect();
    const imageScale = post.width / post.previewWidth;

    const x = Math.min(
      Math.max((ev.pageX - rect.x) * imageScale, 0),
      post.width
    );

    const y = Math.min(
      Math.max((ev.pageY - rect.y) * imageScale, 0),
      post.height
    );

    onNavigation({x, y});
  }

  function removeNavigationHandler() {
    window.removeEventListener('mousemove', handleNavigation);
    window.removeEventListener('mouseup', removeNavigationHandler);
  }

  return (
    <div className="ImageNavigator" onMouseDown={handleOnClick} draggable="false">
      <div className="ImageNavigator__cursor" style={{...cursorSize, ...cursorPosition}} draggable="false"></div>
      <img ref={imageRef} alt={post.id} src={post.previewUrl} draggable="false" />
    </div>
  );
}
