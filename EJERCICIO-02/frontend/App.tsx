// App.tsx
// RESPONSABILIDAD: pedir la colección y mostrar una cartelera.
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Pelicula = {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
  favorita: boolean;
};

const API_URL = 'http://TU_IP_LOCAL:3000';

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPeliculas() {
      try {
        const respuesta = await fetch(API_URL + '/peliculas');

        if (!respuesta.ok) {
          throw new Error('La API no ha respondido correctamente');
        }

        const datos: Pelicula[] = await respuesta.json();
        setPeliculas(datos);
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa IP, puerto y backend.');
      } finally {
        setCargando(false);
      }
    }

    cargarPeliculas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎬 CineBox</Text>

      {cargando && <ActivityIndicator size="large" />}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {!cargando && error === '' && (
        <FlatList
          data={peliculas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.movie}>{item.titulo}</Text>
              <Text>{item.genero} · {item.anio}</Text>
              <Text>
                ⭐ {Number(item.puntuacion).toFixed(1)} {item.favorita ? '♥' : '♡'}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  title: { fontSize: 30, fontWeight: '800', marginBottom: 16 },
  card: { backgroundColor: '#FFF', padding: 18, borderRadius: 16, marginBottom: 12 },
  movie: { fontSize: 18, fontWeight: '700' },
  error: { color: '#B91C1C', marginTop: 20 },
});
