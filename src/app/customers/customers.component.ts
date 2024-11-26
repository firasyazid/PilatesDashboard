import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/userService';
import { Router } from '@angular/router';
 import { MatSnackBar } from '@angular/material/snack-bar';
 import { Coach } from '../models/coach';
import { timer } from 'rxjs';

@Component({
	selector: 'app-customers',
	templateUrl: './customers.component.html',
	styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
	imageDisplay!: string | ArrayBuffer;
	coaches: Coach[] = [];
	displayDialog = false;
	displayDialog2 = false;
	isModal = false;
	p: number = 1;
	newCoach: Coach = {
		name: '',
		bio: '',
		expertise: '',
		image: ''
	};





	constructor(private modalService: NgbModal,
		private userService: UserService,
		private router: Router,
 		private snackBar: MatSnackBar,
 

	) {


	}

	ngOnInit(): void {
		this.getCoaches();
	}


	getCoaches() {
		this.userService.getCoach().subscribe((coaches: Coach[]) => {
			this.coaches = coaches;
		});
	}

	showDialog(): void {
		this.displayDialog = true;
	}


	openSnackBar2(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 2000,
			horizontalPosition: 'left',
			verticalPosition: 'bottom',
		});


	}

	onImageUpload(event: any): void {
		const file = event.target.files[0];
		if (file) {
			this.newCoach.image = file;
			const reader = new FileReader();
			reader.onload = () => {
				this.imageDisplay = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	convertToFormData(newCoach: Coach): FormData {
		const formData = new FormData();
		formData.append('name', newCoach.name);
		if (newCoach.bio) formData.append('bio', newCoach.bio);
		if (newCoach.expertise) formData.append('expertise', newCoach.expertise);
		if (newCoach.image) formData.append('image', newCoach.image);
		return formData;
	}


	_addCoach(newCoach: FormData): void {
		this.userService.createCoach(newCoach).subscribe(
			(coach: Coach) => {
				this.openSnackBar2(`Coach ${coach.name} a été créé avec succès!`, 'Fermer');
				this.displayDialog = false; // Close the dialog
				this.getCoaches(); // Refresh the coaches list
			},
			() => {
				this.openSnackBar2('Erreur : Le coach n\'a pas été créé!', 'Fermer');
			}
		);
	}


	deleteConfirmation(userId: string) {
   
		if (window.confirm('Etes-vous sûr de vouloir supprimer cet entraîneur?')) {
		  this.deleteCoach(userId);
		}
	  }
	
	  
	  deleteCoach(userId: string) {
		 this.userService.deleteCoach(userId).subscribe(
		  () => {
			console.log('User deleted successfully');
			this.getCoaches();  
			this.openSnackBar2('Lentraîneur a été supprimé avec succès', 'Close');
		  },
		  error => {
			console.error('Error', error);
			this.openSnackBar2('Error user', 'Close');
		  }
		);
	  }
	  


	  openEditDialog(user: Coach) {
		this.newCoach = { ...user };
		this.displayDialog2 = true;
	  }



	  onUpdateCoach() {
		this.userService.updateCoach(this.newCoach).subscribe(
		  (response) => {
			this.openSnackBar2('Coach mis à jour avec succès', 'Fermer');
			this.displayDialog2 = false;  
			this.getCoaches(); 
		  },
		  (error) => {
			console.error('Erreur lors de la mise à jour du coach', error);
			this.openSnackBar2('Erreur lors de la mise à jour du coach !', 'Fermer');
		  }
		);
	  }
	  

}


































































