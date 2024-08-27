import TwitchControlContext from './TwitchControlContext';
import './UsernameControls.css'
import { useContext, useEffect, useState } from 'react'

const UsernameControls = (

) => {

    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const Characters = useContext(TwitchControlContext);
    const [characterSelections, setCharacterSelections] = useState([]);

    useEffect(() => {
        createCharacterItems()
    }, [])

    const createCharacterItems = () => {
        let chars = [];
        
        for (let i = 0; i < Characters.length; i++) {
            chars.push(<option key={Characters[i].name} value={Characters[i].name}>{Characters[i].name}</option>);
        }

        setCharacterSelections(chars);
    }

    const onCharacterSelect = (e) => {
        setSelectedCharacter(e.target.value);
    }

    const onSetClick = (e) => {
        const response = fetch("http://dionysus.headass.house:8000/set-username/?username=" + encodeURIComponent(usernameInput), {
            method: 'POST'
        });
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
            <button id="SetButton" onClick={onSetClick}>Set User as Character</button>
            <button id="RemoveButton" onClick={onRemoveClick}>Remove User as Character</button>
            <button id="ClearButton" onClick={onClearClick}>Clear All Users</button>
        </div>
    )
}

export default UsernameControls;