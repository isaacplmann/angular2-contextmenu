# angular2-contextmenu

A context menu built with Angular 2 inspired by [ui.bootstrap.contextMenu](https://github.com/Templarian/ui.bootstrap.contextMenu).  Bootstrap classes are included in the markup, but there is no explicit dependency on Bootstrap. [Demo](http://plnkr.co/edit/wpJXpEh4zNZ4uCxTURx2?p=preview)

## Usage

- `npm install angular2-contextmenu`

### Template

```html
<ul>
    <li *ngFor="item in items" (contextmenu)="onContextMenu($event, item)">Right Click: {{item.name}}</li>
</ul>
<context-menu></context-menu>
```

### Component Code

```js
import { ContextMenuComponent, ContextMenuService } from 'angular2-contextmenu';

@Component({
  directives: [ ContextMenuComponent ],
  providers: [ ContextMenuService ],
  ...
})
export class MyContextMenuClass {
  public items = [
      { name: 'John', otherProperty: 'Foo' },
      { name: 'Joe', otherProperty: 'Bar' }
  };

  constructor(private contextMenuService: ContextMenuService) {}

  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({
      actions: [
        {
          html: () => `Say hi!`,
          click: (item) => alert('Hi, ' + item.name)
        },
        {
          html: () => `Something else`,
          click: (item) => alert('Or not...')
        },
      ],
      event: $event,
      item: item,
    });
    $event.preventDefault();
  }
}
```

## Menu Options

Every menu option has an `html` function and a `click` function.

The `enabled` function is optional.  If the function returns true, the item is enabled (default). If no function is provided, the item will be enabled by default.

```js
public menuOptions = [
  {
    html: (): string => {
      return 'Something';
    },
    click: (item, $event): void {
      // Action
    },
    enabled: (item, $event): boolean {
      // Enable or Disable
      return true; // enabled = true, disabled = false
    }
  }
];
```


## Custom HTML

```js
let customHtml = `<div style="cursor: pointer; background-color: pink">
                 <i class="glyphicon glyphicon-ok-sign"></i> Testing Custom </div>`;

let customItem = {
    html: () => customHtml,
    enabled: function() {return true},
    click: function (item, $event) {
        alert("custom html");
    }};

this.customHTMLOptions = [
  customItem,
  {
    html: () => 'Example 1',
    click: (item, $event): void {
      alert("Example 1");
    }
  }];
```

## Bootstrap 4

If you're using Bootstrap 4, you can add a `useBootstrap4` attribute to the `context-menu` component in order to get the appropriate class names.  Like this:

```html
<context-menu [useBootstrap4]="true"></context-menu>
```

## Close event emitter

There is a `(close)` output EventEmitter that you can subscribe to for notifications when the context menu closes (either by clicking outside or choosing a menu item).

```html
<context-menu (close)="processContextMenuCloseEvent()"></context-menu>
```
