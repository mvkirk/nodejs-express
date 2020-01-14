import { TracksService } from './../services/tracks.service';
import { Track } from './../models/track';
import { PlaylistsService } from './../services/playlists.service';
import { Playlist } from './../models/playlist';
import { Post } from './../models/post';
import { PostsService } from './../services/posts.service';
import express, { Router, Request, Response, Application } from 'express';
import { AuthService } from './../services/auth.service';

/**
 * Ce controller vous servira de modèle pour construire vos différent controller
 * Le controller est la partie de l'application qui est en charge de la reception
 * des requetes http.
 *
 * @param app l'application express
 */
export const TracksController = (app: Application) => {

    const router: Router = express.Router();
    const tracksService = TracksService.getInstance();

    /**
     * Get all tracks.
     */
    router.get('/', (req: Request, res: Response) => {

      tracksService.getAll().then(results => {
            res.send(results);
        })
        .catch(err => {
          console.log(err);
        })
    });


    

    app.use('/tracks', router);
};
