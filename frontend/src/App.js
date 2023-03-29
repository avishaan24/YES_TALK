import './App.css';
import { Route } from "react-router-dom";
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" component={Homepage} exact/>
        <Route path="/chats" component={Chatpage} />
        {/* hello
        <a className="btn btn-primary"
              data-bs-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample">
          Bootstrap button
          </a> */}
      </div>
    </Router>
  );
}

export default App;
