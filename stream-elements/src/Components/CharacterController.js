import TwitchControlContext from './TwitchControlContext';
import './CharacterController.css'
import { useContext, useEffect, useState } from 'react'

const CharacterController = (
    id
) => {
    const allCharacterInfo = useContext(TwitchControlContext).allCharacters;
    const setAllCharacterInfo = useContext(TwitchControlContext).setAllCharacters;
    const [tempCharInfo, setTempCharInfo] = useState(allCharacterInfo);
    const [ fullCharacterInfo, setFullCharacterInfo ] = useState(allCharacterInfo[id.id]);
    const [ charDiceElements, setcharDiceElements ] = useState([]);

    let tempChars;

    useEffect(() => {
        if(Object.keys(tempCharInfo).length !== 0) {
            setAllCharacterInfo(state => ({
                ...tempCharInfo
            }));
        }
    }, [tempCharInfo]);

    useEffect(() => {
        setFullCharacterInfo(allCharacterInfo[id.id]);

        createCharacterControls();
    }, [allCharacterInfo]);

    const createCharacterControls = () => {
        let charDice = [];
        
        let diceKeys = Object.keys(allCharacterInfo[id.id].dice);
        for (let i = 0; i < diceKeys.length; i++) {
            let item = allCharacterInfo[id.id].dice[diceKeys[i]];
            charDice.push(<div className='IndividualDieRow' key={id.id.toString() + i.toString()}>
                <p className='DiceLabel' >{diceKeys[i]}: {item}</p>
                <button className='RollDie' value={diceKeys[i]} onClick={handleDieRoll}>Roll {diceKeys[i]}</button>
                </div>);
        }
        setcharDiceElements(charDice);
    }

    const handleDieRoll = (e) => {
        fullCharacterInfo.rollDice(e.target.value, id.id);
    }

    const addToken = (e) => {
        tempChars = allCharacterInfo;
        tempChars[id.id].tokens += 1;
        tempChars[id.id].dirty = true;
        setTempCharInfo(tempChars);
    }

    const removeToken = (e) => {
        if (fullCharacterInfo.tokens <= 0) {
            return;
        }

        tempChars = allCharacterInfo;
        tempChars[id.id].tokens -= 1;
        tempChars[id.id].dirty = true;
        setTempCharInfo(tempChars);
    }

    const removeHealth = (e) => {
        if (fullCharacterInfo.health <= 0) {
            // Something special for dropping unconscious?
            return;
        }

        tempChars = allCharacterInfo;
        tempChars[id.id].health -= 1;
        tempChars[id.id].dirty = true;
        setTempCharInfo(tempChars);
    }

    const addHealth = (e) => {
        if (fullCharacterInfo.health >= fullCharacterInfo.maxHealth) {
            return;
        }

        tempChars = allCharacterInfo;
        tempChars[id.id].health += 1;
        tempChars[id.id].dirty = true;
        setTempCharInfo(tempChars);
    }

    const removeMaxHealth = (e) => {
        if (fullCharacterInfo.maxHealth <= 1) {
            return;
        }

        tempChars = allCharacterInfo;
        tempChars[id.id].maxHealth -= 1;
        tempChars[id.id].dirty = true;
        setTempCharInfo(tempChars);
    }

    const addMaxHealth = (e) => {
        tempChars = allCharacterInfo;
        tempChars[id.id].maxHealth += 1;
        tempChars[id.id].dirty = true;
        setTempCharInfo(tempChars);
    }

    return (
        <div className='CharacterController'>
            <div className='StatsBox'>
                <div className='TokenControlBox'>
                    <p className='TokenLabel'>Tokens: </p>
                    <button className='TokenMinusButton' onClick={removeToken}>-</button>
                    <button className='TokenPlusButton' onClick={addToken}>+</button>
                </div>
                <div className='CurrentHealth'>
                    <p className='CurrentHealthLabel'>CurrentHealth: </p>
                    <button className='HealthMinusButton' onClick={removeHealth}>-</button>
                    <button className='HealthPlusButton' onClick={addHealth}>+</button>
                </div>
                <div className='MaxHealth'>
                    <p className='CurrentMaxHealthLabel'>MaxHealth: </p>
                    <button className='MaxHealthMinusButton' onClick={removeMaxHealth}>-</button>
                    <button className='MaxHealthPlusButton' onClick={addMaxHealth}>+</button>
                </div>
            </div>
            <div className='DiceControls'>
                {charDiceElements}
            </div>
        </div>
    )
}

export default CharacterController;