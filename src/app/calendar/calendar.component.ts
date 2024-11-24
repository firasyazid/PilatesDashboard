import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userService';
import { Router } from '@angular/router';
 import { MatSnackBar } from '@angular/material/snack-bar';
 import { Booking } from '../models/bookings';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 import { ScheduledSession } from '../models/scheduledSession';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  weekDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  hours: string[] = Array.from({ length: 17 }, (_, i) => `${i + 7}:00`); // From 7:00 to 23:00
  bookings: Booking[] = [];  
  scheduledSessions: ScheduledSession[] = []; 

  constructor(  
    private userService: UserService,
    private router: Router,
     private snackBar: MatSnackBar,
     private modalService: NgbModal


  ) { }

  ngOnInit(): void {
    this.getScheduledSessionsForWeek();
    
   }

   getSessionsForDayAndHour(day: string, hour: string): ScheduledSession[] {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - ((today.getDay() + 6) % 7))); // Monday as the start of the week
    const targetDate = new Date(startOfWeek);
    targetDate.setDate(startOfWeek.getDate() + this.weekDays.indexOf(day)); // Find the target day
  
    return this.scheduledSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      const sessionHour = parseInt(session.startTime.split(':')[0], 10); // Extract hour from session start time
  
      // Match both the day and the hour
      return (
        sessionDate.toDateString() === targetDate.toDateString() &&
        sessionHour === parseInt(hour, 10)
      );
    });
  }
  
   
  getScheduledSessionsForWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - ((today.getDay() + 6) % 7))); // Début au lundi
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Fin au dimanche
  
    this.userService.getSession().subscribe(
      (sessions: ScheduledSession[]) => {
        this.scheduledSessions = sessions.filter((session) => {
          const sessionDate = new Date(session.date);
          return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
        });
     
      },
      (error) => {
        console.error('Erreur lors de la récupération des sessions planifiées :', error);
      }
    );
  }

  
  

}
