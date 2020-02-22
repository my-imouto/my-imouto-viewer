import React from 'react';
import { Link } from 'react-router-dom';
import './PostListItem.css';

export default function Post({ post }) {
  return (
    <div className="PostListItem">
      <Link to={`/posts/${post.id}`}>
        <img alt={'post-' + post.id} src={post.previewUrl} />
      </Link>
    </div>
  );
}
