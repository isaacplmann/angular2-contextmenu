import {Directive, Input, Output, EventEmitter, TemplateRef} from '@angular/core';

@Directive({
  /* tslint:disable:directive-selector-type */
  selector: 'template[contextMenuItem]',
  /* tslint:enable:directive-selector-type */
})
export class ContextMenuItemDirective {
  @Input() public enabled: boolean = true;
  @Input() public visible: boolean = true;
  @Output() public execute: EventEmitter<{ event: Event, item: any }> = new EventEmitter<{ event: Event, item: any }>();

  constructor(private template: TemplateRef<{item: any}>) {}

  public triggerExecute(item: any, $event?: MouseEvent): void {
    if (!this.enabled) {
      return;
    }
    this.execute.emit({event: $event, item});
  }
}
