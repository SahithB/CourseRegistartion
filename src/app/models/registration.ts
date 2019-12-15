import { Course } from './course'
import { Student } from './student'


export class Registration{
    student: Student;
    course: Course;
    modeOfPayment: string;
    installmentpaid: number;
    joiningDate: Date;
}