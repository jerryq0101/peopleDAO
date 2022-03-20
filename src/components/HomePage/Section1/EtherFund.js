import React from 'react'
import './EtherFund.css'

export default function EtherFund(props) {
    const etherAmount = props.amount;

    return (
        <div className="Ether-Fund-box">
            <span className="Ether-Fund-Currency">{etherAmount}</span> 
            <div className="Ether-Fund-Spacing"></div>
            <span>Funded</span>
        </div>
    )
}