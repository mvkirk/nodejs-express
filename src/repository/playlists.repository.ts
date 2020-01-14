import { Playlist } from './../models/playlist';
import { MysqlConnection } from './../loaders/mysql';

/**
 * Cette classe est un repository
 * C'est ici qu'on met tout les accès à la bdd
 * Attention, aucune logique javascript ne doit apparaitre ici.
 * Il s'agit seulement de la couche de récupération des données (requeêe sql)
 */
export class PlaylistsRepository {

    private static instance: PlaylistsRepository;
    private connection: MysqlConnection = MysqlConnection.getInstance();

    private table: string = 'playlist';

    static getInstance() {
        if (!this.instance) {
            this.instance = new PlaylistsRepository();
        }
        return this.instance;
    }

    private constructor() {
    }

    /**
     * Make a query to the database to retrieve all playlists and return it in a promise.
     */
    findAll(): Promise<Playlist[]> {
        return this.connection.query(`SELECT * from ${this.table}`)
          .then((results: any) => {
            return results.map((playlist: any) => new Playlist(playlist));
          });
    }

    /**
     * Make a query to the database to retrieve one playlist by its id in parameter. 
     * Return the playlist found in a promise.
     * @param id playlist id
     */
    findById(id: number): Promise<Playlist> {
        return this.connection.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id])
          .then((results: any) => new Playlist(results[0]));
    }


    /**
     * Make a query to the database to insert a new playlist and return the created playlist in a promise.
     * @param playlist playlist to create
     */
    insert(playlist: Playlist): Promise<Playlist> {
      return this.connection.query(
        `INSERT INTO ${this.table} (title, genre) VALUES (?,?)`,
        [playlist.title, playlist.genre]
      ).then((result: any) => {
        // After an insert the insert id is directly passed in the promise
        return this.findById(result.insertId);
      });
    }

    /**
     * Make a query to the database to update an existing playlist and return the updated playlist in a promise.
     * @param playlist playlist to update
     */
    update(playlist: Playlist): Promise<Playlist> {
      return this.connection.query(
        `UPDATE ${this.table} SET title = ?, genre = ? WHERE id = ?`,
        [playlist.title, playlist.genre, playlist.id]
      ).then(() => {
        return this.findById(playlist.id);
      });
    }

    /**
     * Make a query to the database to delete an existing playlist and return an empry promise
     * @param id playlist id to delete
     */
    delete(id: number): Promise<any> {
      return this.connection.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    }
}
