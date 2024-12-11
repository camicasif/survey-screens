import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDivider } from '@angular/material/divider';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
@Component({
  selector: 'app-sidenav-layout',
  standalone: true,
  templateUrl: './sidenav-layout.component.html',
  styleUrls: ['./sidenav-layout.component.css'],
  imports: [CommonModule, MatSidenavModule, MatToolbarModule, RouterModule, MatDivider, MatNavList, MatIcon, MatButton, MatListItem, MatIconButton],
})
export class SidenavLayoutComponent {

  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
