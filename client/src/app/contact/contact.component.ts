import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: object


  constructor(private http: HttpClient,
    private route: ActivatedRoute) { }

  contactService(pseudo,id) {
    return this.http.get('http://localhost:8080/add/' + pseudo + '/' + id);
  }


  ngOnInit() {
    if (localStorage.getItem('status') === null) {
      window.location.href = 'http://localhost:4200/login';
    }
    else {
      var id = this.route.snapshot.params['id'];
      var pseudo = this.route.snapshot.params['pseudo'];

      this.contactService(pseudo,id).subscribe(
        data => {          
            this.contacts = data;
            console.log(data)
            window.location.href = 'http://localhost:4200/list/' + id;
          },
        error => {
          console.log(error)
        }
      );


    }
  }



}
