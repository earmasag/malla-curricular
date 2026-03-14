import express from 'express';

const app = express();
// Usamos el puerto 3001 para que no choque con tu frontend de Vite (usualmente 5173)
const port = 3001; 

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '¡El backend de la malla curricular está vivo!' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});