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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
