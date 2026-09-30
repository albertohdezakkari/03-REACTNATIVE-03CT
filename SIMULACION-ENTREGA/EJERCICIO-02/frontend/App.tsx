// React Native consume GET /peliculas y representa favorita con ♥/♡
const endpoint='/peliculas'; const renderFavorita=(favorita:boolean)=>favorita?'♥':'♡';