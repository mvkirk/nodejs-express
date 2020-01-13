import { Response, Request } from 'express';
import { User } from './../models/user';
import { UsersRepository } from '../repository/users.repository';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

/**
 * Cette classe est un service
 * C'est ici que l'ensemble de la logique consernant les psort doit apparaitre.
 * Attention ! Mettez le moins possible d'element dans le controlleur
 */
export class AuthService {
    // Singleton instance
    private static instance: AuthService;

    // User repository
    private repository: UsersRepository;

    private constructor() {
        this.repository = UsersRepository.getInstance();
    }

    /**
     * Class method to retrieve the AuthService instance.
     * Create the instance if it does not exist yet.
     * Return the instance.
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthService();
        }
        return this.instance;
    }

    /**
     * Create a nea account relative to the user in parameter.
     * Hash the user password.
     * 
     * @param user user object to create the new account
     */
    async signup(user: User): Promise<User> {
        user.password = await argon2.hash(user.password);
        return this.repository.insert(user);
    }

    /**
     * Sign a user relative to the email and password in parameter.
     * Compare the password with the user relative to the email account from the database.
     * Create a new token bearer which contain the email and user id.
     * Return the token, email annd user id.
     * 
     * @param email user email
     * @param password user password
     */
    async signin(email: string, password: string) {
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new Error('Les informations ne sont pas valide');
        }
        const isValid = await argon2.verify(user.password, password);

        if (!isValid) {
            throw new Error('Les informations ne sont pas valide');
        }
        const userToken = {
          email: user.email,
          id: user.id
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('Pas de secret setup');
        }

        const token = jwt.sign(userToken, secret);

        return {
            token,
            email: user.email,
            id: user.id
        };
    }

    /**
     * Middleware function which decode the token and link the relative user to the request.
     * It's a middleware so you don't have access to the content of the auth service.
     * 
     * @param req request
     * @param res response
     * @param next next middleware function.
     */
    async verifyToken(req: Request, res: Response, next: Function) {
        const authorization = req.headers.authorization;
        const bearerToken = authorization?.split(' ')[1];
        if (!bearerToken) {
            res.sendStatus(401);
        }
        else {
            try {
                const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';

                const results: any = await jwt.verify(bearerToken, secret);
                const user = await UsersRepository.getInstance().findByEmail(results.email);
                req.user = {
                    ...user,
                    password: undefined
                };
                next();
            } catch(e) {
                console.log(e);
                res.sendStatus(401);
            }
        }
    }
}