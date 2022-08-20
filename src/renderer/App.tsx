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
import Dashboardlayout from './windows/Dashboard/layout/Dashboardlayout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboardlayout />} />
        <Route path="/newminion" element={<NewMinion />} />
        <Route path="/dashboard" element={<Dashboardlayout />} />
      </Routes>
    </Router>
  );
}
