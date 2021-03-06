import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, Component, ElementRef }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

interface IPriceQuote {
  stockSymbol: string,
  lastPrice: number
}

@Component({
  selector: 'price-quoter',
  template: `PriceQuoter: {{stockSymbol}} {{price | currency:'USD':true:'1.2-2'}}`,
  styles:[`:host {background: pink;}`]
})
class PriceQuoterComponent {
  stockSymbol: string = "IBM";
  price:number;

  constructor(element: ElementRef) {
    setInterval(() => {

      let priceQuote: IPriceQuote = {
        stockSymbol: this.stockSymbol,
        lastPrice: 100*Math.random()
      };

      this.price = priceQuote.lastPrice;

      element.nativeElement
          .dispatchEvent(new CustomEvent('lastPrice', {
            detail: priceQuote,
            bubbles: true
          }));
    }, 1000);
  }
}

@Component({
  selector: 'app',
  template: `
    <div (lastPrice)="priceQuoteHandler($event)">
      <price-quoter></price-quoter>
    </div>
    <br>
    AppComponent received in div: {{stockSymbol}} {{price | currency:'USD':true:'1.2-2'}}
  `
})
class AppComponent {

  stockSymbol: string;
  price:number;

  priceQuoteHandler(event: CustomEvent) {
    this.stockSymbol = event.detail.stockSymbol;
    this.price = event.detail.lastPrice;
  }
}
@NgModule({
  imports:      [ BrowserModule],
  declarations: [ AppComponent, PriceQuoterComponent],
  bootstrap:    [ AppComponent ]
})
class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
