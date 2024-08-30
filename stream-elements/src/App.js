import logo from './logo.svg';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Route, Routes, Navigate } from 'react-router-dom';
import Character from './Components/Character'
import AdminPage from './Components/AdminPage';
import TwitchControlContext from './Components/TwitchControlContext';
import { useCallback, useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://127.0.0.1:8000";

function App() {

  // TODO: Save/Load this data from a json file
  // So that each session loads the real data
  // Not sure how streamlabs will know to reload tho

  // nevermind all that, it's websocket time
  const [connectionID, setConnectionID] = useState("");
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true,
  });
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
        dirty: false,
        rollDice: (diceKey) => {}
      }]);

    useEffect(() => {
      if (connectionID && readyState === ReadyState.OPEN) {
        sendJsonMessage({
          connectionID,
          type: "userevent",
        });
      }
    }, [connectionID, readyState]);

    useEffect(() => {
      if (connectionID && readyState === ReadyState.OPEN) {
        let isDataDirty = false;
        for (let i = 0; i < Object.keys(allCharacters).length; i++) {
          if(allCharacters[i].dirty) {
            allCharacters[i].dirty = false;
            isDataDirty = true;
          }
        }

        if (isDataDirty) {
          sendJsonMessage({type: "contentchange", content: allCharacters});
        }
      } else {
        console.log("Something went wrong with the ws connection! Or readystate problem at " + readyState);
      }
    }, [allCharacters]);

    useEffect(() => {
      console.log(`Got a new message: ${lastJsonMessage}`);
    }, [lastJsonMessage]);

    useEffect(() => {
      setConnectionID(uuidv4());
    }, []);

  return (
    <div className="WholeApp">
        <div className="Routes">
        <TwitchControlContext.Provider value={{allCharacters, setAllCharacters}}>
          <Routes>
            <Route path="/" exact element={<p>Nope.</p>} />
            <Route path="/Character1" element={<Character id="0"/>} />
            <Route path="/Admin" element={<AdminPage />} />
            <Route path="/Character2" element={<Character id="1"/>} />
            <Route path="/Character3" element={<Character id="2"/>} />
          </Routes>
        </TwitchControlContext.Provider>
        </div>
    </div>
  );
}

export default App;
