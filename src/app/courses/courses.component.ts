import { CourseService } from './../services/course.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';
import {Course} from './../models/course';

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit,OnDestroy {

  courses: Course[];
  subscription: Subscription;
  filteredCourses:Course[];
  

  

  constructor(private service: CourseService) {
    this.subscription=this.service.getAll().subscribe(
      courses=>this.courses=this.filteredCourses=courses)
   }


   filter(query:string){
     console.log(query);
    this.filteredCourses = (query) ?
      this.courses.filter( p => p.name.toString().toLowerCase().includes(query.toString().toLowerCase()) )
      :this.courses
   }

  ngOnInit() {
      
    }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    }
  }


