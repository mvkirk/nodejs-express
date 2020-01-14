import { TracksService } from './../services/tracks.service';
import { Track } from './../models/track';
import { PlaylistsService } from './../services/playlists.service';
import { Playlist } from './../models/playlist';
import express, { Router, Request, Response, Application } from 'express';

/**
 * Ce controller vous servira de modèle pour construire vos différent controller
 * Le controller est la partie de l'application qui est en charge de la reception
 * des requetes http.
 *
 * @param app l'application express
 */
export const PlaylistsController = (app: Application) => {

    const router: Router = express.Router();
    const playlistsService = PlaylistsService.getInstance();
    const tracksService = TracksService.getInstance();

     /**
     * Get one playlist
     */
    router.get('/', (req: Request, res: Response) => {

      playlistsService.findAll().then(results => {
            res.send(results);
        })
        .catch(err => {
          console.log(err);
        })
    });


    /**
     * Get one playlist
     */
    router.get('/:id', (req: Request, res: Response) => {
      const playlistId = parseInt(req.params.id);

      playlistsService.findById(playlistId).then(result => {
            res.send(result);
        })
        .catch(err => {
          console.log(err);
        })
    });

    /**
     * Playlist creation
     */
    router.post('/', (req: Request, res: Response) => {
      const playlist: Playlist = req.body;

      playlistsService.create(playlist).then(result => {
            res.send(result);
        })
        .catch(err => {
          console.log(err);
        })
    });

    /**
     * Playlist update
     */
    router.put('/:id', (req: Request, res: Response) => {
      const playlist: Playlist = req.body;
      playlist.id = parseInt(req.params.id);

      playlistsService.update(playlist).then(result => {
            res.send(result);
        })
        .catch(err => {
          console.log(err);
        })
    });

    /**
     * Playlist deletion
     */
    router.delete('/:id', (req: Request, res: Response) => {
      const playlistId = parseInt(req.params.id);

      playlistsService.delete(playlistId).then(result => {
            res.send(result);
        })
        .catch(err => {
          console.log(err);
        })
    });

    /**
     * Create a track inside a playlist.
     */
    router.post('/:id/tracks', (req: Request, res: Response) => {
      const track: Track = req.body;
      track.playlist_id = parseInt(req.params.id);

      tracksService.create(track).then(result => {
            res.send(result);
        })
        .catch(err => {
          console.log(err);
        })
    });
    
    /**
     * Return tracks from a playlist.
     */
    router.get('/:id/tracks', (req: Request, res: Response) => {
      const playlistId = parseInt(req.params.id);

      tracksService.getTracksByPlaylistId(playlistId).then(results => {
            res.send(results);
        })
        .catch(err => {
          console.log(err);
        })
    });

     /**
     * Update a track inside a playlist.
     */
    router.put('/:id/tracks/:trackId', (req: Request, res: Response) => {
      const track: Track = req.body;
      track.id = parseInt(req.params.trackId);

      tracksService.update(track).then(result => {
            res.send(result);
        })
        .catch(err => {
          console.log(err);
        })
    });

     /**
     * Delete a track from a playlist.
     */
    router.delete('/:id/tracks/:trackId', (req: Request, res: Response) => {
      const playlistId = parseInt(req.params.id);
      const trackId = parseInt(req.params.trackId);

      playlistsService.removeTrack(playlistId, trackId).then(() => {
            res.send();
        })
        .catch(err => {
          console.log(err);
        })
    });

    app.use('/playlists', router);
};
