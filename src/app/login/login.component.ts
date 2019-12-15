import { AuthService } from './../services/auth.service';
import { BadInput } from './../common/bad-input';
import { AppError } from './../common/app-error';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form;
  invalidLogin:boolean=false;
  constructor(private authservice: AuthService, private router: Router,
    private route: ActivatedRoute) { }

  intializeForm() {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
        
      ]),
      password: new FormControl('', [
        Validators.required,
      ])
    });
  }

  get email() { return this.form.get('email') };
  get password() { return this.form.get('password') };

  signIn(){

    this.authservice.login(this.form.value).subscribe(
      result => {
        if(result){ this.router.navigate(['/'])}
        },
        (error: AppError) => {
          if (error) {
            this.invalidLogin=true;
          }
          
          else  throw error;
        });

  }
  ngOnInit() {
    this.intializeForm();
  }

}
