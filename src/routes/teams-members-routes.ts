import { Router } from "express";
import { TeamsMembersController } from "@/controllers/teams-members-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const teamsMembersRoutes = Router()
const teamsMembersController = new TeamsMembersController()

teamsMembersRoutes.use(ensureAuthenticated)

teamsMembersRoutes.post(
    "/",
    verifyUserAuthorization(["admin"]),
    teamsMembersController.create
)

teamsMembersRoutes.delete(
    "/:id",
    verifyUserAuthorization(["admin"]),
    teamsMembersController.delete
)

teamsMembersRoutes.get(
    "/:team_id",
    verifyUserAuthorization(["admin", "member"]),
    teamsMembersController.show
)

export { teamsMembersRoutes }