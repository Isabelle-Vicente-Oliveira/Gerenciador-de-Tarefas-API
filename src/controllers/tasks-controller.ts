import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";


class TasksController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            title: z.string().min(3),
            description: z.string(),
            status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
            priority: z.enum(["low", "medium", "high"]).default("low"),
            assigned_to: z.string().uuid(),
            team_id: z.string().uuid(),
        })

        const data = bodySchema.parse(request.body)

        const team = await prisma.teams.findUnique({ where: { id: data.team_id } })
        if (!team) throw new AppError("Time não encontrado", 404)

        const user = await prisma.user.findUnique({ where: { id: data.assigned_to } })
        if (!user) throw new AppError("Usuário para atribuição não encontrado", 404)

        const isMember = await prisma.teamMembers.findFirst({
            where: {
                userId: data.assigned_to,
                teamId: data.team_id
            }
        })

        if (!isMember) {
            throw new AppError("O usuário selecionado não pertence a este time.", 400)
        }

        const task = await prisma.tasks.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                assignedTo: data.assigned_to,
                teamId: data.team_id,
            }
        })

        return response.status(201).json(task)
    }

    async index(request: Request, response: Response) {
        const querySchema = z.object({
            team_id: z.string().uuid().optional(),
            priority: z.enum(["low", "medium", "high"]).optional(),
            status: z.enum(["pending", "in_progress", "completed"]).optional()
        })

        const { team_id, priority, status } = querySchema.parse(request.query)


        const { id: user_id, role } = request.user!

        const whereClause: any = {
            teamId: team_id,
            priority: priority,
            status: status,
        }

        if (role !== "admin") {
            whereClause.assignedTo = user_id
        }

        const tasks = await prisma.tasks.findMany({
            where: whereClause,
            include: {
                user: { select: { name: true } },
                team: { select: { name: true } }
            }
        })

        return response.json(tasks)
    }
    async show(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.string().uuid() })
        const { id } = paramsSchema.parse(request.params)

        const task = await prisma.tasks.findUnique({
            where: { id },
            include: { user: true, team: true }
        })

        if (!task) throw new AppError("Tarefa não encontrada", 404)

        return response.json(task)
    }

    async update(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.string().uuid() })
        const bodySchema = z.object({
            title: z.string().min(3).optional(),
            description: z.string().optional(),
            status: z.enum(["pending", "in_progress", "completed"]).optional(),
            priority: z.enum(["low", "medium", "high"]).optional(),
            assigned_to: z.string().uuid().optional(),
        })

        const { id } = paramsSchema.parse(request.params)
        const data = bodySchema.parse(request.body)

        const taskExists = await prisma.tasks.findUnique({ where: { id } })
        if (!taskExists) throw new AppError("Tarefa não encontrada", 404)

        const { id: user_id } = request.user!

        const [updatedTask] = await prisma.$transaction([
            prisma.tasks.update({
                where: { id },
                data: {
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    priority: data.priority,
                    assignedTo: data.assigned_to,
                }
            }),

            prisma.taskHistory.create({
                data: {
                    taskId: id,
                    changedBy: user_id,
                    oldStatus: taskExists.status,
                    newStatus: data.status || taskExists.status,
                }
            })
        ])

        return response.json(updatedTask)
    }

    async delete(request: Request, response: Response) {
        const paramsSchema = z.object({ id: z.string().uuid() })
        const { id } = paramsSchema.parse(request.params)

        try {
            await prisma.tasks.delete({ where: { id } })
            return response.status(204).send()
        } catch {
            throw new AppError("Tarefa não encontrada", 404)
        }
    }

    async assign(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            user_id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(request.params)
        const { user_id } = bodySchema.parse(request.body)

        const task = await prisma.tasks.findUnique({ where: { id } })
        if (!task) throw new AppError("Tarefa não encontrada", 404)

        const isMember = await prisma.teamMembers.findFirst({
            where: {
                userId: user_id,
                teamId: task.teamId
            }
        })

        if (!isMember) {
            throw new AppError("O usuário não pertence ao time desta tarefa", 400)
        }

        const updatedTask = await prisma.tasks.update({
            where: { id },
            data: { assignedTo: user_id }
        })

        return response.json(updatedTask)
    }
}

export { TasksController };