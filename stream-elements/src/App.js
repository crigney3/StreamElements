import logo from './logo.svg';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminPage from './Components/AdminPage';
import TwitchControlContext from './Components/TwitchControlContext';
import { useCallback, useState, useEffect, useRef } from 'react';
// import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://127.0.0.1:8000";

function App() {

  // nevermind all that, it's websocket time
  const [connectionID, setConnectionID] = useState("");
  const connection = useRef(null);
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
        },
        speakerText: "",
        dirty: false,
        rollDice: (diceKey) => {}
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
        },
        speakerText: "",
        dirty: false,
        rollDice: (diceKey) => {}
      }, 
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
        },
        speakerText: "",
        dirty: false,
        rollDice: (diceKey) => {}
      }]);

    useEffect(() => {
      if (connection.current === null) {
        return;
      }
      console.log(connection.current.readyState)
      if (connection.current.readyState === 1) {
        let isDataDirty = false;
        for (let i = 0; i < Object.keys(allCharacters).length; i++) {
          if(allCharacters[i].dirty) {
            allCharacters[i].dirty = false;
            isDataDirty = true;
          }
        }

        if (isDataDirty) {
          connection.current.send(JSON.stringify({type: "contentchange", content: allCharacters}));
        }
      }
    }, [allCharacters]);

    useEffect(() => {
      setTimeout(() => {
        connection.current.addEventListener("open", (e) => {
          console.log("WS Connection Established");
          connection.current.send(JSON.stringify({connectionID, type: "userevent"}));
        })
  
        connection.current.addEventListener("message", (e) => {
          if (e.data !== "") {
            setAllCharacters(JSON.parse(e.data));
          }
        })
      }, 5);

    }, [connection.current]);

    useEffect(() => {
      setConnectionID(uuidv4());

      connection.current = new WebSocket(WS_URL);

      return () => {
        if (connection.current.readyState === 1) {
          connection.current.close();
        }
      }
    }, []);

  return (
    <div className="WholeApp">
        <div className="Routes">
        <TwitchControlContext.Provider value={{allCharacters, setAllCharacters}}>
          <AdminPage />
        </TwitchControlContext.Provider>
        </div>
    </div>
  );
}

export default App;
