import { ContextMenuItemDirective } from './contextMenu.item.directive';
import { CONTEXT_MENU_OPTIONS, IContextMenuOptions } from './contextMenu.options';
import { ContextMenuService, IContextMenuClickEvent } from './contextMenu.service';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Optional,
  Output,
  QueryList,
  ViewChild
} from '@angular/core';

export interface ILinkConfig {
  click: (item: any, $event?: MouseEvent) => void;
  enabled?: (item: any) => boolean;
  html: (item: any) => string;
}
export interface MouseLocation {
  left?: string;
  marginLeft?: string;
  marginTop?: string;
  top?: string;
}

@Component({
  selector: 'context-menu',
  styles: [
    `.passive {
       display: block;
       padding: 3px 20px;
       clear: both;
       font-weight: normal;
       line-height: @line-height-base;
       white-space: nowrap;
     }`
  ],
  template:
  `<div class="dropdown angular2-contextmenu">
      <ul *ngIf="item" #menu [ngStyle]="locationCss" class="dropdown-menu">
        <!-- Imperative context menu -->
        <li *ngFor="let link of links" [class.disabled]="isDisabled(link)">
          <a href [class.dropdown-item]="useBootstrap4" [class.disabled]="useBootstrap4 && isDisabled(link)"
            (click)="execute(link, $event); $event.preventDefault(); $event.stopPropagation();"
            innerHTML="{{link.html ? link.html(item) : ''}}"></a>
        </li>
        <!-- Declarative context menu -->
        <li *ngFor="let menuItem of visibleMenuItems" [class.disabled]="!isMenuItemEnabled(menuItem)"
            [class.divider]="menuItem.divider" [class.dropdown-divider]="useBootstrap4 && menuItem.divider"
            [attr.role]="menuItem.divider ? 'separator' : undefined">
          <a *ngIf="!menuItem.divider && !menuItem.passive" href [class.dropdown-item]="useBootstrap4"
            [class.disabled]="useBootstrap4 && !isMenuItemEnabled(menuItem)"
            (click)="menuItem.triggerExecute(item, $event); $event.preventDefault(); $event.stopPropagation();">
            <template [ngTemplateOutlet]="menuItem.template" [ngOutletContext]="{ $implicit: item }"></template>
          </a>

          <span (click)="stopEvent($event)" (contextmenu)="stopEvent($event)" class="passive"
                *ngIf="!menuItem.divider && menuItem.passive" [class.dropdown-item]="useBootstrap4"
                [class.disabled]="useBootstrap4 && !isMenuItemEnabled(menuItem)">
            <template [ngTemplateOutlet]="menuItem.template" [ngOutletContext]="{ $implicit: item }"></template>
          </span>
        </li>
      </ul>
    </div>
  `,
})
export class ContextMenuComponent implements AfterContentInit {
  @Input() public useBootstrap4: boolean = false;
  @Output() public close: EventEmitter<any> = new EventEmitter<any>();
  @ContentChildren(ContextMenuItemDirective) public menuItems: QueryList<ContextMenuItemDirective>;
  @ViewChild('menu') public menuElement: ElementRef;
  public visibleMenuItems: ContextMenuItemDirective[] = [];

  public links: ILinkConfig[] = [];
  public isShown: boolean = false;
  public isOpening: boolean = false;
  public item: any;
  private mouseLocation: MouseLocation = { left: '0px', top: '0px' };
  constructor(
    private _contextMenuService: ContextMenuService,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    @Optional()
    @Inject(CONTEXT_MENU_OPTIONS) private options: IContextMenuOptions
  ) {
    if (options) {
      this.useBootstrap4 = options.useBootstrap4;
    }
    _contextMenuService.show.subscribe(menuEvent => this.onMenuEvent(menuEvent));
  }

  stopEvent($event : MouseEvent) {
    $event.stopPropagation()
  }

  get locationCss(): any {
    return {
      'position': 'fixed',
      'display': this.isShown ? 'block' : 'none',
      left: this.mouseLocation.left,
      marginLeft: this.mouseLocation.marginLeft,
      marginTop: this.mouseLocation.marginTop,
      top: this.mouseLocation.top,
    };
  }

  @HostListener('document:click')
  @HostListener('document:contextmenu')
  public clickedOutside(): void {
    if (!this.isOpening) {
      this.hideMenu();
    }
  }

  public ngAfterContentInit(): void {
    this.menuItems.forEach(menuItem => {
      menuItem.execute.subscribe(() => this.hideMenu());
    });
  }

  public isMenuItemEnabled(menuItem: ContextMenuItemDirective): boolean {
    return this.evaluateIfFunction(menuItem.enabled);
  }

  public isMenuItemVisible(menuItem: ContextMenuItemDirective): boolean {
    return this.evaluateIfFunction(menuItem.visible);
  }

  public evaluateIfFunction(value: any): any {
    if (value instanceof Function) {
      return value(this.item);
    }
    return value;
  }

  public isDisabled(link: ILinkConfig): boolean {
    return link.enabled && !link.enabled(this.item);
  }

  public execute(link: ILinkConfig, $event?: MouseEvent): void {
    if (this.isDisabled(link)) {
      return;
    }
    this.hideMenu();
    link.click(this.item, $event);
  }

  public onMenuEvent(menuEvent: IContextMenuClickEvent): void {
    let { actions, contextMenu, event, item } = menuEvent;
    if (contextMenu && contextMenu !== this) {
      this.hideMenu();
      return;
    }
    this.isOpening = true;
    setTimeout(() => this.isOpening = false, 400);
    if (actions) {
      if (console && console.warn) {
        console.warn(`actions configuration object is deprecated and will be removed in version 1.x.
        See https://github.com/isaacplmann/angular2-contextmenu for the new declarative syntax.`);
      }
    }
    if (actions && actions.length > 0) {
      // Imperative context menu
      this.setVisibleMenuItems();
      this.showMenu();
    } else if (this.menuItems) {
      // Declarative context menu
      setTimeout(() => {
        this.setVisibleMenuItems();
        if (this.visibleMenuItems.length > 0) {
          this.showMenu();
        } else {
          this.hideMenu();
        }
        setTimeout(() => {
          const menuWidth = this.menuElement.nativeElement.clientWidth;
          const menuHeight = this.menuElement.nativeElement.clientHeight;
          const bodyWidth = event.view.document.body.clientWidth;
          const bodyHeight = event.view.document.body.clientHeight;
          const distanceFromRight = bodyWidth - (event.clientX + menuWidth);
          const distanceFromBottom = bodyHeight - (event.clientY + menuHeight);
          let isMenuOutsideBody: boolean = false;
          if (distanceFromRight < 0 && event.clientX > bodyWidth / 2) {
            this.mouseLocation.marginLeft = '-' + menuWidth + 'px';
            isMenuOutsideBody = true;
          }
          if (distanceFromBottom < 0 && event.clientY > bodyHeight / 2) {
            this.mouseLocation.marginTop = '-' + menuHeight + 'px';
            isMenuOutsideBody = true;
          }
          if (isMenuOutsideBody) {
            this.showMenu();
          }
        });
      });
    } else {
      this.hideMenu();
    }
    this.links = actions;
    this.item = item;
    let adjustX = 0;
    let adjustY = 0;
    const offsetParent: HTMLElement = this.elementRef.nativeElement.offsetParent;
    if (offsetParent && offsetParent.tagName !== 'BODY') {
      const position = event.view.getComputedStyle(offsetParent).position;
      if (position !== 'absolute' && position !== 'fixed') {
        const { left, top } = offsetParent.getBoundingClientRect();
        adjustX = -left;
        adjustY = -top;
      }
    }
    this.mouseLocation = {
      left: event.clientX + adjustX + 'px',
      top: event.clientY + adjustY + 'px',
    };
  }

  public setVisibleMenuItems(): void {
    this.visibleMenuItems = this.menuItems.filter(menuItem => this.isMenuItemVisible(menuItem));
  }

  public showMenu(): void {
    this.isShown = true;
    this.changeDetector.markForCheck();
  }

  @HostListener('window:scroll')
  @HostListener('document:keydown', ['$event'])
  public hideMenu(event?: KeyboardEvent): void {
    if (event && (event.keyCode && event.keyCode !== 27 || event.key && event.key !== 'Escape')) {
      return;
    }
    if (this.isShown === true) {
      this.close.emit({});
    }
    this.isShown = false;
    this.changeDetector.markForCheck();
  }
}
