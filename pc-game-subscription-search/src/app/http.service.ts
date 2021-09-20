import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameDetails } from './game-details.model';
import { GameResponse } from './game-response.model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  searchUrl =
    'https://www.pcgamingwiki.com/w/api.php?action=opensearch&origin=*&format=json&limit=100&profile=fuzzy-subphrases&search=';
  gameDetailsUrl = 'https://www.pcgamingwiki.com/w/api.php?action=browsebysubject&origin=*&format=json&subject=';

  games: GameDetails[] = [];

  constructor(private http: HttpClient) {}

  getGames(search: string): Observable<GameDetails[]> {
    this.games = [];
    
    this.http.get<any>(this.searchUrl + search).subscribe((data) =>
      data[1].forEach((name: string) => {
        this.getGameDetails(name).subscribe((game) => {
          const coverUrl = _.find(game.query.data, { property: 'Cover' })
            ?.dataitem[0]?.item;
          const releaseDate = _.find(game.query.data, {
            property: 'Release_date_Windows',
          })?.dataitem[0]?.item;
          const gamePassValue = _.find(game.query.data, {
            property: 'Microsoft_Store_Game_Pass',
          })?.dataitem[0]?.item;
          const eaPlayValue = _.find(game.query.data, { property: 'EA_Play' })
            ?.dataitem[0]?.item;
          const uPlusValue = _.find(game.query.data, {
            property: 'Ubisoft_Plus',
          })?.dataitem[0]?.item;
          let fromEpoch;
          if (releaseDate) {
            fromEpoch = new Date(releaseDate.substr(2)).getTime();
          }
          const gameDetails = new GameDetails(
            name,
            coverUrl ? coverUrl : '',
            fromEpoch,
            releaseDate,
            gamePassValue?.substr(0,1) === 't',
            eaPlayValue?.substr(0,1) === 't',
            uPlusValue?.substr(0,1) === 't'
          );
          this.games.push(gameDetails);

          this.games = this.games.sort((a, b) =>
            a.fromEpoch < b.fromEpoch ? 1 : -1
          );
        });
      })
    );

    return of(this.games);
  }

  getGameDetails(game: string): Observable<GameResponse> {
    return this.http.get<GameResponse>(this.gameDetailsUrl + game);
  }
}
