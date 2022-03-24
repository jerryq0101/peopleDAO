import { useAddress, useMetamask, useNFTDrop } from '@thirdweb-dev/react';

export const ClaimButton = () => {
  const connectWithMetamask = useMetamask();
  const nftDrop = useNFTDrop('0x1D3B6B23E8124E4934f1820A63225cbCdAA01f89');
  const address = useAddress();
  return (
    <div>
      {address ? (
        <button onClick={() => nftDrop?.claim(0)}>Claim ID 0</button>
      ) : (
        <button onClick={connectWithMetamask}>Connect Wallet</button>
      )}
    </div>
  );
};