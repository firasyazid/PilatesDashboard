 


import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/userService';
import { Medecin
 } from '../models/medecin';
 import { Cours } from '../models/cours';
 import { test } from '../models/tests';
 import { Medecin2 } from '../models/medecin2';
 import { Router } from '@angular/router';
 import { MessageService } from 'primeng/api';
 import { MatSnackBar } from '@angular/material/snack-bar';
 import { ConfirmationService } from 'primeng/api';  
import { Form } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Speciality } from '../models/speciality';
import { LocalstorageService } from '../services/LocalstorageService';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  imageDisplay!: string | ArrayBuffer;
  displayDialog2 = false;
  isModal = false;

  medecin:Medecin[] = [];
  newMedecin:Medecin2 = { 
    _id: '',
    fullname: '',
    speciality:  "",
    description: '',
    phone: '',
    address: '',
    image: '',
    region: '',
  }

  courses: Cours[] = [];
  newCours: Cours = {
    _id: '',
    name: '',
    description: '',
    duration: 0,
    price: 0,
    intensityLevel: 'Débutant',
    createdAt: new Date(),
  }

Tests:test[] = [];
newTest: test = {
  _id: '',
  name: '',
  createdAt: new Date(),
}
p: number = 1;  

  specOptions: Speciality[] = [];
	selected!: Speciality;

  constructor( 
    private userService: UserService,
     private snackBar: MatSnackBar,
     private modalService: NgbModal,
      private localStorageService: LocalstorageService ,
      private router: Router, 

  ) { }

  ngOnInit(): void {
    this._getMedecin();
    this.SpecOptions();
    this.GetTests();
    this.GetCours();
   }

    addCours(cours: Cours): void {
      this.userService.createCours(cours).subscribe(
        response => {
          console.log('Cours ajouté avec succès:', response);
          this.openSnackBar2('Cours ajouté avec succès', 'Close');
           this.modalService.dismissAll();
          this.GetCours();
        },
        error => {
          console.error('Error adding course:', error);
          this.openSnackBar2('Error adding course', 'Close');
        }
      );
    }

GetCours() {
  this.userService.getCours().subscribe(
    (cours: Cours[]) => {
      this.courses = cours;
    },
    (error) => {
      console.error('Failed to load courses', error);
    }
  );
}


deleteConfirmation(Id: string) {
if(window.confirm('Etes-vous sûr de vouloir supprimer ce cours?')) {
  this.DeleteCours(Id);
}
}

DeleteCours(Id: string) {
  this.userService.deleteCours(Id).subscribe(() => {
    this.GetCours();
    this.openSnackBar2('Cours supprimé avec succès', 'Close');
  }
  );
}

 
openEditDialog(user: Cours) {
  this.newCours = { ...user };
  this.displayDialog2 = true;
}


onUpdateCours() {
  this.userService.updateCours(this.newCours).subscribe(
    response => {
       this.openSnackBar2('Cours mis à jour avec succès', 'Fermer');

      this.displayDialog2 = false;  
      this.GetCours();
    },
    error => {
      console.error('Erreur lors de la mise à jour du cours', error);
      this.openSnackBar2('Le cours n\'a pas pu être mis à jour !', 'Fermer');
    }
  );
}

















/////





AddTest (test: test): void {
  this.userService.addTest(test).subscribe(
    response => {
       this.openSnackBar2('Test added successfully', 'Close');
      this.Tests.push(response);
      this.GetTests();
      this.modalService.dismissAll();
     },
    error => {
      console.error('Error adding test:', error);
      this.openSnackBar2('Error adding test', 'Close');}
  );
}


GetTests() {
  this.userService.getTests().subscribe(
    (tests: test[]) => {
      this.Tests = tests;
    },
    (error) => {
      console.error('Failed to load tests', error);
    }
  );
}
 
deleteConfirmations(testId: string) {

  const loggedInUserRole = this.localStorageService.getRole();
  
  if (loggedInUserRole !== 'Super Admin') {
    this.openSnackBar2('Access denied. You do not have permission to delete users.', 'Close');
    return;
  }

if(window.confirm('Are you sure you want to delete this test?')) {
  this.DeleteTest(testId);
}
}

DeleteTest(testId: string) {

  this.userService.deletetTest(testId).subscribe(() => {
    this.GetTests();
    this.openSnackBar2('Test deleted successfully', 'Close');
  }
  );
}

navigateToCategories(testId: string): void {
  this.router.navigate(['/admin/test-categories', testId]);
}

   ////

	open(content: any) {
		this.modalService.open(content);
	}

  private _getMedecin() {
    this.userService.getMedecin().subscribe((med) => {
      this.medecin = med;
    });
  }










  deleteDoc(userId: string) {
    this.userService.deleteMedecin(userId).subscribe(() => {
        this._getMedecin();
        this.openSnackBar2('Test deleted successfully', 'Close');
    });
}



openSnackBar2(message: string, action: string) {
  this.snackBar.open(message, action, {
      duration: 2000,  
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
  });
}


addMedecin(medecin: Medecin2, imageUrl: string ): void {
  this.userService.addMedecin(medecin, imageUrl).subscribe(
    response => {
      console.log('Medecin added successfully:', response);
      this.openSnackBar2('Doctor added successfully', 'Close');
      this._getMedecin();
      this.modalService.dismissAll();
     },
    error => {
      console.error('Error adding medecin:', error);
      this.openSnackBar2('Error adding doctor', 'Close');}
  );
}

 
onImageUpload(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.newMedecin.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageDisplay = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

 
SpecOptions() {
  this.userService.getSpec().subscribe(
    (options: Speciality[]) => {
    this.specOptions = options;
    console.log('spec options', options);
    },
    (error) => {
    console.error('Failed to load spec options', error);
    }
  );
  }  


  onSpecialityChange(event: any) {
    if (event.value) {
      this.newMedecin.speciality = event.value._id; 
    }


  }



}
 
 

 

 

