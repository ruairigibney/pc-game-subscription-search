export class GameDetails {
  constructor(
    public name: string,
    public coverUrl: string | undefined,
    public fromEpoch: number = 0,
    public releaseDate: string | undefined,
    public onGamePass: boolean = false,
    public onEAPlay: boolean = false,
    public onUPlus: boolean = false
  ) {}
}
