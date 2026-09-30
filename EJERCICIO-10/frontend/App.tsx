// App.tsx — referencia CRUD del Full Stack Challenge.
// El reto del alumno es comprenderla y después introducir una mejora propia.
import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,TextInput,View } from 'react-native';

type Destino={
 id:number;ciudad:string;pais:string;descripcion:string;
 prioridad:string;visitado:boolean;
};
const API_URL='http://TU_IP_LOCAL:3000';

export default function App(){
 const [destinos,setDestinos]=useState<Destino[]>([]);
 const [ciudad,setCiudad]=useState('');
 const [pais,setPais]=useState('');

 async function cargar(){
   const r=await fetch(API_URL+'/destinos');
   setDestinos(await r.json());
 }
 useEffect(()=>{cargar();},[]);

 async function crear(){
   await fetch(API_URL+'/destinos',{
     method:'POST',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({
       ciudad,pais,descripcion:'Nuevo destino',
       prioridad:'MEDIA',visitado:false,
     }),
   });
   setCiudad('');setPais('');
   await cargar();
 }

 async function visitar(id:number){
   await fetch(API_URL+'/destinos/'+id,{
     method:'PATCH',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify({visitado:true}),
   });
   await cargar();
 }

 async function eliminar(id:number){
   await fetch(API_URL+'/destinos/'+id,{method:'DELETE'});
   await cargar();
 }

 return <SafeAreaView>
   <Text>🌍 Wander</Text>
   <TextInput placeholder="Ciudad" value={ciudad} onChangeText={setCiudad}/>
   <TextInput placeholder="País" value={pais} onChangeText={setPais}/>
   <Button title="Crear destino" onPress={crear}/>
   <FlatList data={destinos} keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View>
       <Text>{item.ciudad} · {item.pais}</Text>
       <Text>{item.prioridad} · {item.visitado?'Visitado':'Pendiente'}</Text>
       {!item.visitado && <Button title="Marcar visitado" onPress={()=>visitar(item.id)}/>}
       <Button title="Eliminar" onPress={()=>eliminar(item.id)}/>
     </View>}/>
 </SafeAreaView>;
}