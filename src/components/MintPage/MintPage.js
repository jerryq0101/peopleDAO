import {useEffect, useState} from 'react'
import { useAddress, useMetamask, useNFTDrop } from '@thirdweb-dev/react';
import { ClaimButton } from './ClaimButton';
import Nft from './NftImage';
import './MintPage.css';
import logo from '../Logo.png'


export default function MintPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500)
    }, [])

    if (loading) {
        return (
            <div className="loader-container">
                <img src={logo} className="loader"></img>
            </div>
        )
    }

    return (
        <div className="MintPage">
            <div className="2-NFT-First Mint-Item">
                <div className="NFT-Text">
                    <Nft id='1'/>
                    <div className="NFT-Title">
                        People_Passport
                    </div>
                    <div className="NFT-Desc">
                        Once you donated: Press button below to mint!
                    </div>
                    <ClaimButton req={0.000001} id='1'/>
                </div>
                
            </div>
            <div className="3-NFT-Second Mint-Item">
                <div className="NFT-Text">  
                    <Nft id='2'/>
                    <div className="NFT-Title">
                        Reverse_Passport
                    </div>
                    <div className="NFT-Desc">
                        Larger than 0.5 eth donations to mint!
                    </div>
                    <ClaimButton req={0.5} id='2' />
                </div>
                
            </div>
        </div>
    )
}