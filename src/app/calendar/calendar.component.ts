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
  ) {}

  ngOnInit(): void {
    this.getScheduledSessionsForWeek();
  }

  // Calculer le début de la semaine (lundi)
  getStartOfWeek(): Date {
    const today = new Date();
    const day = today.getDay(); // 0 pour dimanche, 1 pour lundi, etc.
    const diff = (day === 0 ? -6 : 1) - day; // Ajuster pour que lundi = jour de début
    const monday = new Date(today.setDate(today.getDate() + diff));
    monday.setHours(0, 0, 0, 0); // Lundi à minuit
    return monday;
  }

  getSessionsForDayAndHour(day: string, hour: string): ScheduledSession[] {
    const startOfWeek = this.getStartOfWeek();
    const targetDate = new Date(startOfWeek);
    targetDate.setDate(startOfWeek.getDate() + this.weekDays.indexOf(day));

    return this.scheduledSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      const sessionHour = parseInt(session.startTime.split(':')[0], 10);

      // Comparer correctement les dates
      return (
        sessionDate.getFullYear() === targetDate.getFullYear() &&
        sessionDate.getMonth() === targetDate.getMonth() &&
        sessionDate.getDate() === targetDate.getDate() &&
        sessionHour === parseInt(hour, 10)
      );
    });
  }

  getScheduledSessionsForWeek(): void {
    const startOfWeek = this.getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche

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
