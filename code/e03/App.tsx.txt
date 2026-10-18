import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';

type Mascota={id:number;nombre:string;raza:string;edad:number;ciudad:string;nivelEnergia:string};
const API_URL='http://TU_IP_LOCAL:3000';

export default function App(){
 const [mascota,setMascota]=useState<Mascota|null>(null);
 const [cargando,setCargando]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{(async()=>{
  try{
   const r=await fetch(API_URL+'/mascotas/1');
   if(!r.ok) throw new Error('HTTP '+r.status);
   setMascota(await r.json());
  }catch{setError('No se ha podido cargar la mascota. Revisa backend, IP y puerto.');}
  finally{setCargando(false);}
 })();},[]);
 if(cargando)return <ActivityIndicator size="large"/>;
 if(error)return <Text style={styles.error}>{error}</Text>;
 if(!mascota)return <Text>No hay datos.</Text>;
 return <SafeAreaView style={styles.container}><View style={styles.card}>
  <Text style={styles.emoji}>🐶</Text><Text style={styles.title}>{mascota.nombre}</Text>
  <Text>{mascota.raza}</Text><Text>{mascota.edad} años · {mascota.ciudad}</Text>
  <Text style={styles.energy}>⚡ {mascota.nivelEnergia}</Text>
 </View></SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,justifyContent:'center',padding:24,backgroundColor:'#EEF6FF'},card:{backgroundColor:'#FFF',padding:28,borderRadius:24,alignItems:'center'},emoji:{fontSize:56},title:{fontSize:28,fontWeight:'800'},energy:{marginTop:12,fontWeight:'700'},error:{color:'#B91C1C',padding:24}});
