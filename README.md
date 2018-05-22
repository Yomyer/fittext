# @yomyer/fittext

cropAn angular (typescript) directive to do what fittext.js did when jquery was in vogue.
This option automatically adjusts the font size to match the width of your container, plus if a[minFontSize] is defined and the ellipse does not fit, it activates the ellipse and crop the text and adds a symbol of etc. (...)

### Installation

Install the library
```sh
$ npm install --save @yomyer/fittext
```

### Usage

Import it in your Angular project as a module

1) Declare it in your module
    ```sh
    import {FittextModule} from '@yomyer/fittext';
    
    @NgModule({
      imports: [
        FittextModule,
        ...
      ]
    })
    
    ```
    
2) Use it in a component
    
    **The element that contains this directive should have a CSS width!**
    ```sh
   import {Component} from '@angular/core';
   
    @Component({
      selector: 'hero',
      template: `
        <div style="align-content: center;">
            <div style="width: 20%; height: 20%; margin: 0 auto;">
                <div fittext>test</div>
            </div>
         </div>`
    })
    
    export class AppComponent {}
    ```

   Parameters:
    
  | Parameter | Description | Values |
  | --- | --- | --- |
  | `fittext` (required) | Selector for the directive. | boolean (defaults to `true`)
  | `[activateOnResize]` (optional) | enable/disable the auto-scale in case of window resize | boolean (defaults to `true`)
  | `[container]` (optional) | parent to compare width/height | nativeElement
  | `[compression]` (optional) | compression rate. How fast should the text resize? | number (defaults to `1`)
  | `[minFontSize]` (optional) | minimum font size allowed on element | number (defaults to `0`)
  | `[maxFontSize]` (optional) | maximum font size allowed on element | number (defaults to `infinity`)
  | `[ellipsis]` (optional) | enable/disable ellipis crop | boolean (defaults to `true`)
  | `[ellipsisSymbol]` (optional) | symbol to use in ellipis | string (defaults to `…`)


### Development
Want to contribute? Great!
Simply, clone the repository!

License
----
ISC


**- Yomyer**
  