import { Component, OnInit,TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Abonnement } from '../models/abonnements';
import { UserService } from '../services/userService';
 
@Component({
  selector: 'app-abonnements',
  templateUrl: './abonnements.component.html',
  styleUrls: ['./abonnements.component.css']
})
export class AbonnementsComponent implements OnInit {
  abonnements: Abonnement[] = [];
  displayDialog = false;
  newAbonnement: Abonnement = {
    name: '',
    sessionCount: 0,
    duration: 0,
    price: 0,
  };

  userCount: number = 0;
  p: number = 1;
	displayDialog2 = false;
  displayDialog3 = false;
	isModal = false;
  bookingsForSession: any[] = [];  
  loadingBookings: boolean = false;  
  @ViewChild('bookingModal') bookingModal: TemplateRef<any> | undefined; 


  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,

  ) {}

  ngOnInit(): void {
    this.fetchAbonnements();
  }

  fetchAbonnements(): void {
    this.userService.getAbonnements().subscribe(
      (data) => {
        this.abonnements = data;
        this.fetchAbonnementUserCounts();
      },
      (error) => {
        console.error('Error fetching abonnements:', error);
      }
    );
  }

  fetchAbonnementUserCounts(): void {
    this.abonnements.forEach((abonnement) => {
      this.userService.getAbonnementUserCount(abonnement.id || '').subscribe(
        (data) => {
          abonnement.userCount = data.userCount;
         },
        (error) => {
          console.error(`Error fetching user count for abonnement `, error);
          abonnement.userCount = 0;  
        }
      );
    });
  }
  

  showDialog(): void {
    this.newAbonnement = {
      name: '',
      sessionCount: 0,
      duration: 0,
      price: 0,
    }; // Reset the form
    this.displayDialog = true;
  }

  addAbonnement(): void {
    this.userService.createAbonnement(this.newAbonnement).subscribe(
      (data) => {
        this.displayDialog = false;
        this.snackBar.open(
          `Abonnement "${data.name}" ajouté avec succès!`,
          'Fermer',
          { duration: 2000 }
        );
        this.fetchAbonnements(); // Refresh list
      },
      (error) => {
        console.error('Error adding abonnement:', error);
        this.snackBar.open(
          "Erreur lors de l'ajout de l'abonnement.",
          'Fermer',
          { duration: 2000 }
        );
      }
    );
  }



  deleteConfirmation(userId: string) {
   
		if (window.confirm('Etes-vous sûr de vouloir supprimer cet abonnement?')) {
		  this.deleteAbonnement(userId);
		}
	  }
	
	  
	  deleteAbonnement(userId: string) {
		 this.userService.deleteAbonnement(userId).subscribe(
		  () => {
 			this.fetchAbonnements();  
			this.openSnackBar2('Abonnement a été supprimé avec succès', 'Close');
		  },
		  error => {
			console.error('Error', error);
			this.openSnackBar2('Error user', 'Close');
		  }
		);
	  }
	  
    openSnackBar2(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 2000,
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
      });
  
  
    }

    openEditDialog(abonnement: Abonnement) {
      this.newAbonnement = { ...abonnement };
      this.displayDialog3 = true;  
    }
    
    
 

	  onUpdateAbonnement() {
      this.userService.updateAbonnement(this.newAbonnement).subscribe(
        (response) => {
        this.openSnackBar2('Abonnement mis à jour avec succès', 'Fermer');
        this.displayDialog3 = false;  
        this.fetchAbonnements(); 
        },
        (error) => {
        console.error('Erreur lors de la mise à jour du Abonnement', error);
        this.openSnackBar2('Erreur lors de la mise à jour du Abonnement !', 'Fermer');
        }
      );
      }



      openBookingModal(sessionId: string): void {
        this.loadingBookings = true;
        this.bookingsForSession = [];
      
        this.userService.getAbonnementUsers(sessionId).subscribe(
          (bookings) => {
             this.bookingsForSession = bookings;
            this.loadingBookings = false;
      
            if (this.bookingsForSession.length === 0) {
               this.openSnackBar2('Aucune réservation trouvée pour cette abonnement.', 'Fermer');
            } else {
               this.modalService.open(this.bookingModal, { centered: true });
            }
          },
          (error) => {
            console.error('Error fetching bookings:', error);
            this.loadingBookings = false;
            this.openSnackBar2('Aucune réservation trouvée pour cette abonnement.', 'Fermer');
          }
        );
      }
      
      
}