import { getSource } from "../get-source";

export const findResponse = (responses, req) => {
  // Primero, buscamos respuestas que tengan "where" e "in" y que cumplan todas las condiciones.
  for (const resp of responses) {
    if (!resp.where || !resp.in) continue;

    const sourceData = getSource(resp.in, req);
    const keys = Object.keys(resp.where);

    const every = (key: string) => {
      const one = sourceData[key];
      const two = resp.where[key];

      return `${one}` === `${two}`
    };

    if (keys.every(every)) {
      return resp;
    }
  }

  // Si no se encontró ninguna respuesta específica, retornamos la primera que no tenga "where".
  return responses.find((resp) => !("where" in resp));
};
