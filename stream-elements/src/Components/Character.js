import './Character.css'
import { useState, useEffect, useContext } from 'react'
import TwitchControlContext from './TwitchControlContext';

const dicePathStart = '/DiceShapes/d';
const dicePathEnd = 'Icon.png';

const Character = ({
    id
}) => {

    const allCharacterInfo = useContext(TwitchControlContext).allCharacters;
    const [ fullCharacterInfo, setFullCharacterInfo ] = useState(allCharacterInfo[id]);
    const setAllCharacterInfo = useContext(TwitchControlContext).setAllCharacters;
    const [tempCharInfo, setTempCharInfo] = useState({});
    const [charText, setCharText] = useState("");

    // Dice vars
    const explosion = useState(new Audio('/explosion.mp3'));
    const [currentValue, setCurrentValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [diceImagePath, setDiceImagePath] = useState('/DiceShapes/d4Icon.png');

    useEffect(() => {
        if(Object.keys(tempCharInfo).length !== 0) {
            setAllCharacterInfo(state => ({
                ...tempCharInfo
            }));
        }
    }, [tempCharInfo]);

    useEffect(() => {
        console.log("Starting character with " + id);

        setFullCharacterInfo(allCharacterInfo[id])

        setTempCharInfo(allCharacterInfo);

        allCharacterInfo[id].rollDice = rollDie;
    }, []);

    // Everything here and below is for rolling specifically, up until return
    const rollDie = (diceKey) => {
        console.log("Rolling die for character " + fullCharacterInfo.name + " with skill: " + diceKey + " and maxValue: " + fullCharacterInfo.dice[diceKey]);
        animateDie(diceKey);
    }

    const animateDie = (diceKey) => { 
        setDiceImagePath(dicePathStart + fullCharacterInfo.dice[diceKey].toString() + dicePathEnd);
        
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
                <p className='UsernameText'>{fullCharacterInfo.username}</p>
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
                        <img className='DiceImage' src={diceImagePath}></img>
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