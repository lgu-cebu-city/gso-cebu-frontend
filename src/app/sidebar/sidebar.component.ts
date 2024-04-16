import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { expand, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonFunctionService } from '../services/common-function.service';
import { MenuService } from '../services/menu.service';
import { RouteInfo } from '../util/routeInfo';
import { SideBarService } from './sidebar.service';

interface states {
  menu: string;
  isExpanded: boolean
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ],
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  expanded: boolean = false;
  expandState: states[] = [];
  public opened: boolean = true;
  public menuItems: any[] | undefined;
  private mediaWatcher: Subscription;
  userName: string = "";
  userType: string = "";
  typeName: string = "";
  systemName: string = environment.systemName;
  @ViewChild('sidenav') sideBar: MatSidenav;

  constructor(
    private authService: AuthService,
    public router: Router,
    private media: MediaObserver,
    private sideBarService: SideBarService,
    private menu: MenuService,
    private commonFunction: CommonFunctionService
  ) {
    this.mediaWatcher = this.media.media$.subscribe((mediaChange: MediaChange) => {
      this.handleMediaChange(mediaChange);
    });
    this.getUserInfo();
  }

  async ngAfterViewInit() {
    this.sideBarService.setSidenav(this.sideBar);
  }

  ngOnInit() {
    this.menuItems = this.menu.routes.filter(menuItem => menuItem);
  }

  private handleMediaChange(mediaChange: MediaChange) {
      if (this.media.isActive('lt-md')) {
          this.opened = false;
      } else {
          this.opened = true;
      }
  }

  onItemSelected(routeItem: RouteInfo) {
    if ((!routeItem.children || !routeItem.children.length) && this.router.url != routeItem.path) {
      this.commonFunction.createFn = () => {};
      this.commonFunction.editFn = () => {};
      this.commonFunction.deleteFn = () => {};
      this.commonFunction.printFn = () => {};
      this.commonFunction.printPreviewFn = () => {};
      this.commonFunction.exportFn = () => {};
      this.commonFunction.printCanvassSheetFn = () => {};
      this.commonFunction.printSummaryFn = () => {};
      this.commonFunction.printStockCardFn = () => {};
      this.commonFunction.printSSMIFn = () => {};
      this.commonFunction.printPropertyCardFn = () => {};
      this.commonFunction.printPropertyLedgerFn = () => {};
      this.commonFunction.printAprFn = () => {};
      this.router.navigate([routeItem.path]);
    }

    if (routeItem.children && routeItem.children.length) {
      var currStateIndex = this.expandState.findIndex(e => e.menu == routeItem.path);
      if (currStateIndex < 0) {
        this.expandState.push({menu: routeItem.path, isExpanded: false});
        currStateIndex = this.expandState.length - 1;
      }
      this.expandState[currStateIndex].isExpanded = !this.expandState[currStateIndex].isExpanded;
      // console.log(currStateIndex);
      // this.expanded = !this.expanded;
    }
  }

  parentMenuState(menu: string): boolean {
    return this.expandState.find(e => e.menu == menu)?.isExpanded || false
  }

  ngOnDestroy() {
    this.mediaWatcher.unsubscribe();
  }

  getUserInfo() {
    this.userName = this.authService.getName();
    this.userType = this.authService.getUserType();
    this.typeName = this.authService.getTypeName();
  }

  logout() {
    sessionStorage.setItem("isLoggedIn", "false");
    sessionStorage.setItem("userId", "");
    sessionStorage.setItem("username", "");
    sessionStorage.setItem("name", "");
    sessionStorage.setItem("userType", "");
    sessionStorage.setItem("typeId", "");
    sessionStorage.setItem("typeName", "");
    sessionStorage.setItem("empId", "");

    window.location.reload();
  }
}
