import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userService';
import { Router } from '@angular/router';
 import { MatSnackBar } from '@angular/material/snack-bar';
 import { Booking } from '../models/bookings';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = []; // All bookings
  filteredBookings: Booking[] = []; // Filtered bookings
  activeBookingFilter: string = ''; // Track the active filter (today, week, month)
  p: number = 1;

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
    this.getBookings(); // Fetch bookings on initialization
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
filterBookingsThisWeek(): void {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Get Monday of this week
  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay())); // Get Sunday of this week

  this.filteredBookings = this.bookings.filter((booking) => {
    if (booking.createdAt) {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
    }
    return false; // Skip if createdAt is undefined
  });
  this.activeBookingFilter = 'week'; // Set the active filter to 'week'
}


// Filter bookings for this month
filterBookingsThisMonth(): void {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Get the first day of this month
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Get the last day of this month

  this.filteredBookings = this.bookings.filter((booking) => {
    if (booking.createdAt) {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
    }
    return false; // Skip if createdAt is undefined
  });
  this.activeBookingFilter = 'month'; // Set the active filter to 'month'
}

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
  

}
