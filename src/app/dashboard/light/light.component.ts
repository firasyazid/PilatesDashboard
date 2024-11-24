import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userService';
import { Router } from '@angular/router';
 import { MatSnackBar } from '@angular/material/snack-bar';
 import { Booking } from '../../models/bookings';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ScheduledSession } from '../../models/scheduledSession';

@Component({
  selector: 'app-light',
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.css']
})
export class LightComponent implements OnInit {
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  hours: string[] = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  bookings: Booking[] = []; // All bookings
  scheduledSessions: ScheduledSession[] = []; // All scheduled sessions for the dropdown

  constructor(  
    private userService: UserService,
    private router: Router,
     private snackBar: MatSnackBar,
     private modalService: NgbModal


  ) { }

  ngOnInit(): void {
   }
  
}
