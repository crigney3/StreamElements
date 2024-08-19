import './Character.css'
import useState from 'react'

const Character = ({
    id
}) => {

    const [dice, setDice] = useState(Map());
    const [tokens, setTokens] = useState(0);
    const [health, setHealth] = useState(0);
    const [maxHealth, setMaxHealth] = useState(0);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");

    // We don't keep the spoken text element here,
    // because that's from the TTS server

    return (
        <div className='CharacterBox'>
            <img className='CharacterIcon'></img>
            <div className='HealthBox'>
                <img className='HealthIcon'></img>
                <p className='HealthValue'>{health}</p>
            </div>
            <div className='TokenBox'>
                <img className='TokenIcon'></img>
                <p className='TokenValue'>{tokens}</p>
            </div>
        </div>
    )
}

export default Character;