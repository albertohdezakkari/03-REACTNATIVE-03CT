import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,TextInput,View } from 'react-native';
type Cancion={id:number;titulo:string;artista:string};type Playlist={id:number;nombre:string;canciones:Cancion[]};
const API_URL='http://TU_IP_LOCAL:3000';
export default function App(){
 const [playlist,setPlaylist]=useState<Playlist|null>(null);const [titulo,setTitulo]=useState('');const [artista,setArtista]=useState('');const [error,setError]=useState('');
 async function cargar(){try{const r=await fetch(API_URL+'/playlists/1');if(!r.ok)throw new Error();setPlaylist(await r.json());setError('');}catch{setError('No se pudo cargar la playlist.');}}
 useEffect(()=>{cargar();},[]);
 async function anadirCancion(){try{const r=await fetch(API_URL+'/playlists/canciones',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titulo,artista,playlistId:1})});if(!r.ok)throw new Error();setTitulo('');setArtista('');await cargar();}catch{setError('No se pudo añadir la canción.');}}
 if(error)return <Text>{error}</Text>;if(!playlist)return <Text>Cargando...</Text>;
 return <SafeAreaView><Text>🎵 {playlist.nombre}</Text><TextInput placeholder="Título" value={titulo} onChangeText={setTitulo}/><TextInput placeholder="Artista" value={artista} onChangeText={setArtista}/><Button title="Añadir canción" onPress={anadirCancion}/>
 <FlatList data={playlist.canciones} keyExtractor={x=>String(x.id)} renderItem={({item})=><View><Text>{item.titulo}</Text><Text>{item.artista}</Text></View>}/></SafeAreaView>;
}
