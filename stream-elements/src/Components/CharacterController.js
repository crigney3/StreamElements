import TwitchControlContext from './TwitchControlContext';
import './UsernameControls.css'
import { useContext, useEffect, useState } from 'react'

const CharacterController = (
    id
) => {
    const allCharacterInfo = useContext(TwitchControlContext).allCharacters;
    const setAllCharacterInfo = useContext(TwitchControlContext).setAllCharacters;
    const [tempCharInfo, setTempCharInfo] = useState({});
    const [ fullCharacterInfo, setFullCharacterInfo ] = useState(allCharacterInfo[id.id]);
    const [ charControlElements, setCharControlElements ] = useState([]);

    useEffect(() => {
        setAllCharacterInfo(state => ({
            ...state,
            tempCharInfo
        }));

        setFullCharacterInfo(allCharacterInfo[id.id])
    }, [tempCharInfo]);

    useEffect(() => {
        createCharacterControls();
    }, []);

    useEffect(() => {
        createCharacterControls();
    }, [allCharacterInfo]);

    const createCharacterControls = () => {
        let chars = [];
        
        let diceKeys = Object.keys(fullCharacterInfo.dice);
        for (let i = 0; i < diceKeys.length; i++) {
            let item = fullCharacterInfo.dice[diceKeys[i]];
            chars.push(<div className='IndividualDieRow' key={id.id.toString() + i.toString()}>
                <p className='DiceLabel' >{diceKeys[i]}: {item}</p>
                <button className='RollDie' value={diceKeys[i]} onClick={handleDieRoll}>Roll {diceKeys[i]}</button>
                </div>);
        }

        setCharControlElements(chars);
    }

    const handleDieRoll = (e) => {
        fullCharacterInfo.rollDice(e.target.value);
    }

    return (
        <div className='CharacterController'>
            <div className='DiceControls'>
                {charControlElements}
            </div>
        </div>
    )
}

export default CharacterController;