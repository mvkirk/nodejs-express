import { TracksRepository } from './../repository/tracks.repository';
import { Track } from 'src/models/track';
/**
 * Cette classe est un service
 * C'est ici que l'ensemble de la logique consernant les track doit apparaitre.
 * Attention ! Mettez le moins possible d'element dans le controller
 */
export class TracksService {

    // Make service => singletonTransformation de notre service en singleton
    private static instance: TracksService;
    static getInstance() {
        if (!this.instance) {
            this.instance = new TracksService();
        }
        return this.instance;
    }

    // Un singleton est une class ayant une instance unique a travers toute l'app
    private repository: TracksRepository;
    private constructor() {
        this.repository = TracksRepository.getInstance();
    }

    // Business logic

    
    /**
     * Return a promise which contains an array of posts.
     */
    getAll(): Promise<Track[]> {
      return this.repository.findAll();
    }

    /**
     * Return a promise which contains the track relative to the id in parameter.
     * @param id track id
     */
    getById(id: number): Promise<Track> {
        return this.repository.findById(id);
    }

    /**
     * Return a promise which contains the track relative to the id in parameter.
     * @param id track id
     */
    getTracksByPlaylistId(playlistId: number): Promise<Track[]> {
      return this.repository.findByPlaylistId(playlistId);
  }

    /**
     * Create a new track and return a promise which contains the created track.
     * @param track track to create
     */
    create(track: any): Promise<Track> {
      return this.repository.insert(track);
    }

    /**
     * Update the track in parameter and return a promise which contains the updated track.
     * @param track track to update
     */
    update(track: any): Promise<Track> {
      return this.repository.update(track);
    }

    /**
     * Delete the track related to the id in parameter. Return an empty promise.
     * @param id track id
     */
    delete(id: number): Promise<any> {
      return this.repository.delete(id);
    }
}
