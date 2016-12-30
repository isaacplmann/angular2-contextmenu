import { CONTEXT_MENU_OPTIONS, IContextMenuOptions } from './contextMenu.options';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  Optional,
  Output,
  QueryList,
} from '@angular/core';
import { ContextMenuService, IContextMenuClickEvent } from './contextMenu.service';
import { ContextMenuItemDirective } from './contextMenu.item.directive';

export interface ILinkConfig {
  click: (item: any, $event?: MouseEvent) => void;
  enabled?: (item: any) => boolean;
  html: (item: any) => string;
}

@Component({
  selector: 'context-menu',
  styles: [
  ],
  template:
  `<div class="dropdown angular2-contextmenu">
      <ul *ngIf="item" [ngStyle]="locationCss" class="dropdown-menu">
        <!-- Imperative context menu -->
        <li *ngFor="let link of links" [class.disabled]="isDisabled(link)">
          <a href [class.dropdown-item]="useBootstrap4" [class.disabled]="useBootstrap4 && isDisabled(link)"
            (click)="execute(link, $event); $event.preventDefault(); $event.stopPropagation();"
            innerHTML="{{link.html ? link.html(item) : ''}}"></a>
        </li>
        <!-- Declarative context menu -->
        <li *ngFor="let menuItem of visibleMenuItems" [class.disabled]="!isMenuItemEnabled(menuItem)"
          [attr.role]="menuItem.divider ? 'separator' : undefined" [class.divider]="menuItem.divider">
          <a *ngIf="!menuItem.divider" href [class.dropdown-item]="useBootstrap4"
            [class.disabled]="useBootstrap4 && !isMenuItemEnabled(menuItem)"
            (click)="menuItem.triggerExecute(item, $event); $event.preventDefault(); $event.stopPropagation();">
            <template [ngTemplateOutlet]="menuItem.template" [ngOutletContext]="{ $implicit: item }"></template>
          </a>
        </li>
      </ul>
    </div>
  `,
})
export class ContextMenuComponent implements AfterContentInit {
  @Input() public useBootstrap4: boolean = false;
  @Output() public close: EventEmitter<any> = new EventEmitter<any>();
  @ContentChildren(ContextMenuItemDirective) public menuItems: QueryList<ContextMenuItemDirective>;
  public visibleMenuItems: ContextMenuItemDirective[] = [];

  public links: ILinkConfig[] = [];
  public isShown: boolean = false;
  public isOpening: boolean = false;
  public item: any;
  private mouseLocation: { left: number, top: number } = { left: 0, top: 0 };
  constructor(
    private _contextMenuService: ContextMenuService,
    private changeDetector: ChangeDetectorRef,
    @Optional()
    @Inject(CONTEXT_MENU_OPTIONS) private options: IContextMenuOptions
  ) {
    if (options) {
      this.useBootstrap4 = options.useBootstrap4;
    }
    _contextMenuService.show.subscribe(menuEvent => this.onMenuEvent(menuEvent));
  }

  get locationCss(): any {
    return {
      'position': 'fixed',
      'display': this.isShown ? 'block' : 'none',
      left: this.mouseLocation.left + 'px',
      top: this.mouseLocation.top + 'px',
    };
  }

  @HostListener('document:click')
  public leftClickOutside(): void{
    this.clickedOutside();
  }

  @HostListener('document:contextmenu')
  public rightClickOutside(): void{
    this.clickedOutside();
  }

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
      });
    } else {
      this.hideMenu();
    }
    this.links = actions;
    this.item = item;
    this.mouseLocation = {
      left: event.clientX,
      top: event.clientY,
    };
  }

  public setVisibleMenuItems(): void {
    this.visibleMenuItems = this.menuItems.filter(menuItem => this.isMenuItemVisible(menuItem));
  }

  public showMenu(): void {
    this.isShown = true;
    this.changeDetector.markForCheck();
  }

  public hideMenu(): void {
    if (this.isShown === true) {
      this.close.emit({});
    }
    this.isShown = false;
    this.changeDetector.markForCheck();
  }
}
