import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private username: String
  private password: String

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (localStorage.getItem('status')) {
      window.location.href = 'http://localhost:4200';
    }
  }

  loginService(user) {
    return this.http.post('http://localhost:8080/login/submit', user);
  }

  login()
  {
      const user = {
        username: this.username,
        password: this.password
      }

      if (user.username === undefined || user.password === undefined) {
        alert('Veuillez remplir tout les champs');
      }
      else {
        this.loginService(user).subscribe(
          (data: any) => {
            // console.log(data._id)
            if (typeof data === 'string'){
              alert(data)
            }
            else{
              localStorage.setItem('status', data._id);
              window.location.href='http://localhost:4200/';
            }
          },
          error => {
            console.log(error)
          }
        )
      }
  }
}