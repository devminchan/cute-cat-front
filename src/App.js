import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Main from './pages/Main';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProvider from './context/UserProvider';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/" component={Main} />
            </Switch>
          </BrowserRouter>
        </SnackbarProvider>
      </UserProvider>
    </div>
  );
}

export default App;
