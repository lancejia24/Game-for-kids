/** Rectangles in window coordinates, matching React Native measureInWindow and gesture moveX/moveY. */
export type Rectangle={x:number;y:number;width:number;height:number};
export type DropTarget={kind:'slot';index:number}|{kind:'tray'}|null;
export function contains(rect:Rectangle,x:number,y:number):boolean{
 return Number.isFinite(x)&&Number.isFinite(y)&&x>=rect.x&&x<=rect.x+rect.width&&y>=rect.y&&y<=rect.y+rect.height;
}
export function resolveDrop(x:number,y:number,slots:readonly (Rectangle|null)[],tray:Rectangle|null):DropTarget{
 const matches=slots.flatMap((rect,index)=>rect&&contains(rect,x,y)?[{index,distance:(x-(rect.x+rect.width/2))**2+(y-(rect.y+rect.height/2))**2}]:[]);
 if(matches.length){matches.sort((a,b)=>a.distance-b.distance);return {kind:'slot',index:matches[0].index};}
 return tray&&contains(tray,x,y)?{kind:'tray'}:null;
}
