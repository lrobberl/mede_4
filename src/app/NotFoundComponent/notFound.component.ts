import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-not-found',
  templateUrl: './notFound.component.html',
  styleUrls: ['./notFound.component.css']
})

export class NotFoundComponent {
  // path: string;

  constructor(private router: Router
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
}
