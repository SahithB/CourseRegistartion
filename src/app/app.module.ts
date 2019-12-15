import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { CourseService } from './services/course.service';
import { RegistrationService } from './services/registration.service';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { RegistrationsComponent } from './registrations/registrations.component';
import { RouterModule, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CourseFormComponent } from './course-form/course-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    CoursesComponent,
    RegistrationsComponent,
    CourseFormComponent,
    RegistrationFormComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot([
       { path:'' , component: HomeComponent, canActivate:[AuthGuard]},
       { path:'courses/new' , component: CourseFormComponent, canActivate:[AuthGuard]},
       { path:'courses/:id' , component: CourseFormComponent , canActivate:[AuthGuard]},
       { path:'courses' , component: CoursesComponent , canActivate:[AuthGuard]},
       { path:'registrations/new' , component: RegistrationFormComponent , canActivate:[AuthGuard]},
       { path:'registrations/:id' , component: RegistrationFormComponent , canActivate:[AuthGuard]},
       { path:'registrations' , component: RegistrationsComponent, canActivate:[AuthGuard]},
       { path:'login' , component: LoginComponent}
    ])
  ],
  providers: [
    CourseService,
    RegistrationService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
