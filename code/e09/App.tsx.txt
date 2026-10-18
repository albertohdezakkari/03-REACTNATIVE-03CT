import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,View } from 'react-native';
type Evento={id:number;nombre:string;ciudad:string;categoria:string;fecha:string};const API_URL='http://TU_IP_LOCAL:3000';
export default function App(){
 const [eventos,setEventos]=useState<Evento[]>([]);const [error,setError]=useState('');
 async function filtrar(){try{const r=await fetch(API_URL+'/eventos?ciudad=Zaragoza&categoria=Tecnologia');if(!r.ok)throw new Error();setEventos(await r.json());setError('');}catch{setError('No se pudieron cargar los eventos.');}}
 useEffect(()=>{filtrar();},[]);
 return <SafeAreaView><Text>🎟️ Event Radar</Text>{error!==''&&<Text>{error}</Text>}<Button title="Zaragoza · Tech" onPress={filtrar}/>
 <FlatList data={eventos} keyExtractor={x=>String(x.id)} renderItem={({item})=><View><Text>{item.nombre}</Text><Text>{item.ciudad} · {item.categoria}</Text></View>}/></SafeAreaView>;
}
