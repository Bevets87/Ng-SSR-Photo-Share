import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  loginMode: boolean;
  form: FormGroup;
  errorMessage: string;
  private formStatusSubscription: Subscription;
  private serverErrorSubscription: Subscription;
  private serverErrorMessage: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }
  private createLoginForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  private createRegisterForm(): FormGroup {
    return new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      password_confirmation: new FormControl('', Validators.required)
    }, this.matchPasswords);
  }



  private matchPasswords(group: FormGroup): {[s: string]: boolean } {
    const password = group.controls.password.value;
    const password_confirmation = group.controls.password_confirmation.value;
    if (password && password_confirmation) {
      return password === password_confirmation ? null : { 'matchPasswords': true };
    }
    return null;
  }
  onSubmit() {
    if (this.loginMode) {
      this.authService.login(this.form.value);
    } else {
      this.authService.register(this.form.value);
    }

  }
  private createAuthForm() {
    this.loginMode = this.route.snapshot.data['loginMode'];
    if (this.loginMode) {
      this.form = this.createLoginForm();
    } else {
      this.form = this.createRegisterForm();
    }
  }
  private subscribeToServerErrors() {
    this.serverErrorSubscription = this.authService.errorMessage.subscribe(
      (message: string) => {
        this.serverErrorMessage = message;
        this.form.setErrors({'server': true });
      }
    );
  }

  private getFormErrorMessage(): string {
    if (this.form.errors) {
      if (this.form.errors.server) {
        return this.serverErrorMessage;
      }
      if (this.form.errors.matchPasswords) {
        return 'passwords must match';
      }
    }
    if (this.form.controls.username.errors) {
      if (this.form.controls.username.errors.required) {
        return 'username is required';
      }
    }
    if (this.form.controls.password.errors) {
      if (this.form.controls.password.errors.required) {
        return 'password is required';
      }
    }
    if (this.form.controls.password_confirmation.errors) {
      if (this.form.controls.password_confirmation.errors.required) {
        return 'password confirmation is required';
      }
    }

  }

  private subscribeToFormStatus() {
    this.formStatusSubscription = this.form.statusChanges.subscribe(
      (value) => {
        if (value === 'INVALID') {
          const message = this.getFormErrorMessage();
          this.errorMessage = message;
        }
      }
    );
  }


  ngOnInit() {
    this.createAuthForm();
    this.subscribeToServerErrors();
    this.subscribeToFormStatus();

  }

  ngOnDestroy() {
    this.authService.clearError();
    this.serverErrorSubscription.unsubscribe();
    this.formStatusSubscription.unsubscribe();
  }

}
