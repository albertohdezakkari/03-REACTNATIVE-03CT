// UI CRUD conectada: GET, POST, PATCH y DELETE. Si item.stock===0 muestra 'AGOTADO'.
const agotado=(stock:number)=>stock===0?'AGOTADO':'Stock '+stock;