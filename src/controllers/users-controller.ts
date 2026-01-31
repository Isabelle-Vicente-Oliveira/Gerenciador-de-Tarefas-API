import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { prisma } from "@/database/prisma"
import { hash } from "bcrypt"
import { z } from "zod"

class UsersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(2),
            email: z.string().email(),
            password: z.string().min(6),
            role: z.enum(["admin", "member"]).optional(),

        })

        const { name, email, password, role } = bodySchema.parse(request.body)

        const userWithSameEmail = await prisma.user.findFirst({ where: { email } })

        if (userWithSameEmail) {
            throw new AppError('O usuário já existe com esse email')
        }

        const hashedPassword = await hash(password, 8)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        })

        const { password: _, ...userWithoutPassword } = user


        return response.status(201).json(userWithoutPassword)
    }
}

export { UsersController }