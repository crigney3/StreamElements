import './AdminPage.css'
import Character from './Character';
import CharacterController from './CharacterController';
import TwitchControlContext from './TwitchControlContext';
import { updateTwitchContext } from './TwitchControlContext';
import UsernameControls from './UsernameControls';
import { useState, useEffect, useContext, useMemo } from 'react'

const AdminPage = () => {

    //const allCharInfo = useContext(TwitchControlContext);
    const [charIDList, setCharIDList] = useState([0, 1, 2]);

    useEffect(() => {

    }, [])

    return (
        
            <div className='AdminPage'>
                <UsernameControls />
                <div className='CharacterGroups'>
                    {charIDList.map((_id) => 
                    <div className='CharacterBundle' key={_id}>
                        <CharacterController id={_id} />
                        <Character id={_id} />
                    </div>)}
                </div>
            </div>
        
    )
}

export default AdminPage;