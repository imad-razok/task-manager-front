import { AuthService } from './../../services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  constructor(private authService:AuthService ) { }

  ngOnInit(): void {
  }
  onSignUpButtonClicked(email:string,password:string){
    this.authService.signup(email,password).subscribe((res:HttpResponse<any>)=>{
      console.log(res)
    });
  }
}
