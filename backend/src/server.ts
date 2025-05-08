import app from './app';
import { config } from './config/env';

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} em modo ${config.nodeEnv}`);
});