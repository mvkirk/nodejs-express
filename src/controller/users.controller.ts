import { User } from './../models/user';
import { UsersService } from './../services/users.service';
import express, { Router, Request, Response, Application } from 'express';
import { AuthService } from './../services/auth.service';

/**
 * Ce controller vous servira de modèle pour construire vos différent controller
 * Le controller est la partie de l'application qui est en charge de la reception
 * des requetes http.
 *
 * @param app l'application express
 */
export const UsersController = (app: Application) => {

    const router: Router = express.Router();
    const usersService = UsersService.getInstance();
    const authService = AuthService.getInstance();

    /**
     * Return the connected user relative to the connected token
     */
    router.get('/me', authService.verifyToken, (req: Request, res: Response) => {
      res.send(req.user);
    });

    /**
     * Return only one user in JSON relative to its id
     */
    router.get('/:id', authService.verifyToken, (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      usersService.getById(id).then(result => {
            res.send(result);
        })
        .catch(err => {
          console.log(err);
        })
    });

    /**
     * Create a new user from a JSON body and return the created user in JSON.
     */
    router.post('/', (req: Request, res: Response) => {
      const user: User = req.body; // Automatically transform in a User object

      usersService.create(user).then(result => {
            res.send(result);
        })
        .catch(err => {
          console.log(err);
        })
    });

    app.use('/users', router);
};
