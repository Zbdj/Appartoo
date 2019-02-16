import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FriendsComponent } from './friends/friends.component';
import { AccountComponent } from './account/account.component';
import { ListingComponent } from './listing/listing.component';
import { ContactComponent } from './contact/contact.component';
import { DeleteComponent } from './delete/delete.component';




const Routes: Routes = [
  {
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'register',
    component: RegisterComponent 
  },
  { 
    path: 'login',
    component: LoginComponent 
  },
  { 
    path: 'friends/show/:pseudo',
    component: FriendsComponent 
  },
  { 
    path: 'account/:id',
    component: AccountComponent 
  },
  { 
    path: 'list/:id',
    component: ListingComponent 
  },
  { 
    path: 'add/:pseudo/:id',
    component: ContactComponent 
  },
  { 
    path: 'delete/:pseudo/:id',
    component: DeleteComponent 
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(Routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
