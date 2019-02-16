import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  private username: String
  private password: String
  private age: BigInteger
  private famille: String
  private race: String
  private nourriture: String



  constructor(private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  accounts: object;
  updates: object;

  accountService(account) {
    return this.http.get('http://localhost:8080/show/' + account);
  }

  ngOnInit() {
    if (localStorage.getItem('status') === null) {
      window.location.href = 'http://localhost:4200/login';
    }
    var account = this.route.snapshot.params['id'];

    this.accountService(account).subscribe(
      data => {
        this.accounts = data;
        console.log(data)
      },
      error => {
        console.log(error)
      }
    );
  }

  editService(id,news) {
    return this.http.post('http://localhost:8080/update/'+ id, news);
  }

  edit() {
    var id = this.route.snapshot.params['id'];

    const news = {
      username: this.username,
      password: this.password,
      age: this.age,
      famille: this.famille,
      race: this.race,
      nourriture: this.nourriture
    }


    this.editService(id,news).subscribe(
      data => {
        this.updates = data;
        // console.log(data)
        window.location.href = 'http://localhost:4200/account/' + id;
      },
      error => {
        console.log(error)
      }
    );
  }
  
  deleteService(resp){
    return this.http.get('http://localhost:8080/delete/' + resp);

  }
  delete(){
    var resp = this.route.snapshot.params['id'];
    // console.log(resp)
    this.deleteService(resp).subscribe(
      data => {
        console.log(data);

        localStorage.removeItem('status');
        window.location.href = 'http://localhost:4200/login';
      },
      error => {
        console.log(error)
      }
    );
  }
}
