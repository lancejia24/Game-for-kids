import Storage from 'expo-sqlite/kv-store';
import {restoreSession,serializeSession,type SavedSession} from '@wordpath/core';
import {STARTER_WORDS} from '../data/starterLessons';
const SESSION_KEY='wordpath:guest:session:v1';
let queued:Promise<void>=Promise.resolve();
export async function loadSession():Promise<SavedSession|null>{
 return restoreSession(await Storage.getItem(SESSION_KEY),STARTER_WORDS);
}
export function saveSession(session:SavedSession):Promise<void>{
 const payload=serializeSession(session);
 queued=queued.catch(()=>undefined).then(async()=>{await Storage.setItem(SESSION_KEY,payload);});
 return queued;
}
export async function clearGuestSession():Promise<void>{
 await queued.catch(()=>undefined);await Storage.removeItem(SESSION_KEY);
}
