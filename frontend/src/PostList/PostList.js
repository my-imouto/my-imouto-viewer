import React, { useMemo, useEffect, useState } from 'react';
import PostListItem from './PostListItem/PostListItem';
import { useLocation, useHistory } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import './PostList.css';

const postsQuery = gql`
query posts($first: Int!, $page: Int, $query: String) {
  posts(first: $first, page: $page, query: $query) {
    edges {
      node {
        id
        md5
        previewUrl
      }
    }
  }
}
`;

export default function PostList() {
  const limit = 25;
  const location = useLocation();
  const history = useHistory();

  const params = useMemo(() => {
    const params = new URLSearchParams(location.search);

    return {
      tags: (params.get('tags') || '').trim(),
      page: +(params.get('page')) || 0
    };
  }, [location.search]);

  const [tags, setTags] = useState(params.tags);
  const [page, setPage] = useState(params.page);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const { loading, data, fetchMore, networkStatus } = useQuery(
    postsQuery,
    {
      variables: {first: limit, page, query: tags},
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    }
  );
  const fetching = loading || networkStatus === 3;

  useEffect(() => {
    if (tags !== params.tags) {
      setTags(params.tags);
      setPage(0);
      setCanLoadMore(true);
    }
  }, [tags, params.tags]);

  function handleOnScroll(ev) {
    if (canLoadMore && !fetching && (ev.target.scrollHeight - ev.target.clientHeight) - ev.target.scrollTop < 150) {
      history.replace(`/posts?${params.tags ? `tags=${encodeURIComponent(params.tags)}&` : ''}page=${params.page + 1}`);

      fetchMore({
        variables: {
          first: limit,
          query: params.tags,
          page: params.page + 1
        },

        updateQuery: (prev, {fetchMoreResult}) => {
          if (fetchMoreResult.posts.edges.length < 25) {
            setCanLoadMore(false);
          }

          if (!fetchMoreResult.posts.edges.length) {
            return prev;
          }

          return {
            posts: {
              edges: prev ? prev.posts.edges.concat(fetchMoreResult.posts.edges) : []
            }
          };
        }
      });
    }
  }

  if (!data) {
    return '';
  }

  return (
    <div onScroll={handleOnScroll} className="PostList">
      <div className="PostList__items">
        { data.posts.edges.map(edge => <PostListItem key={'p-' + edge.node.id} post={edge.node}/>) }
      </div>
    </div>
  );
}
