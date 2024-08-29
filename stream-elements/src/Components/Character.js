import './Character.css'
import { useState, useEffect, useContext } from 'react'
import TwitchControlContext from './TwitchControlContext';

const Character = ({
    id
}) => {

    const allCharacterInfo = useContext(TwitchControlContext).allCharacters;
    const [ fullCharacterInfo, setFullCharacterInfo ] = useState(allCharacterInfo[id]);
    const setAllCharacterInfo = useContext(TwitchControlContext).setAllCharacters;
    const [tempCharInfo, setTempCharInfo] = useState({});
    const [dice, setDice] = useState(new Map());
    const [tokens, setTokens] = useState(0);
    const [health, setHealth] = useState(0);
    const [maxHealth, setMaxHealth] = useState(0);
    const [ username, setUsername ] = useState(fullCharacterInfo.username);
    const [name, setName] = useState("");
    const [charText, setCharText] = useState("");

    // Dice vars
    const explosion = useState(new Audio('../../public/explosion.mp3'));
    const [currentValue, setCurrentValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [isActive, setIsActive] = useState(false);

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
        console.log("Character " + id.toString() + " reloading data");
        setFullCharacterInfo(allCharacterInfo[id]);
        setUsername(allCharacterInfo[id].username);
        setDice(allCharacterInfo[id].dice);
        setTokens(allCharacterInfo[id].tokens);
        setHealth(allCharacterInfo[id].health);
        setMaxHealth(allCharacterInfo[id].maxHealth);
        setName(allCharacterInfo[id].name);
    }, [allCharacterInfo])

    useEffect(() => {
        console.log("Starting character with " + id);

        allCharacterInfo[id].rollDice = rollDie;

        const interval = setInterval(() => {
            // Not only is this horrendously inefficient, it also doesn't work sometimes.
            // I'd accept inefficiency for the mvp but I need to make it work consistently
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

    // Everything here and below is for rolling specifically, up until return
    const rollDie = (diceKey) => {
        console.log("Rolling die for character " + fullCharacterInfo.name + " with skill: " + diceKey + " and maxValue: " + fullCharacterInfo.dice[diceKey]);
        animateDie(diceKey);
    }

    const animateDie = (diceKey) => {    
        setIsActive(true);
        setIsRolling(true);

        let i = 0;
        let dieRollValue = 1;
        let interval = setInterval(() => {
            i++;
            dieRollValue = Math.floor(Math.random() * fullCharacterInfo.dice[diceKey]) + 1;
            setCurrentValue(dieRollValue);
            if (i > 30) {
                clearInterval(interval);

                handleRollComplete(diceKey, dieRollValue);
            }
        }, 100);

        setIsRolling(false);
    }

    const handleRollComplete = (diceKey, dieRollValue) => {
        if(dieRollValue === fullCharacterInfo.dice[diceKey]) {
            //explosion.play();

            let tempChars = allCharacterInfo;
            if (tempChars[id].dice[diceKey] !== 12 || 
                tempChars[id].dice[diceKey] !== 20) {
                
                tempChars[id].dice[diceKey] = tempChars[id].dice[diceKey] + 2;
            } else if (tempChars[id].dice[diceKey] === 12) {
                tempChars[id].dice[diceKey] = 20;
            } else if (tempChars[id].dice[diceKey] === 20) {
                // Nothing for now - maybe add a bigger explosion later?
            } else {
                throw new Error("Invalid die value! " + tempChars[id].dice[diceKey]);
            }
            setTempCharInfo(tempChars);

            rollDie(diceKey);
        }

        setTimeout(() => {
            setIsActive(false);
            setCurrentValue(1);
        }, 10000);
    }

    return (
        <div className='CharacterBox'>
            <img className='CharacterIcon'></img>

            <div className='CharacterNamesText'>
                <p className='UsernameText'>{username}</p>
                <p className='AsText'>As</p>
                <p className='CharacterName'>{fullCharacterInfo.name}</p>
            </div>

            <div className='CountBoxes'>
                <div className='HealthBox'>
                    <img className='HealthIcon'></img>
                    <p className='HealthValue'>{fullCharacterInfo.health}</p>
                </div>
                <div className='RollBox'>
                    {(isActive === true) && <div className='ActiveRollBox'>
                        <img className='DiceImage'></img>
                        <p className='RollOutput'>{currentValue}</p>
                    </div>}
                </div>
                <div className='TokenBox'>
                    <img className='TokenIcon'></img>
                    <p className='TokenValue'>{fullCharacterInfo.tokens}</p>
                </div>
            </div>

            <p className='CharacterText'>{charText}</p>   
        </div>
    )
}

export default Character;