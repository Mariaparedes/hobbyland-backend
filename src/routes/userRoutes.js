import { Router } from "express"
import * as controller from "../controllers/UserController.js";

const router = Router();

router.post('/register', controller.createUser)
router.post('/image/:id',  controller.uploadProfileImage)
router.post('/login', controller.login)
router.post('/:id/password', controller.changePassword)
router.get('/', controller.getAllUsers)
router.get('/:id', controller.getUser)
router.get('/search/:search', controller.getFilterUsers)
router.put('/:id', controller.updateUser)
router.delete('/:id', controller.deleteUser)


router.post('/follows/:id', controller.setFollowUser)
router.get('/follows/:id', controller.getFollows)
router.get('/followers/:id', controller.getFollowers)

export default router;