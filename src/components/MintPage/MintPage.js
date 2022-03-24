import React from 'react'
import { useAddress, useMetamask, useNFTDrop } from '@thirdweb-dev/react';
import { ClaimButton } from './ClaimButton';

export default function MintPage() {


    return (
        <div>
            <ClaimButton />
        </div>
    )
}