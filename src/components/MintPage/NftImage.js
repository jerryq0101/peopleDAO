import { useEffect, useState } from 'react';
import { useEditionDrop } from '@thirdweb-dev/react';

const Nft = (props) => {
    const editionDrop = useEditionDrop(
      '0x1D3B6B23E8124E4934f1820A63225cbCdAA01f89'
    );
    const [nft, setNft] = useState('');
  
    async function fetchNft() {
      try {
        const nft = await editionDrop?.get(props.id);
        if (nft?.metadata.image) {
          setNft(nft?.metadata.image);
        }
      } catch (error) {
        console.log('Failed to get NFT. Error: ', error);
      }
    }
  
    useEffect(() => {
      fetchNft();
    }, []);
  
    return (
      <div>
        <img
          alt='Donation NFTs'
          src={nft}
          width='320px'
          height='568px'
          style={{ marginBottom: '1.8vh',
             }}
        />
      </div>
    );
  };
  
  export default Nft;