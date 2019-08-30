import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {AuthenticationService} from '../Services/authentication.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './notFound.component.html',
  styleUrls: ['./notFound.component.css']
})

export class NotFoundComponent {
  // path: string;

  constructor(private router: Router,
              private authenticationService: AuthenticationService
              // private route: ActivatedRoute)
  ) {}

  /*
  ngOnInit() {
    this.route.data.pipe(take(1))
      .subscribe((data: { path: string }) => {
        this.path = data.path;
      });
  }
   */
  goto(page: string) {
    this.router.navigate([page]);
  }

  get isLogged() {
    return this.authenticationService.isLoggedIn();
  }
}
