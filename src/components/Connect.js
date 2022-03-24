import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import './Connect.css'

export const Connect = () => {
  // get a function to connect to a particular wallet
  // options: useMetamask() - useCoinbase() - useWalletConnect()
  const connectWithMetamask = useMetamask();
  // once connected, you can get the connected wallet information from anywhere (address, signer)
  const address = useAddress();
  let simplifyAddress = "";

  if (address){
    console.log(address);
    const addressStr = '' + address;
    let firstSeven = "";
    let lastThree = "";
    if (addressStr.length > 5){
      firstSeven = addressStr.substring(0,7);
      lastThree = addressStr.substring(addressStr.length-3, addressStr.length)
    }
    simplifyAddress = `${firstSeven}...${lastThree}`;
  }
  return (
    <div >
      {address ? (
        <div className="Connected-Status">
          Connected as {simplifyAddress}
        </div>
      ) : (
        <button className="Connect-Button" onClick={connectWithMetamask}>
          Connect Metamask Wallet
        </button>
      )}
    </div>
  );
};