import { useEditionDrop, useMetamask, useAddress, useToken } from '@thirdweb-dev/react';
import { useEffect, useState } from 'react';
import './ClaimButton.css'

export const ClaimButton = (props) => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  const tokenContract = useToken("0x13531C50c086D5330E93D95B691EC2f88363cF61");
  const editionDrop = useEditionDrop('0x1D3B6B23E8124E4934f1820A63225cbCdAA01f89');
  const [balance, setBalance] = useState(0);

  useEffect(async () => {
    if (address) {
      const bal = await tokenContract.balanceOf(address);
      const numberForm = await bal.displayValue;
      setBalance(numberForm);
    }
    console.log(balance)
  }, [address])

  // State to track when a user is claiming an NFT
  const [claiming, setClaiming] = useState(false);

  // Claim our NFT with the claim method - (token id, quantity)
  const onClick = async () => {
    if (balance > props.req){
      setClaiming(true);
      try {
        await editionDrop?.claim(props.id, 1);
        alert('Successfully Claimed!');
        setClaiming(false);
      } catch (error) {
        alert('You Alreaedy Claimed :(');
        console.log('Failed to claim. Error: ', error);
        setClaiming(false);
      }

    } else {
      alert(`Donate ${props.req-balance} more Eth to Mint!`);
    }
  };

  return (
    <div>
      {address ? (
        <button
          disabled={claiming}
          className='Button-Style'
          onClick={onClick}
        >
          {claiming ? 'Minting...' : 'Mint'}

        </button>
      ) : (
        <button onClick={connectWithMetamask}>Connect MetaMask Wallet</button>
      )}
    </div>
  );
};