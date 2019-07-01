import { LitElement } from 'lit-element';

import firebase from 'firebase/app';
import 'firebase/firestore';


export class TwitbookStore extends LitElement {
  constructor() {
    super();
    this.data = [];
    // Todo add others data model
    this.collection = '';
  }

  static get properties() {
    return {
      data: { type: Array },
      collection: String
    }
  }

  firstUpdated() {
    firebase.initializeApp(document.config);

    firebase.firestore().collection(this.collection).orderBy('date', 'asc').onSnapshot(ref => {
      ref.docChanges().forEach(change => {
        const { oldIndex, newIndex, doc, type } = change;
        if (type == 'added') {
          this.data = [...this.data, doc.data()];
          this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }))
        } else if (type == 'removed') {
          this.data.splice(oldIndex, 1);
          this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }))
        }
      })
    });
  }
}
customElements.define('twittbook-store', TwitbookStore);
