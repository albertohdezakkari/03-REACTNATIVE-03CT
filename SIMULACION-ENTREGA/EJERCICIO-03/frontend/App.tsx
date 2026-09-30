// Ficha conectada
fetch(API_URL+'/mascotas/1').then(r=>r.json()).then(setMascota); // muestra nombre, raza y nivelEnergia