import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import Repository from './pages/Respository';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Main} exact />
                <Route path="/repository" component={Repository} />
            </Switch>
        </BrowserRouter>
    );
}