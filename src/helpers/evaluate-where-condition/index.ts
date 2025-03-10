import * as dotProp from "dot-prop";
import { getSource } from "../get-source";

export function evaluateWhereCondition(
  where: any,
  inValue: any,
  req: any
): boolean {
  // Si where o inValue son null/undefined/false, devolvemos false
  if (!where) return false;
  if (!inValue) return false;

  // Si where es un objeto vacío, devolvemos true
  if (Object.keys(where).length === 0) return true;

  // Obtenemos los datos desde la fuente (body, query, param, etc.)
  const source = getSource(inValue, req);

  // Verificamos que cada propiedad en where coincida con source usando comparación laxa (==)
  return Object.keys(where).every((key) => {
    // Usamos dot-prop para obtener el valor anidado desde source, soportando notación de punto
    const sourceValue = dotProp.getProperty(source, key);

    // Comparación laxa para permitir '1' == 1
    return sourceValue == where[key];
  });
}
