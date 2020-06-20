import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Main from './pages/Main';
import Register from './pages/Register';

function App() {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <Switch>
            <Route path="/register" component={Register} />
            <Route path="/" component={Main} />
          </Switch>
        </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
}

export default App;
