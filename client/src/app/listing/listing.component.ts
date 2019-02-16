import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  ids : object;
  users: BigInteger;


  constructor(private http: HttpClient,
              private route: ActivatedRoute
            ) { }

  ngOnInit() {
    if (localStorage.getItem('status') === null) {
      window.location.href = 'http://localhost:4200/login';
    }
    else{
      var id = this.route.snapshot.params['id'];
  
      this.listingService(id).subscribe(
        data => {
          this.ids = data;
          this.users = id;

          // console.log(this.ids)
          },
        error => {
          console.log(error)
        }
      )
    }
  }

  listingService(id)
  {
    return this.http.get('http://localhost:8080/friends/' + id);
  }

  

}
