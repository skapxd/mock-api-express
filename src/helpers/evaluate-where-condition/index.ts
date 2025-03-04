import { getSource } from "../get-source";

// Función auxiliar que obtiene el valor anidado a partir de un objeto y una cadena en notación de punto
function getNestedValue(obj: any, path: string): any {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined),
      obj
    );
}

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
    const nestedValue = getNestedValue(source, key);
    return nestedValue == where[key];
  });
}
