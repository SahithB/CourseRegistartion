import { RegistrationService } from "./../services/registration.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Registration } from "../models/registration";
import { AppError } from "../common/app-error";
import { NotFoundError } from "../common/not-found-error";
import { BadInput } from "../common/bad-input";

@Component({
  selector: "registrations",
  templateUrl: "./registrations.component.html",
  styleUrls: ["./registrations.component.css"]
})
export class RegistrationsComponent implements OnInit, OnDestroy {
  registrations: Registration[];
  subscription: Subscription;
  filteredRegistrations: Registration[];
  loader: boolean = true;

  constructor(private service: RegistrationService) {}

  filter(query: string) {
    this.filteredRegistrations = query
      ? this.registrations.filter(p =>
          p.student.name
            .toString()
            .toLowerCase()
            .includes(query.toString().toLowerCase())
        )
      : this.registrations;
  }

  ngOnInit() {
    this.subscription = this.service.getAll().subscribe(
      registrations => {
        this.registrations = this.filteredRegistrations = registrations;
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
