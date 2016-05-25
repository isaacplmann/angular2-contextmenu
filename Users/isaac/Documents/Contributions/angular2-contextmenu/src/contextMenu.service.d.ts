import { Subject } from 'rxjs/Rx';
export interface IContextMenuClickEvent {
    event: MouseEvent;
    actions: any[];
    item: any;
}
export declare class ContextMenuService {
    show: Subject<IContextMenuClickEvent>;
}
