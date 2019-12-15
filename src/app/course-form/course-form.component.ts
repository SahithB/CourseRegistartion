import { take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from './../services/course.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
    selector: 'app-course-form',
    templateUrl: './course-form.component.html',
    styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {

    courses: any[];
    EMIAllowed:boolean=false;
    form;
    id;
    constructor(
        private service: CourseService,
        private router: Router,
        private route: ActivatedRoute) {
        
         this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) { 
            
            this.service.get(this.id).pipe(take(1)).subscribe(c => {
            
            this.form.get('name').setValue(c.name);
            this.form.get('faculty').setValue(c.faculty);
            this.form.get('fees').setValue(c.fees);
            this.form.get('batchSizeAvl').setValue(c.batchSizeAvl);
            this.form.get('duration').setValue(c.duration);
            this.form.get('isEMIAllowed').setValue(c.isEMIAllowed ? "true" : "false");
            this.form.get('allowedInstallments').setValue(c.allowedInstallments);
            })
        }

    }

    intializeForm(){
        this.form = new FormGroup({

            name: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(55)
            ]),
            faculty: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(55)
            ]),
            fees: new FormControl('', [
                Validators.required,
                Validators.min(500)
            ]),
            batchSizeAvl: new FormControl('', [
                Validators.required,
                Validators.min(5)
            ]),
            duration: new FormControl('', [
                Validators.required,
                Validators.min(1)
            ]),
            isEMIAllowed: new FormControl('false', []),
            allowedInstallments: new FormControl({value:'',disabled: true},[])
        });
    }
   
    get name() { return this.form.get('name') };
    get faculty() { return this.form.get('faculty') };
    get fees() { return this.form.get('fees') };
    get batchSizeAvl() { return this.form.get('batchSizeAvl') };
    get duration() { return this.form.get('duration') };
    get isEMIAllowed() { return this.form.get('isEMIAllowed') };
    get allowedInstallments() { return this.form.get('allowedInstallments') };

    onChanges() {
        this.form.get('isEMIAllowed').valueChanges
        .subscribe(type => {
            if (type == 'false') {
                this.form.get('allowedInstallments').reset();
                this.form.get('allowedInstallments').clearValidators();
                this.form.get('allowedInstallments').disable();
                this.EMIAllowed=false;
            }
            else {
                this.form.get('allowedInstallments').enable();
                this.form.get('allowedInstallments').setValidators([Validators.required]);
                this.form.get('allowedInstallments').setValue('');
                this.EMIAllowed=true;
            }
        });
    }

    save() {
        this.form.value.isEMIAllowed = JSON.parse(this.form.value.isEMIAllowed);
        
        if(this.id) this.service.update(this.id,this.form.value).subscribe(()=>{this.router.navigate(['/courses']);}) 
        else this.service.create(this.form.value).subscribe(()=>{this.router.navigate(['/courses']);})
    
}

    delete(){
    
        if(!confirm("Are you sure you want to delete ?")) return;

        this.service.delete(this.id).subscribe(()=>this.router.navigate(['/courses']));
    
    }
    ngOnInit() {
        this.intializeForm();
        this.onChanges();
        
    }

}
