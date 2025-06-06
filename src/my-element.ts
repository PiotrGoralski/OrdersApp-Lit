import {LitElement, html, css} from 'lit'
import { customElement, property } from 'lit/decorators.js'

interface Order {
  id: string;
  creationDate: Date;
  status: 'CREATED' | 'CLOSED';
  description: string;
  userId: string;
}

@customElement('my-element')
export class MyElement extends LitElement {

  static styles = css`li { display: flex; justify-content: center; gap: 1rem }`;

  @property()
  orders: Order[] = [
    {id: '3', creationDate: new Date(), status: 'CREATED', description: 'Opis 1', userId: '111'},
    {id: '2', creationDate: new Date(), status: 'CREATED', description: 'Opis 2', userId: '555'},
    {id: '3', creationDate: new Date(), status: 'CLOSED', description: 'Opis 3', userId: '777'}
  ];

  render() {
    return html`
      <ul>
        ${this.orders.map((order, index) => html`
                <li>
                    <span>${index}.</span>
                    <span>ID: ${order.id}</span>
                    <span>Data utworzenia: ${order.creationDate}</span>
                    <span>Status: ${order.status}</span>
                    <span>Opis: ${order.description}</span>
                </li>
            `)}
      </ul>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
