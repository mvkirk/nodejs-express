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
    private static instance: AuthService;

    private repository: UsersRepository;
    private constructor() {
        this.repository = UsersRepository.getInstance();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthService();
        }
        return this.instance;
    }

    async signup(user: User): Promise<User> {
        user.password = await argon2.hash(user.password);
        return this.repository.insert(user);
    }

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

        const token2 = jwt.sign(userToken,  secret);
        console.log(token2);

        return token2;
    }

}