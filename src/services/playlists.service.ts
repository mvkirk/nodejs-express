import { TracksRepository } from './../repository/tracks.repository';
import { Playlist } from './../models/playlist';
import { PlaylistsRepository } from './../repository/playlists.repository';

/**
 * Cette classe est un service
 * C'est ici que l'ensemble de la logique consernant les post doit apparaitre.
 * Attention ! Mettez le moins possible d'element dans le controller
 */
export class PlaylistsService {

    // Make service => singletonTransformation de notre service en singleton
    private static instance: PlaylistsService;
    static getInstance() {
        if (!this.instance) {
            this.instance = new PlaylistsService();
        }
        return this.instance;
    }

    // Un singleton est une class ayant une instance unique a travers toute l'app
    private repository: PlaylistsRepository;
    private tracksRepository: TracksRepository = TracksRepository.getInstance();
    private constructor() {
        this.repository = PlaylistsRepository.getInstance();
    }
    
    // Business logic

    findAll(): Promise<Playlist[]> {
      return this.repository.findAll();
    }

    findById(id: number): Promise<Playlist> {
      return this.repository.findById(id);
    }

    create(playlist: Playlist): Promise<Playlist> {
      return this.repository.insert(playlist);
    }

    update(playlist: Playlist): Promise<Playlist> {
      return this.repository.update(playlist);
    }

    delete(id: number): Promise<any> {
      return this.repository.delete(id);
    }
    
    async removeTrack(playlistId: number, trackId: number): Promise<any> {
      const track = await this.tracksRepository.findById(trackId);
      if (playlistId === track.playlist_id) {
        return this.tracksRepository.clearPlaylistId(trackId);
      }
    }
}
