import { Component, OnInit } from '@angular/core';
import { pipe } from 'rxjs';
import { GameDetails } from '../game-details.model';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  search = '';
  games: GameDetails[] = [];
  matchesOnly = false;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  searchGames(): void {
    this.httpService.getGames(this.search).subscribe((g) => (this.games = g));
  }
}
