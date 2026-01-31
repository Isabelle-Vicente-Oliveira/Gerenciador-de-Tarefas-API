import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { z } from "zod";
import { prisma } from "@/database/prisma";

class TeamsMembersController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            user_id: z.string().uuid(),
            team_id: z.string().uuid()
        })

        const { user_id, team_id } = bodySchema.parse(request.body)

        const team = await prisma.teams.findUnique({ where: { id: team_id } })
        if (!team) throw new AppError("Time não encontrado", 404)

        const user = await prisma.user.findUnique({ where: { id: user_id } })
        if (!user) throw new AppError("Usuário não encontrado", 404)

        const memberAlreadyExists = await prisma.teamMembers.findFirst({
            where: {
                userId: user_id,
                teamId: team_id
            }
        })

        if (memberAlreadyExists) {
            throw new AppError("Este usuário já é membro deste time", 400)
        }

        const teamMember = await prisma.teamMembers.create({
            data: {
                userId: user_id,
                teamId: team_id
            }
        })

        return response.status(201).json(teamMember)
    }

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            team_id: z.string().uuid()
        })

        const { team_id } = paramsSchema.parse(request.params)

        const members = await prisma.teamMembers.findMany({
            where: { teamId: team_id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })

        return response.json(members)
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params);

        try {
            await prisma.teamMembers.delete({ where: { id } })
            return response.status(204).send()
        } catch (error) {
            throw new AppError("Membro do time não encontrado", 404)
        }
    }

}

export { TeamsMembersController }