import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  const teste = 1;

  const teste2 = teste + 1;

  return response.json(teste2);
});

export default routes;
