import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { prisma } from "@/database/prisma"
import { z } from "zod"

class TeamsController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().min(5),
            description: z.string().min(5)
        })

        const { name, description } = bodySchema.parse(request.body)

        const team = await prisma.teams.create({
            data: { name, description }
        })

        return response.status(201).json(team)
    }

    async index(request: Request, response: Response) {
        const teams = await prisma.teams.findMany({
            orderBy: { name: 'asc' }
        });
        return response.status(200).json(teams)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const bodySchema = z.object({
            name: z.string().min(5).optional(),
            description: z.string().min(5).optional()
        }).refine(data => data.name || data.description, {
            message: "Informe ao menos um campo para atualizar"
        })

        const { id } = paramsSchema.parse(request.params);
        const { name, description } = bodySchema.parse(request.body);

        const teamExists = await prisma.teams.findUnique({ where: { id } })
        if (!teamExists) {
            throw new AppError("Time não encontrado", 404)
        }

        const team = await prisma.teams.update({
            where: { id },
            data: { name, description },
        })

        return response.json(team)
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params);

        try {
            await prisma.teams.delete({ where: { id } })
            return response.status(204).send()
        } catch (error) {
            throw new AppError("Time não encontrado para exclusão", 404)
        }
    }
}

export { TeamsController }