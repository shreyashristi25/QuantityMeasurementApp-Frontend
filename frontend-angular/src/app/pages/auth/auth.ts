import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

// ── Validation helpers (same rules as backend) ──────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]).{8,}$/;
const MOBILE_RE = /^[0-9]{10}$/;

function validateEmail(v: string): string {
  if (!v.trim()) return 'Email is required';
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address';
  return '';
}

function validatePassword(v: string, strict = true): string {
  if (!v) return 'Password is required';
  if (v.length < 8) return 'Password must be at least 8 characters';
  if (strict && !PASSWORD_RE.test(v))
    return 'Password must contain at least one letter, one digit, and one special character';
  return '';
}

function validateName(v: string): string {
  if (!v.trim()) return 'Full name is required';
  if (v.trim().length < 2 || v.trim().length > 50)
    return 'Name must be between 2 and 50 characters';
  return '';
}

function validateMobile(v: string): string {
  if (!v.trim()) return 'Mobile number is required';
  if (!MOBILE_RE.test(v)) return 'Mobile number must be exactly 10 digits';
  return '';
}

@Component({
  selector: 'app-auth',
  imports: [FormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent implements OnInit {
  activeTab: 'login' | 'signup' = 'login';

  // Login fields
  loginEmail = '';
  loginPassword = '';

  // Login errors
  loginEmailError = '';
  loginPasswordError = '';
  loginServerError = '';

  // Signup fields
  signupName = '';
  signupEmail = '';
  signupPassword = '';
  signupMobile = '';

  // Signup errors
  signupNameError = '';
  signupEmailError = '';
  signupPasswordError = '';
  signupMobileError = '';
  signupServerError = '';

  popupVisible = false;
  popupText = '';
  emojiPieces: { emoji: string; x: number; y: number }[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] === 'signup' ? 'signup' : 'login';
    });
  }

  showTab(tab: 'login' | 'signup'): void {
    this.activeTab = tab;
    this.clearAllErrors();
  }

  togglePassword(input: HTMLInputElement): void {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  submitLogin(): void {
    this.loginEmailError = validateEmail(this.loginEmail);
    this.loginPasswordError = validatePassword(this.loginPassword, false);
    this.loginServerError = '';

    if (this.loginEmailError || this.loginPasswordError) return;

    this.isLoading = true;
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.loginServerError =
          err.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  // ── SIGNUP ─────────────────────────────────────────────────────────────────
  submitSignup(): void {
    this.signupNameError = validateName(this.signupName);
    this.signupEmailError = validateEmail(this.signupEmail);
    this.signupPasswordError = validatePassword(this.signupPassword, true);
    this.signupMobileError = validateMobile(this.signupMobile);
    this.signupServerError = '';

    if (
      this.signupNameError ||
      this.signupEmailError ||
      this.signupPasswordError ||
      this.signupMobileError
    ) return;

    this.isLoading = true;
    this.authService
      .register(this.signupName, this.signupEmail, this.signupPassword, this.signupMobile)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.showPopup('Successfully registered! Please login.');
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status === 400 && err.error) {
            // Map field-level backend validation errors
            const e = err.error;
            if (e.name) this.signupNameError = e.name;
            if (e.email) this.signupEmailError = e.email;
            if (e.password) this.signupPasswordError = e.password;
            if (e.mobile) this.signupMobileError = e.mobile;
          } else {
            this.signupServerError =
              err.error?.message || 'Registration failed. Please try again.';
          }
        }
      });
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;
    this.emojiPieces = this.createEmojiBurst();
  }

  closePopup(): void {
    this.popupVisible = false;
    this.emojiPieces = [];
    if (this.popupText.includes('registered')) {
      this.showTab('login');
    }
  }

  private clearAllErrors(): void {
    this.loginEmailError = '';
    this.loginPasswordError = '';
    this.loginServerError = '';
    this.signupNameError = '';
    this.signupEmailError = '';
    this.signupPasswordError = '';
    this.signupMobileError = '';
    this.signupServerError = '';
  }

  private createEmojiBurst(): { emoji: string; x: number; y: number }[] {
    const pieces: { emoji: string; x: number; y: number }[] = [];
    const symbols = ['🎉', '✨', '🎊', '💥', '🌟', '🎈'];
    const total = 18;
    for (let i = 0; i < total; i += 1) {
      const angle = (Math.PI * 2 * i) / total;
      const distance = 90 + Math.random() * 180;
      pieces.push({
        emoji: symbols[i % symbols.length],
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    }
    return pieces;
  }
}
