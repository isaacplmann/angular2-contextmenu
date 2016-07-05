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
          <a href (click)="link.click(item, $event); $event.preventDefault();" innerHTML="{{link.html(item)}}"></a>
        </li>
      </ul>
    </div>
  `,
})
export class ContextMenuComponent {
  public links: any[] = [];
  public isShown: boolean = false;
  public isOpening: boolean = false;
  public item: any;
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
    if (!this.isOpening) {
      this.isShown = false;
    }
  }

  public showMenu(event: MouseEvent, actions: any[], item: any): void {
    this.isOpening = true;
    setTimeout(() => this.isOpening = false, 400);
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
