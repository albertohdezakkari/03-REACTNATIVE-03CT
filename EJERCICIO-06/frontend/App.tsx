import { useEffect,useState } from 'react';
import { Alert,Button,FlatList,SafeAreaView,Text,View } from 'react-native';
type Libro={id:number;titulo:string;autor:string;genero:string;leido:boolean};
const API_URL='http://TU_IP_LOCAL:3000';
export default function App(){
 const [libros,setLibros]=useState<Libro[]>([]);const [error,setError]=useState('');
 async function cargar(){try{const r=await fetch(API_URL+'/libros');if(!r.ok)throw new Error();setLibros(await r.json());}catch{setError('No se pudieron cargar los libros.');}}
 useEffect(()=>{cargar();},[]);
 function confirmar(libro:Libro){Alert.alert('Eliminar libro',libro.titulo,[{text:'Cancelar',style:'cancel'},{text:'Eliminar',style:'destructive',onPress:()=>eliminar(libro.id)}]);}
 async function eliminar(id:number){try{const r=await fetch(API_URL+'/libros/'+id,{method:'DELETE'});if(!r.ok)throw new Error();setLibros(xs=>xs.filter(x=>x.id!==id));}catch{setError('No se pudo eliminar.');}}
 async function marcarLeido(id:number){try{const r=await fetch(API_URL+'/libros/'+id+'/leido',{method:'PATCH'});if(!r.ok)throw new Error();await cargar();}catch{setError('No se pudo marcar como leído.');}}
 return <SafeAreaView><Text>📚 My Library</Text>{error!==''&&<Text>{error}</Text>}
 <FlatList data={libros} keyExtractor={x=>String(x.id)} renderItem={({item})=><View><Text>{item.titulo} · {item.leido?'Leído':'Pendiente'}</Text>
 {!item.leido&&<Button title="Marcar leído" onPress={()=>marcarLeido(item.id)}/>}<Button title="Eliminar" onPress={()=>confirmar(item)}/></View>}/></SafeAreaView>;
}
