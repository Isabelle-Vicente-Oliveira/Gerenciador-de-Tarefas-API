import { Router } from "express"
import { TasksController } from "@/controllers/tasks-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

const tasksRoutes = Router()
const tasksController = new TasksController()
const tasksHistoryController = new TasksController()

tasksRoutes.use(ensureAuthenticated)

tasksRoutes.post(
    "/",
    verifyUserAuthorization(["admin", "member"]),
    tasksController.create
)

tasksRoutes.get(
    "/",
    verifyUserAuthorization(["admin", "member"]),
    tasksController.index
)

tasksRoutes.get(
    "/:id",
    verifyUserAuthorization(["admin", "member"]),
    tasksController.show
)

tasksRoutes.patch(
    "/:id",
    verifyUserAuthorization(["admin", "member"]),
    tasksController.update
)

tasksRoutes.delete(
    "/:id",
    verifyUserAuthorization(["admin"]),
    tasksController.delete
)

tasksRoutes.patch(
    "/:id/assign",
    verifyUserAuthorization(["admin", "member"]),
    tasksController.assign
)

tasksRoutes.get(
    "/history",
    verifyUserAuthorization(["admin"]),
    tasksHistoryController.index
)

export { tasksRoutes }