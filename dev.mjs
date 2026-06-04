import app from './server.mjs';

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
