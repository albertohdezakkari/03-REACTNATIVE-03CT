import { useEffect,useState } from 'react';
import { FlatList,Text,View } from 'react-native';
type Videojuego={id:number;titulo:string;plataforma:string;puntuacion:number;genero:string};
const API='http://TU_IP_LOCAL:3000';
export default function App(){
 const [datos,setDatos]=useState<Videojuego[]>([]);
 useEffect(()=>{fetch(API+'/videojuegos').then(r=>r.json()).then(setDatos)},[]);
 return <FlatList data={datos} keyExtractor={x=>String(x.id)} renderItem={({item})=><View><Text>{item.titulo}</Text><Text>{item.genero} · {item.plataforma}</Text></View>}/>;
}