import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <app-header />

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: `main {
    margin-top: 2rem;
    display: flex;
    max-width: 1200px;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto
  }`,
})
export class AppComponent {
  title = 'My Awesome Signal Store';
}
