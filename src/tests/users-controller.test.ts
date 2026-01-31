import request from "supertest"
import { prisma } from "@/database/prisma"

import { app } from "@/app"

describe("UsersController", () => {
    let user_id: string

    afterAll(async () => {
        await prisma.user.delete({ where: { id: user_id } })
    })

    it("deve criar um novo usuário com sucesso", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
            email: "testuser@example.com",
            password: "password123",
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
        expect(response.body.name).toBe("Test User")

        user_id = response.body.id
    })

    it("Deve gerar um erro se já existir um usuário com o mesmo e-mail.", async () => {
        const response = await request(app).post("/users").send({
            name: "Duplicate User",
            email: "testuser@example.com",
            password: "password123",
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("O usuário já existe com esse email")
    })

    it("Deve gerar um erro de validação se o e-mail for inválido.", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
            email: "invalid-email",
            password: "password123",
        })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("validation error")
    })
})