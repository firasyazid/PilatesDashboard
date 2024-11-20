import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
 import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/AuthService';
import { LocalstorageService } from '../../services/LocalstorageService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup! : FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage = 'Email or Password are wrong';

  constructor(private formBuilder: FormBuilder,
    private auth: AuthService,
    private localstorageService: LocalstorageService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this._initLoginForm();

  }
  private _initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
  get loginForm() {
    return this.loginFormGroup.controls;
  }
//umu48cej
onSubmit() {
  this.isSubmitted = true;
  if (this.loginFormGroup.invalid) return;

  this.auth.login(this.loginForm['email'].value, this.loginForm['password'].value).subscribe(
    (user) => {
      this.authError = false;
      this.localstorageService.setToken(user.token);
      this.localstorageService.setUserName(user.fullname || '');
      this.localstorageService.setRole(user.role || '');

      console.log(user);
      // Check if the user is an admin
      if (!user.isAdmin) {
        this.authError = true;
        this.authMessage = 'Accès refusé. Vous n\'avez pas la permission d\'accéder à cette page.';
      } else {
        // If the user is an admin, allow access to the admin page
        this.router.navigate(['/admin/index']);
      }
    },
    (error: HttpErrorResponse) => {
      this.authError = true;
      if (error.status !== 400) {
        this.authMessage = 'Erreur du serveur, veuillez réessayer plus tard!';
      } else {
        this.authMessage = 'E-mail ou mot de passe invalide.';
      }
    }
  );
}



}
