export class Track {
  id!: number;
  title!: string;
  artist!: string;
  album_picture!: string;
  youtube_url!: string;
  playlist_id!: number;

  constructor(input: Track) {
    Object.assign(this, input);
  }
}