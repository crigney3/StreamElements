import logo from './logo.svg';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Character from './Components/Character'
import AdminPage from './Components/AdminPage';
import RollGraphic from './Components/Roll';

function App() {
  return (
    <div className="WholeApp">
        <div className="Routes">
          <Routes>
            <Route path="/" exact element={<p>Nope.</p>} />
            <Route path="/Character1" element={<Character id=""/>} />
            <Route path="/Admin" element={<AdminPage />} />
            <Route path="/Character2" element={<Character id=""/>} />
            <Route path="/Character3" element={<Character id=""/>} />
            <Route path="/Roll" element={<RollGraphic/>} />
          </Routes>
        </div>
    </div>
  );
}

export default App;
