import React from 'react'
import EtherFund from './EtherFund'
import './FundStatus.css'
import ProgressBar from './ProgressBar'

export default function FundStatus(props) {
    const etherAmount = props.ether;
    const dollarAmount = props.exchangeRate*etherAmount;
    const percentage = (etherAmount / 10) *100;
    return (
        <div className="Fund-Status">
            <div className="Fund-Progress">
                <ProgressBar done={percentage}/>
            </div>
            <div className="Fund-Money-Status">
                <EtherFund amount={"Ξ" +" "+ etherAmount}/>
                <div className="FundStatus-Gap"></div>
                <EtherFund amount={"$" + " " + dollarAmount}/>
            </div>
        </div>
    )
}