import Main from "./components/Main/Main";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import View from './components/Editor/View';
import "./App.css"
import { NextUIProvider } from '@nextui-org/react';
import ViewFromFolder from "./components/Editor/ViewFromFolder";

const App = () => {
  return (
    <NextUIProvider>
      <div className="app">
        {
          <Router>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/page/:id" component={View} />
              <Route exact path="/folder/:folderid/:pageid" component={ViewFromFolder} />

            </Switch>
          </Router>
        }
      </div>
    </NextUIProvider>

  )
}

export default App