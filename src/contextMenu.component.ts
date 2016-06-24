import {Component, HostListener} from '@angular/core';
import {ContextMenuService, IContextMenuClickEvent} from './contextMenu.service';

@Component({
  selector: 'context-menu',
  styles: [
  ],
  template:
  `<div class="dropdown angular2-contextmenu">
      <ul [ngStyle]="locationCss" class="dropdown-menu">
        <li *ngFor="let link of links" [class.disabled]="link.enabled && !link.enabled(item)">
          <a href (click)="link.click(item, $event); $event.preventDefault();" innerHTML="{{link.html()}}"></a>
        </li>
      </ul>
    </div>
  `,
})
export class ContextMenuComponent {
  public links: any[] = [];
  public isShown: boolean = false;
  public item: any;
  public hide: boolean = true;
  private mouseLocation: { left: number, top: number } = { left: 0, top: 0 };
  constructor(private _contextMenuService: ContextMenuService) {
    _contextMenuService.show.subscribe((e: IContextMenuClickEvent) => this.showMenu(e.event, e.actions, e.item));
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
  public clickedOutside(): void {
    if (this.hide) {
      this.isShown = false;
    }
    this.hide = true;
  }

  public showMenu(event: MouseEvent, actions: any[], item: any): void {
    this.hide = false;
    if (actions && actions.length > 0) {
      this.isShown = true;
    }
    this.links = actions;
    this.item = item;
    this.mouseLocation = {
      left: event.clientX,
      top: event.clientY,
    };
  }
}
