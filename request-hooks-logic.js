/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { LitElement, html, css } from 'lit-element';
import '@advanced-rest-client/variables-evaluator/variables-evaluator.js';
import './request-logic-action.js';
/**
 * A component responsible for logic for ARC's request and responses actions.
 *
 * Actions are logical operations that the user can define in the request panel
 * which the result is assigned to a variable.
 *
 * @polymer
 * @customElement
 * @memberof LogicElements
 */
export class RequestHooksLogic extends LitElement {
  static get styles() {
    return css`:host {
      display: none !important;
    }`;
  }

  render() {
    const { jexlPath, jexl } = this;
    return html`
    <variables-evaluator .jexlPath="${jexlPath}" .jexl="${jexl}" nobeforerequest></variables-evaluator>`;
  }

  static get properties() {
    return {
      /**
       * A reference name to the Jexl object.
       * Use dot notation to access it from the `window` object.
       * To set class pointer use `jexl` property.
       */
      jexlPath: { type: String },
      /**
       * A Jexl class reference.
       * If this value is set it must be a pointer to the Jexl class and
       * `jexlPath` is ignored.
       * This property is set automatically when `jexlPath` is processed.
       */
      jexl: { type: Object }
    };
  }

  get _evalElement() {
    return this.shadowRoot.querySelector('variables-evaluator');
  }

  constructor() {
    super();
    this._handler = this._handler.bind(this);
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    window.addEventListener('run-response-actions', this._handler);
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    window.removeEventListener('run-response-actions', this._handler);
  }

  firstUpdated() {
    this._evalElement.eventTarget = this;
  }
  /**
   * A handler for the `run-response-actions` custom event.
   * It cancels the event and processes the actions.
   * See componnent description for event details info.
   * @param {CustomEvent} e
   */
  _handler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    e.detail.result = this.processActions(e.detail.actions,
      e.detail.request, e.detail.response);
  }
  /**
   * Processes actions when response object is ready.
   * @param {Array<Object>} actions List of actions to perform
   * @param {Object} request ArcRequest object. See this doc for data model:
   * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/api-request-and-response.md#api-request
   * @param {Object} response ArcResponse object. See this doc for data model:
   * https://github.com/advanced-rest-client/api-components-api/blob/master/docs/api-request-and-response.md#api-request
   * @return {Promise} A promise resolved when actions were performed.
   */
  async processActions(actions, request, response) {
    if (!actions || !request || !response) {
      throw new Error('Expecting 3 arguments.');
    }
    for (let i = 0, len = actions.length; i < len; i++) {
      const action = actions[i];
      if (action.enabled === false) {
        continue;
      }
      actions[i] = await this._evaluateAction(action);
    }
    return await this._runRecursive(actions, request, response);
  }

  async _evaluateAction(action) {
    const copy = this._copyAction(action);
    const mainProps = ['destination', 'source'];
    const iteratorProps = ['condition', 'source'];
    await this._evalElement.evaluateVariables(copy, mainProps);
    if (copy.iterator) {
      await this._evalElement.evaluateVariables(copy.iterator, iteratorProps);
    }
    return copy;
  }

  /**
   * Creates a copy of the actio object.
   *
   * @param {Object} action Action model
   * @return {Object} Deep copy of the action model.
   */
  _copyAction(action) {
    const result = Object.assign({}, action);
    if (result.iterator) {
      result.iterator = Object.assign({}, result.iterator);
    }
    if (result.conditions && result.conditions.length) {
      result.conditions = result.conditions.map((cond) => {
        return Object.assign({}, cond);
      });
    }
    return result;
  }
  /**
   * Creates instance of `request-logic-action` element, sets its properties and
   * inserts it into shadow DOM.
   * @param {Object} action Action definition
   * @return {Element}
   */
  _createLogicElement(action) {
    const inst = document.createElement('request-logic-action');
    inst.source = action.source;
    inst.action = action.action;
    inst.destination = action.destination;
    inst.conditions = action.conditions;
    inst.iterator = action.iterator;
    inst.iteratorEnabled = action.hasIterator;
    this.shadowRoot.appendChild(inst);
    return inst;
  }
  /**
   * Runs acrions recuresively until all actions are executed.
   * @param {Array<Object>} actions Action definition
   * @param {Object} request ARC request object
   * @param {Object} response ARC response object
   * @return {Promise}
   */
  async _runRecursive(actions, request, response) {
    if (!actions || !actions.length) {
      return response;
    }
    const action = this._createLogicElement(actions.shift());
    try {
      await action.run(request, response);
      this.shadowRoot.removeChild(action);
    } catch (cause) {
      this.shadowRoot.removeChild(action);
      throw cause;
    }
    return await this._runRecursive(actions, request, response);
  }
}
window.customElements.define('request-hooks-logic', RequestHooksLogic);
