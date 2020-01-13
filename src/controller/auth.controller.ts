import { User } from './../models/user';
import { AuthService } from './../services/auth.service';
import { Post } from './../models/post';
import express, { Router, Request, Response, Application } from 'express';

/**
 * Ce controller vous servira de modèle pour construire vos différent controller
 * Le controller est la partie de l'application qui est en charge de la reception
 * des requetes http.
 *
 * @param app l'application express
 */
export const AuthController = (app: Application) => {

    const router: Router = express.Router();
    const authService = AuthService.getInstance();

    /**
     * Create a new post from a JSON body and return the created post in JSON.
     */
    router.post('/login', (req: Request, res: Response) => {
      const user: User = req.body;

      authService.signin(user.email, user.password).then((results: any) => {
          res.send({
            token: results.token,
            id: results.id,
            email: results.email
          });
        })
        .catch(err => {
          res.sendStatus(401);
        })
    });

    /**
     * Create a new post from a JSON body and return the created post in JSON.
     */
    router.post('/register', (req: Request, res: Response) => {
      const user: User = req.body;

      authService.signup(user).then((registeredUser: User) => {
          res.send({
            ...registeredUser,
            password: ''
          });
        })
        .catch(err => {
          console.log(err);
        })
    });

    app.use('/auth', router);
};
