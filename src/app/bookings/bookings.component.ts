import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userService';
import { Router } from '@angular/router';
 import { MatSnackBar } from '@angular/material/snack-bar';
 import { Booking } from '../models/bookings';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ScheduledSession } from '../models/scheduledSession';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {


  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  hours: string[] = Array.from({ length: 17 }, (_, i) => `${i + 7}:00`); // From 7:00 to 23:00

  bookings: Booking[] = []; // All bookings
  filteredBookings: Booking[] = []; // Filtered bookings
  activeBookingFilter: string = ''; // Track the active filter (today, week, month)
  p: number = 1;
  selectedFilter: string = ''; // Track the selected filter
  scheduledSessions: ScheduledSession[] = []; // All scheduled sessions for the dropdown
  selectedSessionName: string = ''; // Track selected session

  newBooking: Booking = {
    scheduledSession: {
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
    },
    user: {
      fullname: '',
      email: '',
    },
    status: 'confirmé',
    createdAt: new Date(),
  };

  constructor(
    private userService: UserService,
    private router: Router,
     private snackBar: MatSnackBar,
     private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getBookings(); 
    this.getScheduledSessionsForToday();
    this.getScheduledSessionsForWeek();

  }

  // Fetch all bookings from the API
  getBookings(): void {
    this.userService.getBooking().subscribe(
      (bookings: Booking[]) => {
        this.bookings = bookings;
        this.filteredBookings = bookings; // Initially display all bookings
      },
      (error) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

 // Filter bookings for today
 filterBookingsToday(): void {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  this.filteredBookings = this.bookings.filter((booking) => {
    if (booking.createdAt) {
      const bookingDate = new Date(booking.createdAt).toISOString().split('T')[0];
      return bookingDate === today;
    }
    return false; // Skip if createdAt is undefined
  });
  this.activeBookingFilter = 'today'; // Set the active filter to 'today'
}


// Filter bookings for this week
// Filter bookings for this week
filterBookingsThisWeek(): void {
  const today = new Date();

  // Set startOfWeek to Monday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() || 7) - 1)); // Adjust to Monday
  startOfWeek.setHours(0, 0, 0, 0);

  // Set endOfWeek to Sunday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to get Sunday
  endOfWeek.setHours(23, 59, 59, 999); // Ensure it includes all of Sunday

  this.filteredBookings = this.bookings.filter((booking) => {
    if (booking.createdAt) {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    }
    return false;
  });

  this.activeBookingFilter = 'week'; // Set the active filter to 'week'
}

// Filter bookings by each day of the week
filterBookingsByDay(day: string): void {
  const today = new Date();

  // Calculate startOfWeek based on Monday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() || 7) - 1)); // Adjust to Monday
  startOfWeek.setHours(0, 0, 0, 0);

  // Calculate the specific day
  const targetDate = new Date(startOfWeek);
  const dayIndex = this.weekDays.indexOf(day.charAt(0).toUpperCase() + day.slice(1).toLowerCase());
  if (dayIndex >= 0) {
    targetDate.setDate(startOfWeek.getDate() + dayIndex); // Adjust to the selected day
    targetDate.setHours(0, 0, 0, 0);
  }

  this.filteredBookings = this.bookings.filter((booking) => {
    if (booking.createdAt) {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate.toDateString() === targetDate.toDateString();
    }
    return false;
  });

  this.activeBookingFilter = day.toLowerCase(); // Set the active filter to the selected day
}



// Filter bookings for this month
 

deleteConfirmation(Id: string) {
  if(window.confirm('Etes-vous sûr de vouloir supprimer cet réservation?')) {
    this.DeleteBooking(Id);
  }
  }
  
  DeleteBooking(Id: string) {
    this.userService.deleteBooking(Id).subscribe(() => {
      this.getBookings();
      this.openSnackBar('réservation supprimé avec succès', 'Close');
    }
    );
  }
   // Display success message using SnackBar
   openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }

  updateBookingStatus(booking: Booking, newStatus: "confirmé" | "annulé"): void {
    const updatedBooking: Booking = { ...booking, status: newStatus }; // Update the status locally
  
    this.userService.updateBooking(updatedBooking).subscribe(
      () => {
        this.openSnackBar('Statut de réservation mis à jour avec succès!', 'Fermer');    
        this.getBookings();  
      },
      () => {
        this.openSnackBar('Erreur : Le statut de la réservation n\'a pas été mis à jour!', 'Fermer'); // Show error notification
      }
    );
  }
  
// Filter bookings for each day of the week
 


// Filter bookings for this month
filterBookingsThisMonth(): void {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

  this.filteredBookings = this.bookings.filter((booking) => {
    if (booking.createdAt) {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
    }
    return false;
  });

  this.activeBookingFilter = 'month'; // Set the active filter to 'month'
}


getScheduledSessionsForToday(): void {
  const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  this.userService.getSession().subscribe(
    (sessions: ScheduledSession[]) => {
      // Filter sessions that match today's date
      this.scheduledSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date).toISOString().split('T')[0];
        return sessionDate === today;
      });
    },
    (error) => {
      console.error('Error fetching scheduled sessions:', error);
    }
  );
}

// Apply filter based on the selected session
filterBookingsBySession(): void {
  if (this.selectedSessionName) {
    this.filteredBookings = this.bookings.filter(
      (booking) => booking.scheduledSession.name === this.selectedSessionName
    );
  } else {
    this.filteredBookings = this.bookings; // Show all bookings if no session is selected
  }
}













getSessionsForDayAndHour(day: string, hour: string): ScheduledSession[] {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - ((today.getDay() + 6) % 7))); // Commence lundi
  const targetDate = new Date(startOfWeek);
  targetDate.setDate(startOfWeek.getDate() + this.weekDays.indexOf(day)); // Trouve le jour de la semaine

  return this.scheduledSessions.filter((session) => {
    const sessionDate = new Date(session.date);
    const sessionHour = parseInt(session.startTime.split(':')[0], 10);

    return (
      sessionDate.toDateString() === targetDate.toDateString() &&
      sessionHour === parseInt(hour, 10)
    );
  });
}

getScheduledSessionsForWeek(): void {
  const today = new Date();
  // Définir le début de la semaine (lundi 00:00)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7)); // Lundi
  startOfWeek.setHours(0, 0, 0, 0); // Lundi à 00:00

  // Définir la fin de la semaine (dimanche 23:59:59)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche
  endOfWeek.setHours(23, 59, 59, 999); // Dimanche à 23:59:59

  this.userService.getSession().subscribe(
    (sessions: ScheduledSession[]) => {
      this.scheduledSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek; // Sessions entre lundi et dimanche
      });

      console.log('Sessions planifiées pour cette semaine :', this.scheduledSessions);
    },
    (error) => {
      console.error('Erreur lors de la récupération des sessions planifiées :', error);
    }
  );
}

 

}
