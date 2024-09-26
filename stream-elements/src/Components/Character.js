import './Character.css'
import { useState, useEffect, useContext, useRef } from 'react'
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
    const characterTextRef = useRef(null);
    const characterContainerRef = useRef(null);
    const [charTextSize, setCharTextSize] = useState(30);

    useEffect(() => {
        if(Object.keys(tempCharInfo).length !== 0) {
            setAllCharacterInfo(state => ({
                ...tempCharInfo
            }));
        }
    }, [tempCharInfo]);

    useEffect(() => {
        console.log("Starting character with id of " + id);
        setTempCharInfo(allCharacterInfo);
    }, []);

    useEffect(() => {
        setCharTextSize(30);
        setCharText(allCharacterInfo[id].speakerText);
    }, [allCharacterInfo]);

    useEffect(() => {
        resize_to_fit();
    }, [charText]);

    useEffect(() => {
        if(characterTextRef.current.clientHeight >= characterContainerRef.current.clientHeight){
            resize_to_fit();
        }
    }, [charTextSize]);

    const resize_to_fit = () => {
        setCharTextSize(charTextSize - 1);
    }

    return (
        <div className='CharacterBox' >
            <img className='CharacterIcon'></img>

            <div className='CharacterNamesText'>
                <p className='UsernameText'>{allCharacterInfo[id].username}</p>
                <p className='AsText'>As</p>
                <p className='CharacterName'>{allCharacterInfo[id].name}</p>
            </div>

            <div className='CountBoxes'>
                <div className='HealthBox'>
                    <img className='HealthIcon' src='/DiceShapes/healthIcon.png'></img>
                    <p className='HealthValue'>{allCharacterInfo[id].health}</p>
                </div>
                <div className='TokenBox'>
                    <img className='TokenIcon' src='/DiceShapes/turboIcon.png'></img>
                    <p className='TokenValue'>{allCharacterInfo[id].tokens}</p>
                </div>
            </div>

            <div className='TextBoxController' ref={characterContainerRef}>
                <p className='CharacterText' ref={characterTextRef} style={{fontSize:charTextSize}}>{charText}</p>   
            </div>           
        </div>
    )
}

export default Character;