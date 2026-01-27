import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from "@angular/forms";
import { NgClass, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, ButtonModule, DialogModule, FormsModule, NgIf, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  mode: 'login' | 'register' = 'login';

  // Sign Up Variables
  username: string | null = null;
  email: string | null = null;
  password: string | null = null;
  confirmPassword: string | null = null;

  usernameTouched = false;
  emailTouched = false;
  passwordTouched = false;
  confirmPasswordTouched = false;

  constructor(private authService: AuthService) {}

  /**
   * Getter to validate Username
   */
  get isUsernameInvalid(): boolean {
    if (!this.usernameTouched) return false;
    if (!this.username || this.username.trim().length === 0 || this.username.length < 3) return true;

    return false;
  }

  getUsernameClass() {
    if (!this.usernameTouched) return '';
    return this.isUsernameInvalid ? 'p-invalid' : 'valid';
  }

  /**
   * Getter to validate Email
   */
  get isEmailInvalid(): boolean {
    if (!this.emailTouched) return false;
    if (!this.email || this.email.trim().length === 0) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(this.email.trim());
  }

  getEmailClass() {
    if (!this.emailTouched) return '';
    return this.isEmailInvalid ? 'p-invalid' : 'valid';
  }

  /**
   * Getter to validate Password
   */
  get isPasswordInvalid(): boolean {
    if (this.password == null) return false;
    if (this.password.trim().length === 0) return false;

    if (this.mode === 'register') {
      // Password is 8 chars, 1 lowercase, 1 uppercase, 1 number, 1 special char
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      return !passwordRegex.test(this.password.trim())
    }
    return false;
  }

  getPasswordClass() {
    if (!this.passwordTouched) return '';
    return this.isPasswordInvalid ? 'p-invalid' : 'valid';
  }

  /**
   * Getter to validate ConfirmPassword
   */
  get isConfirmPasswordInvalid(): boolean {
    if (!this.confirmPasswordTouched) return false;

    // Password = ConfirmPassword
    if (this.mode === 'register' && this.password !== this.confirmPassword) return true;

    return false;
  }

  getConfirmPasswordClass() {
    if (!this.confirmPasswordTouched) return '';
    return this.isConfirmPasswordInvalid ? 'p-invalid' : 'valid';
  }

  /**
   * Getter to validate if User can submit Login / Register
   */
  get canSubmit(): boolean {
    // Login
    if (this.mode === 'login') {
      return (
        !this.isEmailInvalid && !this.isPasswordInvalid
      );
    }

    // Register
    return (
      !this.isEmailInvalid && !this.isUsernameInvalid && !this.isPasswordInvalid
    )
  }

  onUsernameChange(value: string | null) {
    this.username = value;

    if (value && value.trim().length > 0) this.usernameTouched = true;
    else this.usernameTouched = false;
  }

  onEmailChange(value: string | null) {
    this.email = value;

    if (value && value.trim().length > 0) this.emailTouched = true;
    else this.emailTouched = false;
  }

  onPasswordChange(value: string | null) {
    this.password = value;

    if (value && value.trim().length > 0) this.passwordTouched = true;
    else this.passwordTouched = false;
  }

  onConfirmPasswordChange(value: string | null) {
    this.confirmPassword = value;

    if (value && value.trim().length > 0) this.confirmPasswordTouched = true;
    else this.confirmPasswordTouched = false;
  }

  /**
   * Swaps mode from Login <-> Register
   */
  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
  }

  /**
   * Submits the user's input depending on the mode
   */
  submit() {
    if (this.mode === 'login') {
      console.log("Vai fazer o login!");

      const payload = {
        email: this.email,
        password: this.password
      };

      this.authService.login(payload).subscribe({
        next: (data: any) => {
          this.authService.setSession(data.token);
        },
        error: err => {
          console.error(err);
        }
      })
    } else {
      console.log("Vai fazer o register!");
      // TODO Register
    }
    this.close();
  }

  /**
   * Fecha a Dialog.
   * É corrido cada vez que a p-dialog se esconde (onHide).
   */
  close() {
    // Devolve para o componente-pai a variável como false
    this.visibleChange.emit(false);
  }
}
