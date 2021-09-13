import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { GameDetails } from './game-details.model';
import { GameResponse } from './game-response.model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  searchUrl = '/w/api.php?action=opensearch&format=json&limit=100&profile=fuzzy-subphrases&search=';
  gameDetailsUrl = '/w/api.php?action=browsebysubject&format=json&subject=';
  
  games: GameDetails[] = [];

  constructor(private http: HttpClient) { }

  getGames(search: string): Observable<GameDetails[]> {
    this.games = [];
     this.http.get<any>(this.searchUrl + search).subscribe(
      data => data[1].forEach((name: string) => {
        this.getGameDetails(name).subscribe(game => {
          const coverUrl = _.find(game.query.data, {property: 'Cover'})?.dataitem[0]?.item;
          const releaseDate = _.find(game.query.data, {property: 'Release_date_Windows'})?.dataitem[0]?.item;
          const gamePassValue = _.find(game.query.data, {property: 'Microsoft_Store_Game_Pass'})?.dataitem[0]?.item;
          const eaPlayValue = _.find(game.query.data, {property: 'EA_Play'})?.dataitem[0]?.item;
          const uPlusValue = _.find(game.query.data, {property: 'Ubisoft_Plus'})?.dataitem[0]?.item;
          let fromEpoch;
          if (releaseDate) {
            fromEpoch = new Date(releaseDate.substr(2)).getTime();
          }
          const gameDetails = new GameDetails(name, coverUrl ? coverUrl : '', fromEpoch, releaseDate, gamePassValue === 't', eaPlayValue === 't', uPlusValue === 't');
          this.games.push(gameDetails);
          
          this.games = this.games.sort((a, b) => a.fromEpoch < b.fromEpoch ? 1 : -1);
        })
      }))

      return of(this.games);

      
  }

  getGameDetails(game: string): Observable<GameResponse> {
    return this.http.get<GameResponse>(this.gameDetailsUrl + game);
  }
}
