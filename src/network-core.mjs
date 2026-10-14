export function statusOf(tx){return tx.statusName||tx.status_name||(typeof tx.status==='string'?tx.status:'UNKNOWN');}
export function executionOf(tx){const leaders=tx.consensus_data?.leader_receipt;const r=Array.isArray(leaders)?(leaders.findLast(x=>x.mode==='leader')||leaders.at(-1)):leaders;if(r?.execution_result==='SUCCESS'&&r?.result?.status==='return'&&!r?.genvm_result?.raw_error&&!r?.genvm_result?.error_code)return 'FINISHED_WITH_RETURN';return tx.txExecutionResultName||tx.genvm_result||r?.genvm_result||r?.execution_result||r?.result;}
export function requireSuccessfulFinality(tx){
 if(statusOf(tx)!=='FINALIZED')throw Error('Transaction is not finalized.');
 const execution=executionOf(tx);
 if(execution!=='FINISHED_WITH_RETURN'&&execution!==1)throw Error('Finalized transaction did not confirm successful execution.');
 return true;
}
export function parseCase(value){const c=typeof value==='string'?JSON.parse(value):value;if(!c||typeof c!=='object'||!Array.isArray(c.reviews)||!c.id)throw Error('Invalid contract case response.');return c;}
export async function transact({client,address,functionName,args,onHash,onState,retries=80,interval=3000}){
 const hash=await client.writeContract({address,functionName,args,value:0n,leaderOnly:false});
 if(typeof hash!=='string'||!/^0x[0-9a-f]{64}$/i.test(hash))throw Error('RPC did not return a valid transaction hash.');
 onHash?.(hash);return resume({client,hash,onState,retries,interval});
}
export async function resume({client,hash,onState,retries=80,interval=3000}){
 for(let i=0;i<retries;i++){
  const tx=await client.getTransaction({hash});const status=statusOf(tx);onState?.(status);
  if(status==='FINALIZED'){requireSuccessfulFinality(tx);return tx;}
  if(['CANCELED','UNDETERMINED','VALIDATORS_TIMEOUT','LEADER_TIMEOUT'].includes(status))throw Error('Network transaction ended with '+status+'.');
  await new Promise(r=>setTimeout(r,interval));
 }
 throw Error('Still pending. Keep the transaction hash and use Resume; do not resubmit.');
}
export function permittedAction(c,account,action){
 if(!account)return false;const who=account.toLowerCase();
 if(action==='accept')return who===c.brand.toLowerCase()&&!c.accepted;
 if(action==='submit')return who===c.brand.toLowerCase()&&c.accepted&&c.revision===c.reviewed_revision&&c.revision<20;
 if(action==='review')return c.accepted&&c.revision>c.reviewed_revision;
 return false;
}
