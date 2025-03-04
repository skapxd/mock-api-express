import { evaluateWhereCondition } from "../evaluate-where-condition";
import { getSource } from "../get-source";

export const findResponse = (responses, req) => {
  // Primero, buscamos respuestas que tengan "where" e "in" y que cumplan todas las condiciones.
  for (const resp of responses) {
    if (!resp.where || !resp.in) continue;

    const exist = evaluateWhereCondition(resp.where, resp.in, req);
    if (exist) {
      return resp;
    }
  }

  // Si no se encontró ninguna respuesta específica, retornamos la primera que no tenga "where".
  return responses.find((resp) => !("where" in resp));
};
