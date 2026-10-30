// Only queue non-sensitive drafts. Never put child notes, health or guardian data in browser storage.
const KEY='suraksha:pending-directory-actions';
export type PendingAction={id:string;kind:'directory-search-feedback';createdAt:string};
export function readPendingActions():PendingAction[]{try{return JSON.parse(localStorage.getItem(KEY)??'[]') as PendingAction[]}catch{return []}}
export function queueAction(action:PendingAction):void{localStorage.setItem(KEY,JSON.stringify([...readPendingActions(),action]))}
export function clearPendingActions():void{localStorage.removeItem(KEY)}
