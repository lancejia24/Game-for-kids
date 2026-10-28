import type {Metadata} from 'next';
import {WebGame} from './web-game';
export const metadata:Metadata={title:'Play the spelling demo',description:'Try a free word-building and phonics preview with movable letters and saved guest progress.'};
export default function Play(){return <WebGame/>;}
