import React, { useEffect, useCallback, useReducer, useMemo, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import PostImage from './../PostImage/PostImage';
import PostViewActions from './PostViewActions/PostViewActions';
import { ImageViewer } from './ImageViewer/ImageViewer';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import './PostView.css';

const postQuery = gql`
query post($id: ID!) {
  post(id: $id) {
    id
    width
    height
    previewWidth
    previewHeight
    sampleHeight
    previewUrl
    sampleUrl
    imageUrl
    tags {
      name
      type
    }
  }
}
`;

export const Action = {
  ToggleFitHeight: 3,
  ResetComponent: 4,
  EnterViewMode: 5,
  ToggleFullView: 6
}

function reducer(state, action) {
  switch (action.type) {
    case Action.ToggleFitHeight:
      return {
        ...state,
        fitHeight: !state.fitHeight,
        viewMode: state.enteredViewMode && state.fitHeight
      };

    case Action.EnterViewMode:
      return {
        ...state,
        viewMode: true,
        enteredViewMode: true,
        fitHeight: false
      };

    case Action.ToggleFullView:
      return {...state, fullView: !state.fullView};

    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
}

export default function PostView() {
  const {id} = useParams();
  const {loading, error, data} = useQuery(postQuery, {variables: {id}});
  /**
   * To avoid conflict with F key (which toggles 'fit image') when the user
   * types in the search bar, we will add or remove the F event handler depending
   * whether the user is "focusing" PostView or not.
   */
  const [focused, setFocused] = useState(true);
  const [stickActions, setStickActions] = useState(false);
  const [postViewport, setPostViewport] = useState();
  const [state, dispatch] = useReducer(reducer, {
    fitHeight: false,
    enteredViewMode: false,
    fullView: true,
    viewMode: false
  });
  const post = data ? data.post : null;
  const imageHeight = loading ? 0 : !state.fitHeight ? post.sampleHeight : window.innerHeight;

  const postViewportRef = useCallback((node) => node && setPostViewport(node), []);

  const handleOnScroll = useCallback(() =>  {
    // Image height + 96px (top of buttons is 100vh - 96px) - 36px of buttons height - 5px above bottom of image
    const maxHeight = imageHeight + 96 - 36 - 5;

    if (postViewport.scrollTop + postViewport.clientHeight >= maxHeight) {
      if (!stickActions) {
        setStickActions(true);
      }
    } else if (stickActions) {
      setStickActions(false);
    }
  }, [stickActions, imageHeight, postViewport]);

  useEffect(() => {
    function handleClick(ev) {
      setFocused(!!ev.target.closest('.PostView'));
    }

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    function handleKeydown(ev) {
      if (ev.code === 'KeyF') {
        dispatch({type: Action.ToggleFitHeight});
        handleOnScroll();
      } else if (ev.code === 'KeyV') {
        dispatch({type: Action.EnterViewMode});
      }
    }

    if (focused) {
      window.addEventListener('keydown', handleKeydown);
      return () => window.removeEventListener('keydown', handleKeydown);
    }
  }, [focused, handleOnScroll]);

  const imageViewer = useMemo(() => {
    if (state.enteredViewMode) {
      return (
        <div className="PostView__ImageViewer">
          <ImageViewer post={post} />
        </div>
      );
    }
    return ''
  }, [state.enteredViewMode, post]);

  if (loading || error) {
    return '';
  }

  return (
    <div className={clsx({
        'PostView': true,
        'PostView--viewMode': state.viewMode,
        'PostView--sampleView': !state.viewMode
      })}>

      <div
        ref={postViewportRef}
        className="PostView__viewport"
        onScroll={handleOnScroll}>
        <div
          className={clsx({
            'PostView__actions': true,
            'PostView__actions--stick': stickActions,
          })}
          style={{top: stickActions ? `calc(${imageHeight}px - 36px - 5px)` : null}}>
          <PostViewActions
            state={state}
            dispatch={dispatch} />
        </div>

        <div className="PostView__PostImage">
          <PostImage
            imageUrl={data.post.sampleUrl}
            parent={postViewport}
            fit={state.fitHeight} />
        </div>

        <div className="PostView__postInfo">
          <div className="PostView__tags">
            <h4>Tags</h4>
            <div className="PostView__tags__list">
              { data.post.tags.map(tag => (
                <Link to={`/posts?tags=${tag.name}`} key={`tag-${tag.name}`}>{tag.name}</Link>
              )) }
            </div>
          </div>
        </div>
      </div>

      { imageViewer }
    </div>
  );
}
