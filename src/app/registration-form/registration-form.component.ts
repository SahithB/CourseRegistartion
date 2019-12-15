import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CourseService } from './../services/course.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { RegistrationService } from '../services/registration.service';
import { take, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Course } from '../models/course';
import { Registration } from '../models/registration';


@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  courses$;
  form;
  id;
  isEMICheck: boolean = false;
  coursechosen: Course;
  payment_flag:boolean = false;
  formData:any[]

  constructor(private courseService: CourseService,
    private registrationService: RegistrationService,
    private router: Router,
    private route: ActivatedRoute) {

    this.courses$ = courseService.getAll();
    

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {

      this.registrationService.get(this.id).pipe(take(1)).subscribe( c => {
        this.form.get('name').setValue(c.student.name);
        this.form.get('email').setValue(c.student.email);
        this.form.get('address').setValue(c.student.address);
        this.form.get('courseId').setValue(c.course._id);
        this.form.get('phone').setValue(c.student.phone);
        this.form.get('modeOfPayment').disable();
        this.form.get('modeOfPayment').setValue(c.modeOfPayment);
        this.form.get('installmentpaid').setValue(c.installmentpaid);
        
      })
    }
  }

  intializeForm() {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(55)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      address: new FormControl('', [
        Validators.minLength(5),
        Validators.maxLength(55),
        Validators.required
      ]),
      courseId: new FormControl("", [
        Validators.required
      ]),
      phone: new FormControl([]),
      modeOfPayment: new FormControl('Full', []),
      installmentpaid: new FormControl({value:'', disabled:true},[])

    });
  }

  get name() { return this.form.get('name') };
  get email() { return this.form.get('email') };
  get address() { return this.form.get('address') };
  get courseId() { return this.form.get('courseId') };
  get phone() { return this.form.get('phone') };
  get modeOfPayment() { return this.form.get('modeOfPayment') };
  get installmentpaid() { return this.form.get('installmentpaid') };

  

  onChanges() {
    console.log(this.form);
    this.form.get('courseId').valueChanges.subscribe( course => {
        this.courseService.get(course).subscribe( c => {
          this.coursechosen = c;
          if (!c.isEMIAllowed) {
            this.payment_flag = false;
          }
          else {
            this.payment_flag= true;
            if(!this.id)
            this.form.get('modeOfPayment').setValue('Full');
            
          }
        }
      )
      })
      
      this.form.get('modeOfPayment').valueChanges.subscribe({ next:
        mode=>{
          if(mode=='Full'){
                this.form.get('installmentpaid').reset();
                this.form.get('installmentpaid').clearValidators();
                this.form.get('installmentpaid').disable();
                this.isEMICheck= false;
          }
          else{
            this.form.get('installmentpaid').enable();
            this.form.get('installmentpaid').setValidators([Validators.required]);
            this.form.get('installmentpaid').setValue('');
            this.isEMICheck= true;
          }
        }
      
      })
        
  }

  noOfEMIs(n: number): any[] {
    return Array(n);
  }

save(){
  this.formData = this.form.getRawValue();

  if(!this.isEMICheck) { delete this.formData['installmentpaid']};
  if(this.id) this.registrationService.update(this.id,this.formData).subscribe(()=>{
    this.router.navigate(['/registrations']);
  }) 
        else this.registrationService.create(this.form.value).subscribe(()=>{this.router.navigate(['/registrations'])});
}
delete(){
    
  if(!confirm("Are you sure you want to delete ?")) return;

  this.registrationService.delete(this.id).subscribe(()=>this.router.navigate(['/registrations']));
}

  ngOnInit() {
    this.intializeForm();
    this.onChanges();
  }

}
