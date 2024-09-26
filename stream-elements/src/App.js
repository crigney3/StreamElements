import logo from './logo.svg';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminPage from './Components/AdminPage';
import Roll from './Components/Roll'
import Character from './Components/Character';
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
      sendContentMessage();
    }, [allCharacters]);

    useEffect(() => {
      setConnectionID(uuidv4());

      connection.current = new WebSocket(WS_URL);

      for (let i = 0; i < Object.keys(allCharacters).length; i++) {
        allCharacters[i].rollDice = sendRollMessage;
      }

      setTimeout(() => {  
        connection.current.addEventListener("message", (e) => {
          if (e.data !== "") {
            let incomingData = JSON.parse(e.data);
            console.log(incomingData.type);
            if (incomingData.type === "contentchange" || incomingData.type === "userevent") {
              // This is a very hacky fix but it'll do for now
              for (let i = 0; i < Object.keys(incomingData.content).length; i++) {
                incomingData.content[i].rollDice = sendRollMessage;
              }
              setAllCharacters(incomingData.content);
            } else if(incomingData.type === "rollEvent") {
              for (let i = 0; i < Object.keys(incomingData.content).length; i++) {
                incomingData.content[i].rollDice = sendRollMessage;
              }
              setServerDiceKey(incomingData.key);
              setServerRollResult(incomingData.content);
              setServerDiceCharacterId(incomingData.id);
            }
          }
        });

        connection.current.addEventListener("open", (e) => {
          console.log("WS Connection Established");
          connection.current.send(JSON.stringify({type: "userevent", content: 0}));
        });
      }, 5);

      return () => {
        if (connection.current.readyState === 1) {
          connection.current.close();
        }
      }
    }, []);

    const sendRollMessage = (diceKey, characterID) => {
      connection.current.send(JSON.stringify({type: "rollEvent", content: allCharacters[characterID].dice[diceKey], id: characterID, key: diceKey}));
    }

    const sendContentMessage = () => {
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
          let msgObject = JSON.stringify({type: "contentchange", content: allCharacters});
          connection.current.send(msgObject);
        }
      }
    }

  return (
    <div className="WholeApp">
        <div className="Routes">
        <TwitchControlContext.Provider value={{allCharacters, setAllCharacters, connection, serverRollResult, serverDiceKey, serverDiceCharacterId}}>
          <Router>
            <Routes>
              <Route path='/admin' element={<AdminPage />}/>
              <Route path='/Character1' element={<Character id={0} />}/>
              <Route path='/Roll1' element={<Roll id={0} />}/>
              <Route path='/Character2' element={<Character id={1} />}/>
              <Route path='/Roll2' element={<Roll id={1} />}/>
              <Route path='/Character3' element={<Character id={2} />}/>
              <Route path='/Roll3' element={<Roll id={2} />}/>
            </Routes>
          </Router>    
        </TwitchControlContext.Provider>
        </div>
    </div>
  );
}

export default App;
