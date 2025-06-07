import {LitElement, html, css} from 'lit'
import { customElement, property } from 'lit/decorators.js'

interface OrderCreationRequest {
  description: string;
  userId: string;
}

@customElement('create-order-form')
export class CreateOrderForm extends LitElement {

  static styles = css`
    .create-order-container { 
      display: flex; flex-direction: column; justify-content: center; align-items: center; width: 80vw; max-width: 1000px;
      gap: 1rem;
    }
    .save-button { background: aquamarine; border: 1px solid cadetblue; border-radius: 5px; padding: 10px; }
    .save-button:hover { cursor: pointer; }
    .order-input { width: 20rem; }
  `;

  @property({ type: String })
  error: string = '';

  @property({ type: Function })
  addOrder: Function = () => console.warn('default state');

  _saveOrder = () => {
    const description = this.shadowRoot.getElementById('description-input').value;
    const userId = this.shadowRoot.getElementById('user-id-input').value;

    if(description.trim() === '' || userId.trim() === '') {
      this.error = 'Opis i ID użytkownika nie mogą być puste';
      return;
    }

    if(isNaN(Number(userId))) {
      this.error = 'ID użytkownika musi być liczbą';
      return;
    }

    fetch('http://localhost:8080/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: description, userId: userId })
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      if (response.status === 404) {
        throw new Error(`Nie znaleziono użytkownika`);
      }
      throw new Error(`Wystąpił błąd, spróbuj ponownie`);
    })
    .then(data => {
      data.creationDate = new Date(data.creationDate);
      this.addOrder(data);
      this.shadowRoot.getElementById('description-input').value = '';
      this.shadowRoot.getElementById('user-id-input').value = '';
      this.error = '';
    })
    .catch(error => {
      this.error = error;
    });
  }

  render() {
    return html`
      <div class="create-order-container">
        <lion-input id="description-input" label="Opis" class="order-input"></lion-input>
        <lion-input id="user-id-input" label="ID użytkownika" class="order-input"></lion-input>
        <lion-button class="save-button" @click=${this._saveOrder}>Zapisz zamówienie</lion-button>
        ${this.error && html`<div>${this.error}</div>`}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'create-order-form': CreateOrderForm
  }
}
