import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { prisma } from "@/database/prisma"
import { z } from "zod"


class TasksHistoryController {
    async index(request: Request, response: Response) {
        const { task_id } = request.params;

        const history = await prisma.taskHistory.findMany({
            where: { taskId: task_id },
            include: {
                user: { select: { name: true } }
            },
            orderBy: { changedAt: 'desc' }
        });

        return response.json(history);
    }
}