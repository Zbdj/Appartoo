import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) {
    // data: Array
   }

   users: object;
   id: string;

  allService(user) {
    return this.http.get('http://localhost:8080/home/' + user);
  }


  ngOnInit() {

    if (localStorage.getItem('status') === null) {
      window.location.href = 'http://localhost:4200/login';
    }
    else {
      var user = localStorage.getItem('status')

      this.allService(user).subscribe(
        data => {          
            this.users = data;
            this.id = user;
          },
        error => {
          console.log(error)
        }
      );
    }
  }

  deco() {
    localStorage.removeItem('status');
    window.location.href = 'http://localhost:4200/login';
  }

}
