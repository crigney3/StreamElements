import logo from './logo.svg';
import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import Character from './Components/Character'
import AdminPage from './Components/AdminPage';
import RollGraphic from './Components/Roll';
import TwitchControlContext from './Components/TwitchControlContext';
import { useState } from 'react'

function App() {

  const [allCharacters, setAllCharacters] = useState([
    {name: "a",
        tokens: 0,
        health: 3,
        maxHealth: 3,
        username: "",
        dice: {
            weapons: 4,
            brawl: 4,
            hot: 4,
            drive: 4,
            stunts: 4,
            wits: 4,
            tech: 4,
            tough: 4,
            sneak: 4
        }
    }, 
    {name: "b",
        tokens: 0,
        health: 3,
        maxHealth: 3,
        username: "",
        dice: {
            weapons: 4,
            brawl: 4,
            hot: 4,
            drive: 4,
            stunts: 4,
            wits: 4,
            tech: 4,
            tough: 4,
            sneak: 4
        }}, 
    {name: "c",
        tokens: 0,
        health: 3,
        maxHealth: 3,
        username: "",
        dice: {
            weapons: 4,
            brawl: 4,
            hot: 4,
            drive: 4,
            stunts: 4,
            wits: 4,
            tech: 4,
            tough: 4,
            sneak: 4
        }}]);

  return (
    <div className="WholeApp">
        <div className="Routes">
        <TwitchControlContext.Provider value={allCharacters}>
          <Routes>
            <Route path="/" exact element={<p>Nope.</p>} />
            <Route path="/Character1" element={<Character id="0"/>} />
            <Route path="/Admin" element={<AdminPage />} />
            <Route path="/Character2" element={<Character id="1"/>} />
            <Route path="/Character3" element={<Character id="2"/>} />
            <Route path="/Roll" element={<RollGraphic/>} />
          </Routes>
        </TwitchControlContext.Provider>
        </div>
    </div>
  );
}

export default App;
