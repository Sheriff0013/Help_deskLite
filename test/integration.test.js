const request = require("supertest")
const app = 0

describe("Test d'intégration", () => {
  it("La page d'acceuildevrait renvoyer un status 200", async () => {
    const response = await request(app).get("/api/tickets")
    expect(response.status).toBe(200)
  })
})