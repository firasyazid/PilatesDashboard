import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userService';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { ScheduledSession } from '../models/scheduledSession';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css'],
})
export class SessionsComponent implements OnInit {
  ScheduledSession: ScheduledSession[] = []; // All sessions
  filteredSessions: ScheduledSession[] = []; // Filtered sessions
  displayDialog = false;
  displayDialog2 = false;
  isModal = false;
  p: number = 1;
  selectedSession: any = {}; // Holds the session to edit

  newScheduledSession: ScheduledSession = {
    name: '',
    cours: {
      name: '',
      description: '',
      duration: 0,
      intensityLevel: '',
    },
    coach: {
      name: '',
      bio: '',
      expertise: '',
    },
    date: new Date(),
    startTime: '',
    endTime: '',
    maxCapacity: 0,
    currentCapacity: 0,
    createdAt: new Date(),
  };

  activeFilter: string = ''; // Track the active filter (today, week, month)
  coaches: any[] = []; // List of coaches
  courses: any[] = []; // List of courses

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private snackBar: MatSnackBar,
    private confirmationService: ConfirmationService,
     private modalService: NgbModal,

  ) {}

  ngOnInit(): void {
    this.getSessions(); 
    this.getCoaches();
      this.getCourses();
   }

  // Fetch all sessions from the API
  getSessions(): void {
    this.userService.getSession().subscribe((sessions: ScheduledSession[]) => {
      this.ScheduledSession = sessions;
      this.filteredSessions = sessions;  
    });
  }

  // Filter sessions for today
  filterToday(): void {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    this.filteredSessions = this.ScheduledSession.filter((session) => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      return sessionDate === today;
    });
    this.activeFilter = 'today'; // Set the active filter
  }

  // Filter sessions for this week
  filterThisWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6)); // Sunday

    this.filteredSessions = this.ScheduledSession.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    });
    this.activeFilter = 'week'; // Set the active filter
  }

  // Filter sessions for this month
  filterThisMonth(): void {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

    this.filteredSessions = this.ScheduledSession.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfMonth && sessionDate <= endOfMonth;
    });
    this.activeFilter = 'month'; // Set the active filter
  }

  // Display success message using SnackBar
  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }


  open(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  _addSession(ScheduledSession: ScheduledSession): void {
    this.userService.createSession(ScheduledSession).subscribe(
      () => {
        this.modalService.dismissAll();

        this.snackBar.open('La session a été créée avec succès!', 'Fermer', {
          duration: 2000,
        });
        this.getSessions(); 
      },
      () => {
        this.snackBar.open('Erreur : La session n\'a pas été créée!', 'Fermer', {
          duration: 2000,
        });
      }
    );
  }

  // Fetch list of coaches
  getCoaches(): void {
    this.userService.getCoach().subscribe((data: any[]) => {
      this.coaches = data;
      console.log(this.coaches);
    });
  }

  // Fetch list of courses
  getCourses(): void {
    this.userService.getCours().subscribe((data: any[]) => {
      this.courses = data;
      console.log(this.courses);
    });
  }

  deleteConfirmation(Id: string) {
    if(window.confirm('Etes-vous sûr de vouloir supprimer cet session?')) {
      this.DeleteSession(Id);
    }
    }
    
    DeleteSession(Id: string) {
      this.userService.deleteSession(Id).subscribe(() => {
        this.getSessions();
        this.openSnackBar('Session supprimé avec succès', 'Close');
      }
      );
    }
    

  // Edit session

  // Open the edit session dialog
  openEditDialog(user: ScheduledSession) {
    this.newScheduledSession = { ...user };
    this.displayDialog2 = true;
  }

  // Update session
  updateSession(): void {
    this.userService.updateSession(this.newScheduledSession).subscribe(
      () => {
        this.displayDialog2 = false;
  
        this.openSnackBar('Session mise à jour avec succès!', 'Fermer');
        this.getSessions();
      },
      () => {
        this.displayDialog = false;
        this.openSnackBar('Erreur : La session n\'a pas été mise à jour!', 'Fermer');
      }
    );
  }





}
