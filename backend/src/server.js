import app from './app.js';
import { setup } from './db.js';
import { PORT } from './config.js';

await setup();   // cria banco, tabelas e seed na primeira execução
app.listen(PORT, () => console.log(`VetDose API em http://localhost:${PORT}/api/farmacos`));
