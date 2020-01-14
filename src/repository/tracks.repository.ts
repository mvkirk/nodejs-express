import { Track } from './../models/track';
import { MysqlConnection } from './../loaders/mysql';

/**
 * Cette classe est un repository
 * C'est ici qu'on met tout les accès à la bdd
 * Attention, aucune logique javascript ne doit apparaitre ici.
 * Il s'agit seulement de la couche de récupération des données (requeêe sql)
 */
export class TracksRepository {

    private static instance: TracksRepository;
    private connection: MysqlConnection = MysqlConnection.getInstance();

    private table: string = 'track';

    static getInstance() {
        if (!this.instance) {
            this.instance = new TracksRepository();
        }
        return this.instance;
    }

    private constructor() {
    }

    /**
     * Make a query to the database to retrieve all tracks and return it in a promise.
     */
    findAll(): Promise<Track[]> {
        return this.connection.query(`SELECT * from ${this.table}`)
          .then((results: any) => {
            return results.map((track: any) => new Track(track));
          });
    }
    /**
     * Make a query to the database to retrieve all tracks and return it in a promise.
     */
    findByPlaylistId(playlistId: number): Promise<Track[]> {
      return this.connection.query(`SELECT * from ${this.table} WHERE playlist_id = ?`, [playlistId])
        .then((results: any) => {
          return results.map((track: any) => new Track(track));
        });
  }

    /**
     * Make a query to the database to retrieve one track by its id in parameter. 
     * Return the track found in a promise.
     * @param id track id
     */
    findById(id: number): Promise<Track> {
        return this.connection.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
          .then((results: any) => new Track(results[0]));
    }


    /**
     * Make a query to the database to insert a new track and return the created track in a promise.
     * @param track track to create
     */
    insert(track: Track) {
      return this.connection.query(
        `INSERT INTO ${this.table} (title, artist, album_picture, youtube_url, playlist_id) VALUES (?,?,?,?,?)`,
        [track.title, track.artist, track.album_picture, track.youtube_url, track.playlist_id]
      ).then((result: any) => {
        // After an insert the insert id is directly passed in the promise
        return this.findById(result.insertId);
      });
    }

    /**
     * Make a query to the database to update an existing track and return the updated track in a promise.
     * @param track track to update
     */
    update(track: Track) {
      return this.connection.query(
        `UPDATE ${this.table} SET title = ?, artist = ?, album_picture = ?, youtube_url = ?, playlist_id = ? WHERE id = ?`,
        [track.title, track.artist, track.album_picture, track.youtube_url, track.playlist_id, track.id]
      ).then(() => {
        return this.findById(track.id);
      });
    }

    /**
     * Remove the playlist id from a specific track.
     * @param id track id
     */
    clearPlaylistId(id: number) {
      return this.connection.query(
        `UPDATE ${this.table} SET playlist_id = NULL WHERE id = ?`, [id]
      );
    }

    /**
     * Make a query to the database to delete an existing track and return an empry promise
     * @param id track id to delete
     */
    delete(id: number): Promise<any> {
      return this.connection.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    }
}
