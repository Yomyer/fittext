import { FitTextData } from './data';

import { Subject, Observable } from 'rxjs';
import { style } from '@angular/animations';
import { Directive, ElementRef, OnInit, Renderer2, OnDestroy, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ElementQueries, ResizeSensor } from 'css-element-queries';
import { isNull } from '@angular/compiler/src/output/output_ast';


@Directive({
  selector: '[fittext]'
})
export class FittextDirective implements OnInit, OnDestroy, OnChanges {
  @Input('fittext') fittext: any = true;
  @Input('compression') compression = 1;
  @Input('container') container;
  @Input('activateOnResize') activateOnResize = true;
  @Input('ellipsisSymbol') ellipsisSymbol = '…';

  private _ellipsis = new Subject<SimpleChange>();
  onEllipsisChange = this._ellipsis.asObservable();
  @Input('ellipsis') ellipsis = true;

  private _min = new Subject<SimpleChange>();
  onMinChange = this._min.asObservable();
  @Input('minFontSize') minFontSize;
  private get _minFontSize() {
    if (this.minFontSize > this.first.fontSize) {
      return this.first.fontSize;
    }
    return this.minFontSize;
  }

  private _max = new Subject<SimpleChange>();
  onMaxChange = this._max.asObservable();
  @Input('maxFontSize') maxFontSize;
  private get _maxFontSize() {
    if (this.maxFontSize < this.first.fontSize) {
      return this.first.fontSize;
    }
    return this.maxFontSize;
  }

  mutable: ResizeSensor;
  first: FitTextData;

  get ele() {
    return this.element.nativeElement;
  }
  get parent() {
    if (this.container) {
      return this.container;
    }
    return this.ele.parentNode;
  }

  private _disabled = new Subject<SimpleChange>();
  onDisabledChange = this._disabled.asObservable();
  get disabled(): boolean {
    return !this.fittext && this.fittext !== '';
  }

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.first = new FitTextData(this.ele);

    this.mutableObserver();
    this.ajust(null);

    this.onDisabledChange.subscribe((change: SimpleChange) => {
      this.reset();
      this.ajust(null);
    });

    this.onEllipsisChange.subscribe((change: SimpleChange) => {
      if (this.ellipsis) {
        this.ajust(null);
      } else {
        this.resetContent();
      }
    });

    this.onMaxChange.subscribe((change: SimpleChange) => {
      if (change.previousValue) {
        if (change.currentValue < change.previousValue || !change.previousValue) {
          this.reset(1);
          this.ajust(null);
        } else {
          this.ajust(null);
        }
      }
    });

    this.onMinChange.subscribe((change: SimpleChange) => {
      if (change.previousValue) {
        if (change.currentValue > change.previousValue || !change.previousValue) {
          this.reset();
          this.ajust(null);
        } else {
          this.ajust(null);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.mutable.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const name in changes) {
      if (changes.hasOwnProperty(name)) {
        const change = changes[name];
        const current = change.currentValue;
        const previous = change.previousValue;

        if (current !== previous) {
          switch (name) {
            case 'fittext':
              this._disabled.next(change);
              break;
            case 'maxFontSize':
              this._max.next(change);
              break;
            case 'minFontSize':
              this._min.next(change);
              break;
            case 'ellipsis':
              this._ellipsis.next(change);
              break;

          }
        }
      }
    }
  }

  mutableObserver() {
    if (!this.activateOnResize) {
      return;
    }

    this.mutable = new ResizeSensor(this.parent, () => {
      this.ajust(null);
    });
  }

  ajust(direction) {
    if (this.disabled) {
      return this.cut();
    }

    this.renderer.setStyle(this.parent, 'overflow', this.disabled ? 'auto' : 'hidden');

    const data = new FitTextData(this.ele);
    if (
      (!direction || direction < 0) &&
      (this.ele.offsetHeight > this.parent.offsetHeight || this.ele.offsetWidth > this.parent.offsetWidth) &&
      (!this.minFontSize || (this._minFontSize <= (data.fontSize - this.compression))
      )
    ) {
      this.renderer.setStyle(this.ele, 'fontSize', (data.fontSize - this.compression) + 'px');
      this.renderer.setStyle(this.ele, 'lineHeight', (data.lineHeight - this.compression) + 'px');

      return this.ajust(-1);
    } else if (
      (!direction || direction > 0) &&
      (this.ele.offsetHeight < this.parent.offsetHeight || this.ele.offsetWidth < this.parent.offsetWidth) &&
      (!this.maxFontSize || this._maxFontSize > data.fontSize)
    ) {
      this.renderer.setStyle(this.ele, 'fontSize', (data.fontSize + this.compression) + 'px');
      this.renderer.setStyle(this.ele, 'lineHeight', (data.lineHeight + this.compression) + 'px');

      if (this.ele.offsetHeight > this.parent.offsetHeight || this.ele.offsetWidth > this.parent.offsetWidth) {
        return this.ajust(-1);
      } else {
        return this.ajust(1);
      }
    } else if (!direction || direction < 0) {
      this.cut(direction < 0);
    }

  }

  cut(remove = false) {
    if (!this.ellipsis || this.ele.innerHTML === this.ellipsisSymbol || !this.ele.innerHTML) {
      return;
    }
    if (this.ele.offsetHeight > this.parent.offsetHeight || this.ele.offsetWidth > this.parent.offsetWidth) {
      this.ele.innerHTML = this.removeLastCharacter(this.ele.cloneNode(true)).innerHTML + this.ellipsisSymbol;

      this.cut(true);

    } else if (!remove) {
      this.resetContent();
    }
  }

  reset(force = null) {
    this.resetContent();
    this.renderer.setStyle(this.ele, 'fontSize', (force ? force : this.first.fontSize) + 'px');
    this.renderer.setStyle(this.ele, 'lineHeight', (force ? force + FitTextData.offsetLineHeight : this.first.lineHeight) + 'px');
  }

  resetContent() {
    this.ele.innerHTML = this.first.innerHTML;
  }

  removeLastCharacter(content) {
    if (content.innerHTML.substr(content.innerHTML.length - 1) === this.ellipsisSymbol) {
      content.innerHTML = content.innerHTML.slice(0, -1);
    }

    if (content.lastChild === null) {
      content.parentNode.removeChild(content);
    } else if (content.lastChild.data) {
      content.lastChild.data = content.lastChild.data.slice(0, -1);
    } else {
      content.lastChild.data = this.removeLastCharacter(content.lastChild);
    }

    return content;
  }
}
