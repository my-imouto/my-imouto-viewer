import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import SearchBar from './SearchBar/SearchBar';
import PostView from './PostView/PostView';
import PostList from './PostList/PostList';
import './App.css';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <SearchBar />
          <Switch>
            <Route exact path="/">
              <Redirect to="/posts" />
            </Route>

            <Route path="/posts/:id">
              <PostView />
            </Route>

            <Route path="/posts">
              <PostList />
            </Route>
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
