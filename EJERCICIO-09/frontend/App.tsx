import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,View } from 'react-native';
type Evento={id:number;nombre:string;ciudad:string;categoria:string;fecha:string};
const API_URL='http://TU_IP_LOCAL:3000';
export default function App(){
 const [eventos,setEventos]=useState<Evento[]>([]);
 async function filtrar(){
   const url=API_URL+'/eventos?ciudad=Zaragoza&categoria=Tecnologia';
   const r=await fetch(url);setEventos(await r.json());
 }
 useEffect(()=>{filtrar();},[]);
 return <SafeAreaView><Text>🎟️ Event Radar</Text><Button title="Zaragoza · Tech" onPress={filtrar}/>
 <FlatList data={eventos} keyExtractor={x=>String(x.id)} renderItem={({item})=><View><Text>{item.nombre}</Text><Text>{item.ciudad} · {item.categoria}</Text></View>}/></SafeAreaView>;
}