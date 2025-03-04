import request from "supertest";
import { describe, it, expect } from "vitest";

describe("End-to-End tests for Express API", () => {
  beforeAll(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      async json() {
        return {
          mocks: [
            {
              method: "POST",
              path: "/person",
              responses: [
                {
                  in: "body",
                  where: {
                    id: 1,
                  },
                  response: {
                    id: "1",
                    name: "Jhon Doe",
                    age: "33",
                  },
                },
                {
                  in: "body",
                  where: {
                    id: 2,
                  },
                  response: {
                    id: "2",
                    name: "Jane Doe",
                    age: "28",
                  },
                },
                {
                  response: {
                    message:
                      "Respuesta por defecto, no se encontró coincidencia con 'where'",
                  },
                },
              ],
            },
            {
              method: "GET",
              path: "/videos/:id",
              responses: [
                {
                  in: "param",
                  where: {
                    id: 1,
                  },
                  response: {
                    id: 1,
                    name: "Mock testing",
                  },
                },
                {
                  in: "param",
                  where: {
                    id: 2,
                  },
                  response: {
                    id: 2,
                    name: "Playwrite testing",
                  },
                },
              ],
            },
            {
              method: "POST",
              path: "/settings/private",
              responses: [
                {
                  in: "body",
                  where: {
                    "user.id": 1,
                  },
                  response: {
                    id: 1,
                    name: "delete users",
                  },
                },
              ],
            },

            {
              method: "POST",
              path: "/status",
              responses: [
                {
                  status: "404",
                  response: {
                    error: "Not fount",
                  },
                },
              ],
            },
          ],
        };
      },
    });
  });

  const tests = [
    {
      method: "post",
      path: "/skapxd/bc-mocks-apis/settings/private",
      body: {
        user: {
          id: 1,
        },
      },
      expected: {
        id: 1,
        name: "delete users",
      },
    },
    {
      method: "get",
      path: "/skapxd/bc-mocks-apis/videos/1",
      expected: {
        id: 1,
        name: "Mock testing",
      },
    },
    {
      method: "get",
      path: "/skapxd/bc-mocks-apis/videos/2",
      expected: {
        id: 2,
        name: "Playwrite testing",
      },
    },
    {
      method: "post",
      path: "/skapxd/bc-mocks-apis/person",
      body: {
        id: 1,
      },
      expected: {
        id: "1",
        name: "Jhon Doe",
        age: "33",
      },
    },
    {
      method: "post",
      path: "/skapxd/bc-mocks-apis/person",
      body: {
        id: 2,
      },
      expected: {
        id: "2",
        name: "Jane Doe",
        age: "28",
      },
    },
    {
      method: "post",
      path: "/skapxd/bc-mocks-apis/status",
      status: 404,
      expected: {
        error: "Not fount",
      },
    },
  ];

  it.each(tests)(
    "Ejecutando el test $method $path $body",
    async ({ path, expected, method, body, status }) => {
      const { app } = await import(".");

      if (method === "get") {
        const response = await request(app).get(path);
        expect(response.body).toEqual(expected);
      }

      if (method === "post") {
        const response = await request(app).post(path).send(body);

        if (status != null) {
          expect(response.status).toBe(status);
        }
        expect(response.body).toEqual(expected);
      }
    }
  );
});
