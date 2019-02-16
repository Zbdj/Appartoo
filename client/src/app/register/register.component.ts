import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private username: String
  private password: String
  private age: BigInteger
  private famille: String
  private race: String
  private nourriture: String

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (localStorage.getItem('status')) {
      window.location.href = 'http://localhost:4200';
    }
  }

  registerService(user)
  {
    return this.http.post('http://localhost:8080/home/create', user);
  }
  
  register() {

    const user = {
      username: this.username,
      password: this.password,
      age: this.age,
      famille: this.famille,
      race: this.race,
      nourriture: this.nourriture
    }

    if (user.username === undefined || user.password === undefined || user.age === undefined || user.famille === undefined || user.race === undefined || user.nourriture === undefined ) {
      alert('Veuillez remplir tout les champs');
    }
    else {
      this.registerService(user).subscribe(
        data => {
          console.log(data)
        },
        error => {
          console.log(error)
        }
      );
      window.location.href='http://localhost:4200/login';
    }

  }

}
