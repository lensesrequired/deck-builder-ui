import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import Creator from './components/creator';
import Game from './components/game';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch, Route, useLocation, useHistory } from 'react-router-dom';

function useQuery() {
  console.log(useLocation());
  return new URLSearchParams(useLocation().search);
}

const AppRouter = () => (
  <Router>
    <App/>
  </Router>
);

const App = () => {
  const query = (useQuery() || new Map());
  const history = useHistory();
  const id = query.get('id') || '';

  const setId = (id) => {
    history.push(`/?id=${ id }`);
  };

  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Creator id={ id } setId={ setId }/>
        </Route>
        <Route path="/game">
          <Game id={ id }/>
        </Route>
      </Switch>
    </div>
  );
};

ReactDOM.render(<AppRouter/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
