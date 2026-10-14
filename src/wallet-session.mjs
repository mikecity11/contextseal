import {verifyMessage,stringToHex} from 'viem';
export const CHAIN_ID='0xf22f';
export async function signInWallet({provider,origin,nonce,now=new Date(),onStep=()=>{}}){
 if(!provider)throw Error('Open ContextSeal in an EVM wallet browser or install MetaMask to sign in.');
 onStep('Choose your wallet account');
 const accounts=await provider.request({method:'eth_requestAccounts'});
 const account=accounts?.[0];if(!/^0x[0-9a-f]{40}$/i.test(account||''))throw Error('No wallet account selected.');
 onStep('Switch to StudioNet');
 try{await provider.request({method:'wallet_switchEthereumChain',params:[{chainId:CHAIN_ID}]});}catch(e){if(e.code!==4902)throw e;await provider.request({method:'wallet_addEthereumChain',params:[{chainId:CHAIN_ID,chainName:'GenLayer StudioNet',nativeCurrency:{name:'GEN',symbol:'GEN',decimals:18},rpcUrls:['https://studio.genlayer.com/api'],blockExplorerUrls:['https://explorer-studio.genlayer.com']}]});await provider.request({method:'wallet_switchEthereumChain',params:[{chainId:CHAIN_ID}]});}
 const url=new URL(origin);const expires=new Date(now.getTime()+60*60*1000);
 const message=`${url.host} wants you to sign in with your Ethereum account:\n${account}\n\nSign in to ContextSeal on this device. This signature does not send a transaction or authorize spending.\n\nURI: ${url.origin}\nVersion: 1\nChain ID: 61999\nNonce: ${nonce}\nIssued At: ${now.toISOString()}\nExpiration Time: ${expires.toISOString()}`;
 onStep('Sign the sign-in message');
 const signature=await provider.request({method:'personal_sign',params:[stringToHex(message),account]});
 if(!await verifyMessage({address:account,message,signature}))throw Error('The signature does not match the selected wallet.');
 const current=await provider.request({method:'eth_accounts'});const chain=await provider.request({method:'eth_chainId'});
 if(current?.[0]?.toLowerCase()!==account.toLowerCase()||chain.toLowerCase()!==CHAIN_ID)throw Error('Wallet or network changed during sign-in. Please try again.');
 return {account,expiresAt:expires.getTime()};
}
export function walletError(error){return error.code===4001||error.code==='ACTION_REJECTED'?'Sign-in cancelled. You can try again when ready.':error.shortMessage||error.message||'Wallet sign-in failed.';}
