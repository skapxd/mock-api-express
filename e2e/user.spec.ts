import request from "supertest";
import { describe, it, expect } from "vitest";

describe("Pruebas End-to-End: Validación del endpoint GET /api/users", () => {
  beforeAll(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      async json() {
        return {
          $schema:
            "https://raw.githubusercontent.com/skapxd/mock-api-express/refs/heads/main/mock.schema.json",
          mocks: [
            {
              method: "GET",
              path: "/api/users",
              responses: [
                {
                  status: "200",
                  response: {
                    data: [
                      {
                        id: 1,
                        name: "Ana",
                      },
                      {
                        id: 2,
                        name: "Luis",
                      },
                    ],
                  },
                },
              ],
            },
            {
              method: "GET",
              path: "/api/users/:id",
              responses: [
                {
                  in: "param",
                  where: {
                    id: 1,
                  },
                  status: "200",
                  response: {
                    data: [
                      {
                        id: 1,
                        name: "Ana",
                      },
                    ],
                  },
                },
                {
                  in: "param",
                  where: {
                    id: 2,
                  },
                  status: "200",
                  response: {
                    data: [
                      {
                        id: 2,
                        name: "Luis",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        };
      },
    });
  });

  it("Debería retornar la lista de usuarios con Ana y Luis", async () => {
    const { app } = await import("../src/index");

    const response = await request(app).get("/github-user/github-repo/api/users");

    expect(response.body).toEqual({
      data: [
        {
          id: 1,
          name: "Ana",
        },
        {
          id: 2,
          name: "Luis",
        },
      ],
    });
  });

  it("Debería retornar el usuario de Ana cuando se buscar por el id 1", async () => {
    const { app } = await import("../src/index");

    const response = await request(app).get("/github-user/github-repo/api/users/1");

    expect(response.body).toEqual({
      data: [
        {
          id: 1,
          name: "Ana",
        },
      ],
    });
  });

  it("Debería retornar el usuario de Luis cuando se buscar por el id 2", async () => {
    const { app } = await import("../src/index");

    const response = await request(app).get("/github-user/github-repo/api/users/2");

    expect(response.body).toEqual({
      data: [
        {
          id: 2,
          name: "Luis",
        },
      ],
    });
  });
});
