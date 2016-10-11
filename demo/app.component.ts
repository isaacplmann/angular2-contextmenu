import { Component, ViewChild } from '@angular/core';
import { ContextMenuService, ContextMenuComponent } from '../angular2-contextmenu';

@Component({
  selector: 'angular2-context-menu-demo',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public items: any[] = [
      { name: 'John', otherProperty: 'Foo' },
      { name: 'Joe', otherProperty: 'Bar' },
  ];
  public outsideValue: string = 'something';

  @ViewChild('basicMenu') public basicMenu: ContextMenuComponent;
  @ViewChild('enableAndVisible') public enableAndVisible: ContextMenuComponent;
  @ViewChild('withFunctions') public withFunctions: ContextMenuComponent;

  constructor(private contextMenuService: ContextMenuService) {}

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({ event: $event, item: item });
    $event.preventDefault();
  }

  public showMessage(message: string): void {
    console.log(message);
  }

  public onlyJohn(item: any): boolean {
    return item.name === 'John';
  }

  public onlyJoe(item: any): boolean {
    return item.name === 'Joe';
  }
}
