import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Rx';

export interface IContextMenuClickEvent {
  event: MouseEvent;
  actions: any[];
  item: any;
}

@Injectable()
export class ContextMenuService {
  public show: Subject<IContextMenuClickEvent> = new Subject<IContextMenuClickEvent>();
}
