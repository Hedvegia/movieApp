import { createBrowserHistory } from 'history';
import * as React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Dashboard } from './screens/dashboard';

const history = createBrowserHistory();

export const App = () => {
    return (
        <Router history={history}>
            <Switch>
                <Route exact={true} path="/" component={Dashboard}/>
            </Switch>
        </Router>
    );
};
