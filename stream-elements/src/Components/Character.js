import './Character.css'
import { useState, useEffect, useContext } from 'react'
import TwitchControlContext from './TwitchControlContext';

const Character = ({
    id
}) => {

    const fullCharacterInfo = useContext(TwitchControlContext)[id];
    const [dice, setDice] = useState(new Map());
    const [tokens, setTokens] = useState(0);
    const [health, setHealth] = useState(0);
    const [maxHealth, setMaxHealth] = useState(0);
    const username = fullCharacterInfo.username;
    const [name, setName] = useState("");
    const [charText, setCharText] = useState("");

    //const connection = useRef(null);

    // We don't keep the spoken text element here,
    // because that's from the TTS server
    // or maybe it should because it's easier to change the username

    async function fetchText() {
        if(username === "") {
            return;
        }
        const response = await fetch("http://dionysus.headass.house:8000/get-text/" + encodeURIComponent(username) + "?username=" + encodeURIComponent(username));
        if (!response.ok) {
            console.log("Error encountered");
            return;
        }

        const json = await response.clone().json();

        console.log(json)
        if (json.Message === "") {
            console.log("No text received!")
        } else {
            setCharText(json.Message)
        }
    }

    useEffect(() => {
        console.log("Starting character with " + id);

        const interval = setInterval(() => {
            fetchText()   
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    // useEffect(() => {
    //     // Make a websocket to listen for text updates
    //     const charTextSocket = new WebSocket("http://dionysus.headass.house:8000/get-text/" + username);

    //     charTextSocket.addEventListener("open", event => {
    //         charTextSocket.send("Character " + name + " connection established");
    //     });

    //     charTextSocket.addEventListener("message", event => {
    //         console.log(event.data);

    //         if (event.data !== "") {
    //             setCharText(event.data);
    //         } else {
    //             console.log("Possible error or no messages sent yet");
    //         }
    //     });

    //     connection.current = charTextSocket;

    //     setCharText("Connected to " + username + "!");

    //     return () => connection.close();
    // }, []);

    return (
        <div className='CharacterBox'>
            <img className='CharacterIcon'></img>
            <p className='UsernameText'>{username}</p>
            <div className='HealthBox'>
                <img className='HealthIcon'></img>
                <p className='HealthValue'>{fullCharacterInfo.health}</p>
            </div>
            <div className='TokenBox'>
                <img className='TokenIcon'></img>
                <p className='TokenValue'>{fullCharacterInfo.tokens}</p>
            </div>
            <p className='CharacterText'>{charText}</p>
        </div>
    )
}

export default Character;