import './Roll.css'
import { useEffect, useState } from 'react'

const RollGraphic = () => {

    const [maxValue, setMaxValue] = useState(4);
    const [currentValue, setCurrentValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [explosion] = useState(new Audio('../../public/explosion.mp3'));

    const rollDie = (diceValue) => {
        setMaxValue(diceValue);

        animateDie();

        handleRollComplete();
    }

    const animateDie = () => {    
        setIsActive(true);
        setIsRolling(true);

        let i = 0;
        let interval = setInterval(() => {
            i++;
            setCurrentValue(Math.floor(Math.random() * maxValue) + 1);
            if (i > 30) {
                clearInterval(interval);
            }
        }, 100);

        setIsRolling(false);
    }

    const handleRollComplete = () => {
        if(currentValue === maxValue) {
            explosion.play();
        }

        setTimeout(() => {
            setIsActive(false);
            setCurrentValue(1);
            setMaxValue(4);
        }, 10000);
    }

    useEffect(() => {
        rollDie(2);
    }, []);

    return (
        <div className='RollBox'>
            {(isActive === true) && <div className='ActiveRollBox'>
                <img className='DiceImage'></img>
                <div className='RollOutput'><p>{currentValue}</p></div>
            </div>}
        </div>
    )
}

export default RollGraphic;