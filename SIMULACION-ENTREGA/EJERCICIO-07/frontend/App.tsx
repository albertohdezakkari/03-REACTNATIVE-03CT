// App.tsx — ejemplo de integración CRUD.
// Para mantener la pantalla legible, las operaciones se agrupan en funciones.
import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,View } from 'react-native';
type Sneaker={id:number;marca:string;modelo:string;precio:number;talla:number;stock:number};
const API_URL='http://TU_IP_LOCAL:3000';

export default function App(){
 const [items,setItems]=useState<Sneaker[]>([]);
 async function cargar(){const r=await fetch(API_URL+'/sneakers');setItems(await r.json());}
 useEffect(()=>{cargar();},[]);

 async function crear(){
   await fetch(API_URL+'/sneakers',{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({marca:'Nike',modelo:'Air Max 1',precio:149.99,talla:42,stock:4})});
   cargar();
 }
 async function agotar(id:number){
   await fetch(API_URL+'/sneakers/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({stock:0})});
   cargar();
 }
 async function eliminar(id:number){
   await fetch(API_URL+'/sneakers/'+id,{method:'DELETE'});
   cargar();
 }

 return <SafeAreaView><Text>👟 Sneaker Vault</Text><Button title="Nueva" onPress={crear}/>
 <FlatList data={items} keyExtractor={x=>String(x.id)} renderItem={({item})=>
 <View><Text>{item.marca} {item.modelo}</Text><Text>{item.stock===0?'AGOTADO':'Stock '+item.stock}</Text>
 <Button title="Agotar" onPress={()=>agotar(item.id)}/><Button title="Eliminar" onPress={()=>eliminar(item.id)}/></View>}/></SafeAreaView>;
}