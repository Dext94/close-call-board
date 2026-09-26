export const ROOMS = ['pnl','positions','price','flow','state'];
export const REFEREE = 'did:key:z6MkowHQwsx9xr84WbWN3YCnKutyBnBXkT1ChKY4uEAAMzte';
export const STALE_MS = 12 * 60 * 1000;
export const UNKNOWN = 'Not visible in the currently published Top feeds. The referee does not expose a complete per-DID ranking/balance lookup, so owner status, exact rank, position and balance cannot be inferred from this result.';
export const endpoint = type => `https://technocore.chat/r/d-close1-${type}?format=json&limit=5`;
export function decimal(s) {
  if (typeof s !== 'string' || !/^-?\d+(\.\d+)?$/.test(s) || s.length>100) throw Error('Invalid decimal');
  let [a,b=''] = s.split('.'); b=b.replace(/0+$/,''); a=BigInt(a).toString();
  const negative=s.startsWith('-');
  return (negative && a==='0' && b ? '-' : '')+a+(b?'.'+b:'');
}
export function compare(a,b) {
  a=decimal(a); b=decimal(b); const digits=Math.max((a.split('.')[1]||'').length,(b.split('.')[1]||'').length);
  const val=s=>BigInt(s.replace('.',''))*10n**BigInt(digits-(s.split('.')[1]||'').length);
  return val(a)>val(b)?1:val(a)<val(b)?-1:0;
}
export function groups(top) {
  const out=[];
  for(let i=0;i<top.length;) {
    let j=i+1; while(j<top.length && compare(top[i][1],top[j][1])===0) j++;
    out.push({start:i+1,end:j,count:j-i,score:top[i][1],rows:top.slice(i,j),boundary:j===top.length}); i=j;
  } return out;
}
export function validate(data,type) {
  if(!data || data.t!==type || !Number.isSafeInteger(data.n) || data.n<1) throw Error('Unexpected sweep schema');
  if(typeof data.file!=='string'||!/^[a-f0-9]{64}$/.test(data.file)) throw Error('Missing file hash');
  if(type==='pnl'||type==='positions') {
    if(!Array.isArray(data.top)) throw Error('Missing Top array');
    const seen=new Set();
    for(const row of data.top) {
      if(!Array.isArray(row)||row.length!==2||typeof row[0]!=='string'||!/^did:key:z[1-9A-HJ-NP-Za-km-z]+$/.test(row[0])||seen.has(row[0])) throw Error('Invalid or duplicate DID row');
      decimal(row[1]); seen.add(row[0]);
    }
    if(type==='pnl' && data.top.some((r,i)=>i && compare(data.top[i-1][1],r[1])<0)) throw Error('PnL feed is not descending');
  }
  if(type==='flow') for(const field of ['mints','settled','void','missed']) if(!Array.isArray(data[field])) throw Error('Invalid flow '+field);
  const count=x=>Number.isSafeInteger(x)&&x>=0;
  if(type==='state' && (!count(data.owners)||!count(data.rooms)||typeof data.root!=='string'||!/^[a-f0-9]{64}$/.test(data.root))) throw Error('Invalid state aggregates');
  if(type==='positions') {if(!count(data.longs)||!count(data.shorts)) throw Error('Invalid owner counts'); decimal(data.open);}
  if(type==='price') {decimal(data.ref?.px);if(!Number.isFinite(Date.parse(data.ref.time))||!Array.isArray(data.limits)||data.limits.length!==2)throw Error('Invalid price schema');data.limits.forEach(decimal);if(compare(data.limits[0],data.limits[1])>0)throw Error('Reversed price limits');}
  if(type==='pnl' && data.mark!==undefined) decimal(data.mark);
  if(type==='flow' && data.omitted!==undefined) {if(!data.omitted||typeof data.omitted!=='object'||Array.isArray(data.omitted)||Object.values(data.omitted).some(x=>!count(x)))throw Error('Invalid omitted counts');}
  return data;
}
export function decodeRoom(raw,type) {
  if(!raw || raw.room!==`d-close1-${type}` || !Array.isArray(raw.messages)) throw Error('Unexpected room envelope');
  const records=[],errors=[];
  for(const envelope of raw.messages) {
    try {
      const data=JSON.parse(envelope.text);
      if(data.t!==type) continue;
      validate(data,type);
      if(envelope.from!==REFEREE) throw Error('Unexpected referee DID');
      if(!Number.isFinite(Date.parse(envelope.ts)) || !Number.isSafeInteger(envelope.seq)) throw Error('Invalid envelope timestamp/sequence');
      records.push({data,envelope});
    } catch(e) {errors.push(e.message);}
  }
  records.sort((a,b)=>a.envelope.seq-b.envelope.seq);
  if(!records.length) throw Error(errors[0]||'No published sweep in this response');
  return {records,errors};
}
export function feedStatus(feed,now=Date.now()) {
  if(!feed?.data) return 'ERROR';
  const age=now-Date.parse(feed.envelope.ts);
  if(age>STALE_MS || age < -60000) return 'STALE';
  if(feed.error || feed.errors?.length) return 'PARTIAL';
  return 'LIVE';
}
export function compatible(a,b) {return !!a?.data && !!b?.data && a.data.n===b.data.n && a.data.file===b.data.file;}
export function observations(records) {
  const result=new Map();
  for(const [type,items] of Object.entries(records)) for(const item of items) {
    const found=new Set();
    function walk(v) {if(typeof v==='string' && /^did:key:z[1-9A-HJ-NP-Za-km-z]+$/.test(v)) found.add(v); else if(Array.isArray(v)) v.forEach(walk);else if(v && typeof v==='object') Object.values(v).forEach(walk);}
    walk(item.data);
    for(const did of found) {if(!result.has(did))result.set(did,[]);result.get(did).push({type,n:item.data.n,ts:item.envelope.ts});}
  } return result;
}
export function search(index,query) {const q=query.trim();return q?[...index].filter(([did])=>did.includes(q)):[];}
export async function verifyEnvelope(envelope,room) {
  const alphabet='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let n=0n;for(const c of REFEREE.slice(9)) {const x=alphabet.indexOf(c);if(x<0)throw Error('Invalid referee key');n=n*58n+BigInt(x);}
  const bytes=[];while(n>0n){bytes.unshift(Number(n%256n));n/=256n;}
  if(bytes.length!==34||bytes[0]!==0xed||bytes[1]!==1)throw Error('Unsupported referee key');
  const key=await crypto.subtle.importKey('raw',new Uint8Array(bytes.slice(2)),{name:'Ed25519'},false,['verify']);
  if(typeof envelope.sig!=='string'||!Number.isSafeInteger(envelope.nonce)) throw Error('Missing signature');
  const sig=Uint8Array.from(atob(envelope.sig.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
  return crypto.subtle.verify('Ed25519',key,sig,new TextEncoder().encode(`${room}|${envelope.nonce}|${envelope.text}`));
}
