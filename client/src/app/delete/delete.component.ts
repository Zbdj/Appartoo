import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  deletes: object;

  constructor(private http: HttpClient,
    private route: ActivatedRoute) { }


  deleteService(pseudo,id) {
    return this.http.get('http://localhost:8080/delete/friends/' + pseudo + '/' + id );
  }

  ngOnInit() {
    if (localStorage.getItem('status') === null) {
      window.location.href = 'http://localhost:4200/login';
    }
    else {
      var pseudo = this.route.snapshot.params['pseudo'];
      var id = this.route.snapshot.params['id'];

      this.deleteService(pseudo,id).subscribe(
        data => {
          this.deletes = data;
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
