import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(private http: HttpClient,
              private route: ActivatedRoute
            ) { 

  }
  friends : object;

  showService(friend)
  {
    return this.http.get('http://localhost:8080/friends/show/' + friend);
  }

  ngOnInit() {
    if (localStorage.getItem('status') === null) {
      window.location.href = 'http://localhost:4200/login';
    }
    else {
      var friend = this.route.snapshot.params['pseudo'];

      this.showService(friend).subscribe(
        data => {          
            this.friends = data;
            console.log(data)
          },
        error => {
          console.log(error)
        }
      );
    }
  }
  }
