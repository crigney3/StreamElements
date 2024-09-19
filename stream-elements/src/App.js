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
  const [serverRollResult, setServerRollResult] = useState(0);
  const [serverDiceKey, setServerDiceKey] = useState("");
  const [serverDiceCharacterId, setServerDiceCharacterId] = useState(0);
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
        rollDice: undefined
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
        rollDice: undefined
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
        rollDice: undefined
      }]);

    useEffect(() => {
      if (connection.current === null) {
        return;
      }

      if (connection.current.readyState === 1) {
        let isDataDirty = false;
        for (let i = 0; i < Object.keys(allCharacters).length; i++) {
          if(allCharacters[i].dirty) {
            allCharacters[i].dirty = false;
            isDataDirty = true;
          }
        }

        if (isDataDirty) {
          console.log(allCharacters)
          connection.current.send(JSON.stringify({type: "contentchange", content: allCharacters}));
        }
      }
    }, [allCharacters]);

    // useEffect(() => {

    //   console.log("Connection updated")

    // }, [connection.current]);

    useEffect(() => {
      setConnectionID(uuidv4());

      connection.current = new WebSocket(WS_URL);

      setTimeout(() => {
        connection.current.addEventListener("open", (e) => {
          console.log("WS Connection Established");
          connection.current.send(JSON.stringify({connectionID, type: "userevent"}));
        })
  
        connection.current.addEventListener("message", (e) => {
          if (e.data !== "") {
            let incomingData = JSON.parse(e.data);

            if (incomingData.type === "contentchange") {
              setAllCharacters(incomingData);
            } else if(incomingData.type === "rollEvent") {
              setServerDiceKey(incomingData.key);
              setServerRollResult(incomingData.content);
              setServerDiceCharacterId(incomingData.id);
            }
          }
        })
      }, 5);

      allCharacters[0].rollDice = sendRollMessage;
      allCharacters[1].rollDice = sendRollMessage;
      allCharacters[2].rollDice = sendRollMessage;

      return () => {
        if (connection.current.readyState === 1) {
          connection.current.close();
        }
      }
    }, []);

    const sendRollMessage = (diceKey, characterID) => {
      connection.current.send(JSON.stringify({type: "rollEvent", content: allCharacters[characterID].dice[diceKey], id: characterID, key: diceKey}));
    }

  return (
    <div className="WholeApp">
        <div className="Routes">
        <TwitchControlContext.Provider value={{allCharacters, setAllCharacters, connection, serverRollResult, serverDiceKey, serverDiceCharacterId}}>
          <AdminPage />
        </TwitchControlContext.Provider>
        </div>
    </div>
  );
}

export default App;
