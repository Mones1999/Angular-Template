import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, output, ViewChild } from '@angular/core';
import { AuthService } from '@core/services/auth-service';
import { LanguageService } from '@core/services/language-service';
import { ThemeService } from '@core/services/theme-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
