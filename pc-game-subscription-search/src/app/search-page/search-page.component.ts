import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { map } from 'rxjs/operators';
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

  constructor(private httpService: HttpService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.matchesOnly = this.route.snapshot.paramMap.get('matchesOnly') === "true";
    this.search = this.route.snapshot.paramMap.get('title') || "";
  }

  searchGames(): void {
    this.httpService.getGames(this.search).subscribe((g) => (this.games = g));
    this.updateRoute();
  }

  updateRoute(): void {
    const extras: NavigationExtras = {
      queryParams: {
          title: this.search,
          ...this.matchesOnly ? {matches: this.matchesOnly} : {}
      }
    };

    this.router.navigate(['/'], extras);

  }
}
