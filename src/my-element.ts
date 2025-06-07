import {LitElement, html, css} from 'lit'
import {customElement, property} from 'lit/decorators.js'

export interface Order {
  id: string;
  creationDate: Date;
  status: 'CREATED' | 'CLOSED';
  description: string;
  userId: string;
}

@customElement('my-element')
export class MyElement extends LitElement {

  static styles = css`
    .main-container { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2rem; }
  `;

  @property({ type: String })
  error: string = '';

  @property()
  orders: Order[] = [
    // {id: '123', creationDate: new Date(), status: 'CREATED', description: 'Opis 1', userId: '111'},
    // {id: '2', creationDate: new Date(), status: 'CREATED', description: 'Opis 2', userId: '555'},
    // {id: '3', creationDate: new Date(), status: 'CLOSED', description: 'Opis 3', userId: '777'}
  ];

  async firstUpdated() {
    fetch('http://localhost:8080/orders')
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(`Wystąpił błąd, spróbuj ponownie`);
    })
    .then(data => {
      this.orders = data;
      this.error = '';
    })
    .catch(error => {
      this.error = error;
    });
  }

  _addOrder = (newOrder: Order) => {
    this.orders = [...this.orders, newOrder];
  }

  _replaceOrder = (newOrder: Order) => {
    this.orders = this.orders.map(order => order.id === newOrder.id ? newOrder : order);
  }

  render() {
    return html`
      <div class="main-container">
        <create-order-form .addOrder=${this._addOrder}></create-order-form>
        <orders-table .orders=${this.orders} .replaceOrder=${this._replaceOrder}></orders-table>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
