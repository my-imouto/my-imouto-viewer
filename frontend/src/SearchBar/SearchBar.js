import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import './SearchBar.css';

const MouseYArea = 24;
const MouseXArea = 1336;

export default function SearchBar() {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [tags, setTags] = useState(queryParams.get('tags') || '');
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const tagsInput = useRef(null);

  function handleOnSubmit(ev) {
    ev.preventDefault();
    history.push(`/posts?tags=${ev.target.querySelector('input').value}`);
    ev.currentTarget.querySelector('input').blur();
  }

  useEffect(() => {
    function mouseOnTop(ev) {
      const minX = window.innerWidth * .5 - MouseXArea * .5;
      const maxX = window.innerWidth * .5 + MouseXArea * .5;

      if (!show && ev.y <= MouseYArea && ev.x >= minX && ev.x <= maxX) {
        setShow(true);
      } else if (show && ev.y > MouseYArea) {
        setShow(false);
      }
    }

    window.addEventListener('mousemove', mouseOnTop);
    return () => window.removeEventListener('mousemove', mouseOnTop);
  }, [show]);

  useEffect(() => {
    function listenS(ev) {
      if (!focused) {
        if (ev.code === 'KeyS') {
          tagsInput.current.click();
          tagsInput.current.focus();
          ev.preventDefault();
        }
      } else {
        if (ev.code === 'Escape') {
          tagsInput.current.blur();
        }
      }
    }

    window.addEventListener('keydown', listenS);
    return () => window.removeEventListener('keydown', listenS);
  }, [focused, tagsInput]);

  return (
    <div className={clsx({SearchBar: true, 'SearchBar-show': focused || show})}>
      <form onSubmit={handleOnSubmit}>
        <input
          ref={tagsInput}
          type="text"
          value={tags}
          className="SearchBar__input"
          placeholder="Enter tags to search"
          onChange={ev => setTags(ev.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)} />
      </form>
    </div>
  );
}
