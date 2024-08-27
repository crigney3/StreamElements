import './AdminPage.css'
import Character from './Character';
import UsernameControls from './UsernameControls';
import { useState, useEffect, useContext, useMemo } from 'react'

const AdminPage = () => {

    

    const setupCharacters = () => {
        //setAllCharacters(["a", "b", "c"])
    }

    useEffect(() => {
        setupCharacters();
    }, [])

    return (
        
            <div className='AdminPage'>
                <UsernameControls />
                <Character id={0}/>
                <Character id={1}/>
                <Character id={2}/>
            </div>
        
    )
}

export default AdminPage;