import Storage from 'expo-sqlite/kv-store';
import {safeReadInstalledPacks,type InstalledAudioPack} from '@wordpath/core';
const INDEX_KEY='wordpath:audio:packs:v1';
/**
 * SQLite-backed inventory metadata ONLY. A future pack installer must
 * verify every local file's SHA-256 before inserting a record here.
 * An inventory entry by itself does not make a file available for playback.
 */
export async function readInstalledAudioPacks():Promise<InstalledAudioPack[]>{
 return safeReadInstalledPacks(await Storage.getItem(INDEX_KEY));
}
export async function clearAudioPackInventory():Promise<void>{
 await Storage.removeItem(INDEX_KEY);
}
