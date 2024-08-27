import './UsernameControls.css'
import { useState } from 'react'

const UsernameControls = (
    Characters = []
) => {

    const [selectedCharacter, setSelectedCharacter] = useState("");
    const [usernameInput, setUsernameInput] = useState("");

    const createCharacterItems = () => {
        let chars = [];
        for (let i = 0; i <= Characters.length; i++) {
            chars.push(<option key={i} value={Characters[i].name}>{Characters[i].name}</option>);
        }

        return chars;
    }

    const onCharacterSelect = (e) => {
        setSelectedCharacter(e.target.value);
    }

    const onSetClick = (e) => {
        const response = fetch("http://dionysus.headass.house:8000/set-username/", {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput
            })
        });

        if (!response.ok) {
            console.log("Error encountered");
            return;
        }
    }

    const onRemoveClick = (e) => {
        const response = fetch("http://dionysus.headass.house:8000/remove-username/", {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput
            })
        });

        if (!response.ok) {
            console.log("Error encountered");
            return;
        }
    }

    const onClearClick = (e) => {
        const response = fetch("http://dionysus.headass.house:8000/clear-usernames/", {
            method: 'POST'
        });

        if (!response.ok) {
            console.log("Error encountered");
            return;
        }
    }

    return (
        <div className='AllUsernameControls'>
            <input type="text" id="usernameInput" value={usernameInput} onInput={e => setUsernameInput(e.target.value)}></input>
            <select name="Characters" id='CharacterSelection' onChange={this.onCharacterSelect}>
                {this.createCharacterItems()}
            </select>
            <button id="SetButton" onClick={this.onSetClick}>Set User as Character</button>
            <button id="RemoveButton" onClick={this.onRemoveClick}>Remove User as Character</button>
            <button id="ClearButton" onClick={this.onClearClick}>Clear All Users</button>
        </div>
    )
}

export default UsernameControls;