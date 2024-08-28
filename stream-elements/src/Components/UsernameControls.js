import TwitchControlContext from './TwitchControlContext';
import './UsernameControls.css'
import { useContext, useEffect, useState } from 'react'

const UsernameControls = (

) => {

    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const Characters = useContext(TwitchControlContext).allCharacters;
    const [characterSelections, setCharacterSelections] = useState([]);
    const setAllCharacterInfo = useContext(TwitchControlContext).setAllCharacters;
    const [tempCharInfo, setTempCharInfo] = useState({});

    useEffect(() => {
        createCharacterItems();
    }, []);

    useEffect(() => {
        setAllCharacterInfo(state => ({
            ...state,
            tempCharInfo
        }));
    }, [tempCharInfo]);

    const createCharacterItems = () => {
        let chars = [];
        
        for (let i = 0; i < Characters.length; i++) {
            chars.push(<option key={i} value={i}>{Characters[i].name}</option>);
        }

        setCharacterSelections(chars);

        setSelectedCharacter(chars[0].key);
    }

    const onCharacterSelect = (e) => {
        console.log(e.target.value);
        setSelectedCharacter(e.target.value);
    }

    const onSetClick = (e) => {
        const response = fetch("http://dionysus.headass.house:8000/set-username/?username=" + encodeURIComponent(usernameInput), {
            method: 'POST'
        });

        let tempChars = Characters;
        tempChars[selectedCharacter].username = usernameInput;
        setTempCharInfo(tempChars);
        console.log(tempCharInfo);
    }

    const onRemoveClick = (e) => {
        const response = fetch("http://dionysus.headass.house:8000/remove-username/?username=" + encodeURIComponent(usernameInput), {
            method: 'POST'
        });
    }

    const onClearClick = (e) => {
        const response = fetch("http://dionysus.headass.house:8000/clear-usernames/", {
            method: 'POST'
        });
    }

    return (
        <div className='AllUsernameControls'>
            <input type="text" id="usernameInput" value={usernameInput} onInput={e => setUsernameInput(e.target.value)}></input>
            <select name="Characters" id='CharacterSelection' onChange={onCharacterSelect}>
                {characterSelections}
            </select>
            <div className='UserServerControllers'>
                <button id="SetButton" onClick={onSetClick}>Set User as Character</button>
                <button id="RemoveButton" onClick={onRemoveClick}>Remove User as Character</button>
                <button id="ClearButton" onClick={onClearClick}>Clear All Users</button>
            </div>
        </div>
    )
}

export default UsernameControls;