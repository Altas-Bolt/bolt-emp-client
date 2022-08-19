// Import Modules
import {
  MemoryRouter as Router,
  Route,
  Routes,
  useParams,
} from 'react-router-dom';

// Import Styles
import 'antd/dist/antd.css';
import './App.css';

// Import Routes
import Home from './windows/Home/Home';
import NewMinion from './windows/NewMinion/NewMinion';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newminion" element={<NewMinion />} />
      </Routes>
    </Router>
  );
}
