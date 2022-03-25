import {useState, useEffect} from 'react'
import Title from './Section1/Title.js'
import FundStatus from './Section1/FundStatus'
import Contribution from './Section1/Contribution'
import OurMission from './Section2/OurMission'
import logo from '../Logo.png'

export default function HomePage(props) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }, [])

    if (loading) {
        return (
            <div className="loader-container">
                <img src={logo} className="loader"></img>
            </div>
        )
    }
    
    return (
        <div class="Home-Page">
            <Title />
            <FundStatus exchangeRate={props.exchangeRate} ether={props.ether}/>
            {/* Contribution Portion */}
            <Contribution />

            {/* SecondPage */}
            <OurMission />
        </div>
    )
}