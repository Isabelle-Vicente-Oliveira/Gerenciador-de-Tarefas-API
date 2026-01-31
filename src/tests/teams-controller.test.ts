import { app } from "@/app"
import { prisma } from "@/database/prisma"
import { UserRole } from "@prisma/client"
import request from "supertest"

describe('TeamsController', () => {
    let user_id: string
    let team_id: string
    let token: string

    afterAll(async () => {
        if (user_id) {
            await prisma.user.delete({ where: { id: user_id } })

        }
    })

    it("deve criar um novo time com sucesso", async () => {
        const userResponse = await request(app).post("/users").send({
            name: "Auth Test User",
            email: "auth_test_user@example.com",
            password: "password123",
            role: UserRole.admin
        })

        user_id = userResponse.body.id

        const sessionResponse = await request(app).post("/sessions").send({
            email: "auth_test_user@example.com",
            password: "password123",
        })

        token = sessionResponse.body.token

        const response = await request(app)
            .post("/teams")
            .set("Authorization", `Bearer ${sessionResponse.body.token}`)
            .send({
                name: "Time Teste",
                description: "Testado a criação de times",
            })

        team_id = response.body.id


        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body.name).toBe("Time Teste")
    })

    it("deve listar todos os times com sucesso", async () => {
        const response = await request(app)
            .get("/teams")
            .set("Authorization", `Bearer ${token}`)
            .send()

        expect(response.status).toBe(200)

    })

    it("deve atualizar uma tarefa", async () => {
        const response = await request(app)
            .patch(`/teams/${team_id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                description: "Testado a criação de um time"
            })

        expect(response.body.description).toBe("Testado a criação de um time")

    })

    it("deve delete um time com sucesso", async () => {
        const response = await request(app)
            .delete(`/teams/${team_id}`)
            .set("Authorization", `Bearer ${token}`)


        expect(response.status).toBe(204)

    })

})