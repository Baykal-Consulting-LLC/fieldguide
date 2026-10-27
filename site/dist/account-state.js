import {STORAGE_KEY,sanitizeState} from './model.js?v=0.31.0';
import {SAVED_GUIDES_KEY} from './restart-guide.js?v=0.31.0';
export const BINDING_KEY='fieldguide-account-binding-v1';
export function accountKey(userId,key){return `fieldguide-account:${encodeURIComponent(userId)}:${key}`;}
export function scopedStorage(storage,getUserId){return {
 getItem(key){const id=getUserId();return storage.getItem(id?accountKey(id,key):key);},
 setItem(key,value){const id=getUserId();storage.setItem(id?accountKey(id,key):key,value);},
 removeItem(key){const id=getUserId();storage.removeItem(id?accountKey(id,key):key);}
};}
export function bundleFrom(state,storage){const raw=storage.getItem(SAVED_GUIDES_KEY);const history=raw?JSON.parse(raw):{version:1,guides:[]};if(history.version!==1||!Array.isArray(history.guides))throw Error('Saved guides could not be read.');return {version:1,draft:structuredClone(state),guides:history.guides};}
export function cleanBundle(bundle){if(bundle?.version!==1||bundle.draft?.version!==1||!Array.isArray(bundle.guides)||bundle.guides.length>100)throw Error('This saved guide cannot be read.');return {version:1,draft:sanitizeState(bundle.draft),guides:bundle.guides.map(g=>{if(typeof g?.id!=='string'||typeof g?.savedAt!=='string'||g.data?.version!==1)throw Error('A saved guide cannot be read.');return {id:g.id,savedAt:g.savedAt,data:sanitizeState(g.data)};})};}
export function installBundle(bundle,storage){const clean=cleanBundle(bundle);storage.setItem(SAVED_GUIDES_KEY,JSON.stringify({version:1,guides:clean.guides}));storage.setItem(STORAGE_KEY,JSON.stringify(clean.draft));return clean.draft;}
// Writes are serialized and use an optimistic revision. Stale writes never win.
export class SaveQueue {
 constructor({request,onStatus=()=>{}}){this.request=request;this.onStatus=onStatus;this.pending=null;this.running=null;this.revision=0;this.generation=0;this.blocked=false;}
 reset(revision=0){this.generation++;this.pending=null;this.revision=revision;this.blocked=false;}
 enqueue(bundle){this.pending=structuredClone(bundle);this.onStatus('unsaved');}
 async flush(){if(this.running){await this.running;if(this.pending&&!this.blocked)return this.flush();return;}if(!this.pending||this.blocked)return;
 const generation=this.generation;
 this.running=(async()=>{while(this.pending&&!this.blocked&&generation===this.generation){const bundle=this.pending;this.pending=null;this.onStatus('saving');try{const record=await this.request(bundle,this.revision);if(generation!==this.generation)return;this.revision=record.revision;this.onStatus(this.pending?'unsaved':'saved',record);}catch(error){if(generation!==this.generation)return;this.pending=this.pending||bundle;this.blocked=error.status===409||error.status===401;this.onStatus(error.status===409?'conflict':error.status===401?'expired':'offline');break;}}})();
 try{await this.running;}finally{this.running=null;}
 }
}
