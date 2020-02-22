import React, { useCallback, useReducer, useEffect } from 'react';
import ImageNavigator from '../ImageNavigator/ImageNavigator';
import PostImage from '../../PostImage/PostImage';
import './ImageViewer.css';

const Action = {
  SetViewport: 0,
  SetScrollPosition: 1,
  SetLastPostId: 2,
  ImageLoaded: 3
}

function reducer(state, action) {
  switch (action.type) {
    case Action.SetViewport:
      return {...state, viewport: action.value};

    case Action.SetScrollPosition:
      return {...state, scrollPosition: action.value};

    case Action.SetLastPostId:
      return {...state, lastPostId: action.value};

    case Action.ImageLoaded:
      return {...state, imageLoaded: true};

    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
}

export function ImageViewer({ post }) {
  const [state, dispatch] = useReducer(reducer, {
    viewport: null,
    scrollPosition: [0, 0],
    lastPostId: null,
    imageLoaded: false
  });

  const viewportRef = useCallback((node) => {
    if (node) {
      function handleScroll(ev) {
        dispatch({type: Action.SetScrollPosition, value: [ev.target.scrollLeft, ev.target.scrollTop]});
      }

      node.addEventListener('scroll', handleScroll);

      dispatch({type: Action.SetViewport, value: node});

      return () => node.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (post && state.viewport) {
      state.viewport.scrollTo(
        post.width > window.innerWidth ? window.innerWidth * .5 : post.width * .5,
        window.innerHeight * .5);
    }
  }, [post, state.viewport]);

  function handleOnNavigation(position) {
    state.viewport.scrollTo(position.x, position.y)
  }

  const viewportStyle = {
    width: `${post.width}px`,
    height: `${post.height}px`
  };

  return (
    <div className="ImageViewer">
      <div ref={viewportRef} className="ImageViewer__image">
        {
          state.viewport &&
            <div className="ImageViewer__PostImage"
            style={viewportStyle}>
              <PostImage
                imageUrl={post.imageUrl}
                parent={state.viewport} />
            </div>
        }
      </div>

      <div className="ImageViewer__ImageNavigator">
        <ImageNavigator
          post={post}
          onNavigation={handleOnNavigation}
          scrollPosition={state.scrollPosition} />
      </div>
    </div>
  );
}
