export class Playlist {
  id!: number;
  title!: string;
  genre!: string;

  constructor(input: Playlist) {
    Object.assign(this, input);
}
}