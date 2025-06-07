import {LitElement, html, css} from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type {Order} from "./my-element.ts";

@customElement('orders-table')
export class OrdersTable extends LitElement {

  static styles = css`
    th { text-align: left; border-bottom: 1px solid black; }
    td { padding-bottom: 0.5rem; padding-top: 0.5rem; }
    .orders-container { display: flex; justify-content: center; align-items: center; }
    .orders-table { width: 80vw; max-width: 1500px; }
    .table-row {  }
    .close-order-button { color: white; background: crimson; border: 3px solid darkred; padding: 5px; border-radius: 5px; }
    .close-order-button:hover { cursor: pointer }
    .close-order-error { display: flex; justify-content: flex-end; width: 100%; }
  `;

  @property({ type: [] })
  orders: Order[] = [];

  @property({ type: String })
  error: string = '';

  @property({ type: Function })
  replaceOrder: Function = () => console.warn('default state');

  _closeOrder = (orderId: string) => {
    fetch('http://localhost:8080/orders/'+orderId, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(`Wystąpił błąd podczas zamykania zamówienia, spróbuj ponownie`);
    })
    .then(data => {
      data.creationDate = new Date(data.creationDate);
      this.replaceOrder(data);
      this.error = '';
    })
    .catch(error => {
      this.error = error;
    });
  }

  render() {
    return html`
      <Fragment>
      <div class="close-order-error">${this.error ?? ''}</div>
      <div class="orders-container">
        <table class="orders-table">
          <tr>
            <th>Index</th>
            <th>ID</th>
            <th>Data utworzenia</th>
            <th>Status</th>
            <th>Opis</th>
            <th></th>
          </tr>
          ${this.orders.map((order, index) => html`
            <tr class="table-row">
              <td>${index}</td>
              <td>${order.id}</td>
              <td>${order.creationDate.toLocaleDateString() + ' ' + order.creationDate.toLocaleTimeString()}</td>
              <td>${order.status}</td>
              <td>${order.description}</td>
              <td>
                ${order.status !== 'CLOSED' ? html`<lion-button class="close-order-button" @click=${() => this._closeOrder(order.id)}>Zamknij zamówienie</lion-button>` : ''}
              </td>
            </tr>
          `)}
        </table>
      </div>
      </Fragment>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'orders-table': OrdersTable
  }
}
