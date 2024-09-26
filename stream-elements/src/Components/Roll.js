import './Roll.css'
import { useState, useEffect, useContext, useRef } from 'react'
import TwitchControlContext from './TwitchControlContext';

const dicePathStart = '/DiceShapes/d';
const dicePathEnd = 'Icon.png';

const Roll = ({
    id
}) => {

    const allCharacterInfo = useContext(TwitchControlContext).allCharacters;
    const setAllCharacterInfo = useContext(TwitchControlContext).setAllCharacters;
    const [tempCharInfo, setTempCharInfo] = useState({});

    let explosion = new Audio('/explosion.mp3');
    let tokenSpend = new Audio('/tokenSpend.mp3');
    const [currentValue, setCurrentValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [diceImagePath, setDiceImagePath] = useState('/DiceShapes/d4Icon.png');
    const rollResult = useContext(TwitchControlContext).serverRollResult;
    const rollResultKey = useContext(TwitchControlContext).serverDiceKey;
    const rollResultId = useContext(TwitchControlContext).serverDiceCharacterId;

    useEffect(() => {
        if (rollResultKey !== "" && rollResultId === id) {
            rollDie(rollResultKey);
        }   
    }, [rollResult])

    const rollDie = (diceKey) => {
        console.log("Rolling die for character " + allCharacterInfo[id].name + " with skill: " + diceKey + " and maxValue: " + allCharacterInfo[id].dice[diceKey]);
        animateDie(diceKey);
    }

    const animateDie = (diceKey) => { 
        setDiceImagePath(dicePathStart + allCharacterInfo[id].dice[diceKey].toString() + dicePathEnd);
        
        setIsActive(true);
        setIsRolling(true);

        let i = 0;
        let dieRollValue = 1;
        let interval = setInterval(() => {
            i++;
            dieRollValue = Math.floor(Math.random() * allCharacterInfo[id].dice[diceKey]) + 1;
            if (i > 30) {
                clearInterval(interval);

                setCurrentValue(rollResult);
                handleRollComplete(diceKey, rollResult);
            } else {
                setCurrentValue(dieRollValue);
            }
        }, 100);

        setIsRolling(false);
    }

    const handleRollComplete = (diceKey, dieRollValue) => {
        if((dieRollValue + allCharacterInfo[id].tokens) >= allCharacterInfo[id].dice[diceKey]) {
            let i = 0;
            let interval = setInterval(() => {
                i++;
                dieRollValue++;
                setCurrentValue(dieRollValue);
                allCharacterInfo[id].tokens--;
                tokenSpend.play();
                if(dieRollValue === allCharacterInfo[id].dice[diceKey]) {
                    clearInterval(interval);
                    checkForExplosion(diceKey, dieRollValue);
                }
            }, 1000);
        } else {
            checkForExplosion(diceKey, dieRollValue);
        }
    }

    const checkForExplosion = (diceKey, dieRollValue) => {
        if(dieRollValue === allCharacterInfo[id].dice[diceKey]) {
            let tempChars = allCharacterInfo;

            if (tempChars[id].dice[diceKey] !== 12 && 
                tempChars[id].dice[diceKey] !== 20) {
                
                tempChars[id].dice[diceKey] = tempChars[id].dice[diceKey] + 2;
                tempChars[id].dirty = true;
            } else if (tempChars[id].dice[diceKey] === 12) {
                tempChars[id].dice[diceKey] = 20;
                tempChars[id].dirty = true;
            } else if (tempChars[id].dice[diceKey] === 20) {
                // Nothing for now - maybe add a bigger explosion later?
            } else {
                throw new Error("Invalid die value! " + tempChars[id].dice[diceKey]);
            }

            if (tempChars[id].dirty === true) {
                console.log(tempChars);
                setTempCharInfo(tempChars);
            }

            explosion.play();
            let interval = setInterval(() => {
                console.log("exploded")
                allCharacterInfo[id].rollDice(diceKey, id);

                clearInterval(interval);
            }, 4000);
            
        }
    }

    return(
        <div className='RollBox'>
            {(isActive === true) && <div className='ActiveRollBox'>
                <img className='DiceImage' src={diceImagePath}></img>
                <p className='RollOutput'>{currentValue}</p>
            </div>}
        </div>
    )
}

export default Roll;