import React from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';
import Top from './components/Top';
import Login from './components/Login';
import Register from './components/Register';
import SendMail from './components/SendMail';
import Form from './components/Form';
import List from './components/List';
import Single from './components/Single';
import SaveMail from './components/SaveMail';
import Program from './components/Program';
import Setting from './components/Setting';
import User from './components/User';
import Email from './components/Email';

const App =() => {
  return (
    <BrowserRouter>
      <>
        <Switch>
          <Route path="/" exact component={Top} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={Login} />
          <Route path="/mail" exact component={SendMail} />
          <Route path="/form" exact component={Form} />
          <Route path="/list" exact component={List} />
          <Route path="/single/:id" exact component={Single} />
          <Route path="/save" exact component={SaveMail} />
          <Route path="/program" exact component={Program} />
          <Route path="/setting" exact component={Setting} />
          <Route path="/user" exact component={User} />
          <Route path="/email" exact component={Email} />
        </Switch>
      </>
      </BrowserRouter>
  )
}

export default App;
