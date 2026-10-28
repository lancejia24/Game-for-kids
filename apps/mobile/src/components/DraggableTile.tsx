import React,{useMemo,useRef} from 'react';
import {Animated,PanResponder,Pressable,StyleSheet,Text} from 'react-native';
type Props={tileId:string;letter:string;selected:boolean;size:number;onTap:(tileId:string)=>void;onDrop:(tileId:string,x:number,y:number)=>void};
export function DraggableTile({tileId,letter,selected,size,onTap,onDrop}:Props){
 const offset=useRef(new Animated.ValueXY()).current;
 const latest=useRef({onTap,onDrop});latest.current={onTap,onDrop};
 const gesture=useMemo(()=>PanResponder.create({
  onStartShouldSetPanResponder:()=>false,
  onMoveShouldSetPanResponder:(_event,g)=>Math.abs(g.dx)>7||Math.abs(g.dy)>7,
  onPanResponderGrant:()=>offset.setValue({x:0,y:0}),
  onPanResponderMove:(_event,g)=>offset.setValue({x:g.dx,y:g.dy}),
  onPanResponderRelease:(_event,g)=>{offset.setValue({x:0,y:0});latest.current.onDrop(tileId,g.moveX,g.moveY);},
  onPanResponderTerminate:()=>offset.setValue({x:0,y:0}),
  onPanResponderTerminationRequest:()=>false
 }),[offset,tileId]);
 return <Animated.View {...gesture.panHandlers} style={[styles.outer,{width:size,height:size,transform:offset.getTranslateTransform()}]}>
  <Pressable accessibilityRole="button" accessibilityLabel={'Letter '+letter+'. Tap to select or drag to an answer slot'} accessibilityState={{selected}} onPress={()=>latest.current.onTap(tileId)} style={[styles.tile,selected&&styles.selected]}>
   <Text style={styles.letter}>{letter}</Text>
  </Pressable>
 </Animated.View>;
}
const styles=StyleSheet.create({
 outer:{margin:2,zIndex:10,elevation:3},
 tile:{flex:1,justifyContent:'center',alignItems:'center',borderRadius:10,borderWidth:2,borderColor:'#7ca9d2',backgroundColor:'#d8ebff',minWidth:44,minHeight:44},
 selected:{backgroundColor:'#ffe0a1',borderColor:'#ab6b12'},
 letter:{fontSize:22,fontWeight:'800',color:'#153659'}
});
