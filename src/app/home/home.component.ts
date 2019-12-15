import { RegistrationService } from "./../services/registration.service";
import { Component, OnInit } from "@angular/core";
import { CourseService } from "../services/course.service";
import { Subscription } from "rxjs";
import { Registration } from "./../models/registration";
import { AppError } from "../common/app-error";
import { NotFoundError } from "../common/not-found-error";
import { BadInput } from "../common/bad-input";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  courses: any[];
  registrations: Registration[];
  subscription: Subscription;

  clen: number;
  rlen: number;

  constructor(
    private courseService: CourseService,
    private registrationService: RegistrationService
  ) {
    this.subscription = this.registrationService.getAll().subscribe(
      registrations => {
        this.registrations = registrations;
      },
      (error: AppError) => {
        if (error instanceof NotFoundError) {
          alert("not found");
        } else if (error instanceof BadInput) {
          alert("bad input");
        } else alert("unexpectedError");
      }
    );
  }

  ngOnInit() {
    this.courseService
      .getAll()
      .subscribe(C => (this.clen = Object.keys(C).length));
    this.registrationService
      .getAll()
      .subscribe(C => (this.rlen = Object.keys(C).length));
  }
}
