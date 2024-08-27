import './AdminPage.css'
import Character from './Character';
import UsernameControls from './UsernameControls';
import { useState, useEffect } from 'react'

const AdminPage = () => {

    const [allCharacters, setAllCharacters] = useState(null);

    const setupCharacters = () => {
        
    }

    useEffect(() => {
        setupCharacters();
    }, [])

    return (
        <div className='AdminPage'>
            <UsernameControls Characters={allCharacters} />
        </div>
    )
}

export default AdminPage;