'use strict';
/* global self */
var isNode = true;
if (typeof window !== 'undefined' || (typeof self !== 'undefined' && self.importScripts)) {
  isNode = false;
}
(function(scope) {
  if (typeof scope.RequestLogicAction === 'function') {
    return;
  }
  let SuperClz = scope.ActionEventEmitter;
  if (isNode) {
    SuperClz = require('events');
  }

  /**
   * Class responsible for running preconfigured action on the Request / Response
   * object.
   */
  class RequestLogicAction extends SuperClz {
    /**
     * @constructor
     * @param {Object} action Action model:
     * source {String} Data source with path to the data.
     * action {String} Action to be performed
     * destination {Strning} Destination for the value read from source
     * conditions {Array<Object>} List of conditions to use. See
     * RequestLogicCondition class for description.
     */
    constructor(action) {
      super();
      this.enabled = typeof action.enabled === 'undefined' ? true : action.enabled;
      if (!this.enabled) {
        return;
      }
      RequestLogicAction.validate(action);
      if (action.conditions) {
        this.conditions = this._prepareConditions(action.conditions);
      }
      this._source = action.source;
      this._sourcePath = action.source.split('.');
      this._action = action.action;
      this._destination = action.destination;
      this._iterator = action.iterator;
      this._hasIterator = action.hasIterator;
      this._opts = action;
    }
    /**
     * Validates action definition object.
     *
     * @param {Object} action Action definition model. See constructor for details.
     */
    static validate(action) {
      if (!action) {
        throw new Error('The action definition is missing.');
      }
      var errors = [];
      if (!action.source) {
        errors.push('Action source is missing');
      }
      if (!action.action) {
        errors.push('Action\'s action is missing');
      }
      if (!action.destination) {
        errors.push('Action destination is missing');
      }
      if (errors.length) {
        throw new Error('Action did not pass validation: \n' + errors.join('\n'));
      }
    }
    /**
     * Prepares list of condition objects.
     * It throws an error if condition is not validated.
     *
     * @param {Array<Object>} conditions List of condition model.
     * @return {Array<RequestLogicCondition>} Condition class instances.
     */
    _prepareConditions(conditions) {
      let result = [];
      let Clz = scope.RequestLogicCondition;
      if (isNode) {
        Clz = require('./request-condition.js').RequestLogicCondition;
      }
      for (let i = 0, len = conditions.length; i < len; i++) {
        result.push(new Clz(conditions[i]));
      }
      return result;
    }
    /**
     * Runs the request hook action.
     *
     * @param {Request} request Request object as defined in Fetch API
     * @param {Response} response Response object as defined in Fetch API
     * @return {Promise} Promise resolved to Boolean `true` if the action was
     * performed or `false` if the action wasn't performed because haven't meet
     * defined conditions.
     */
    run(request, response) {
      if (!this.enabled) {
        return Promise.resolve(false);
      }
      this._request = request;
      this._response = response;
      return this._prepareBodyValues(request, response)
      .then(() => this._areConditionsMeet())
      .then((canExecute) => {
        if (!canExecute) {
          return false;
        }
        return this._execute();
      });
    }
    /**
     * Executes the action after the condisions are meet.
     * @return {Promise} Promise resolved fo Boolean `true`
     */
    _execute() {
      let Clz = scope.DataExtractor;
      if (isNode) {
        Clz = require('./data-extractor').DataExtractor;
      }
      const args = this._getRequestDetails();
      const extractor = new Clz(args);
      const iterator = this._hasIterator ? this._iterator : undefined;
      const value = extractor.extract(this._sourcePath, iterator);
      return this._performAction(value)
      .then(() => true);
    }
    /**
     * If needed it reads request and response body string value and sets class
     * fields with the value so other methods do not need to clone objects
     * all over again.
     *
     * @param {Request} request Request object as defined in Fetch API
     * @param {Response} response Response object as defined in Fetch API
     * @return {Promise} Resolved promise when done.
     */
    _prepareBodyValues(request, response) {
      var bodyNeeded = this._requiresBody();
      var promises = [];
      if (bodyNeeded.request) {
        let p = this._getBody(request)
        .then((value) => this._requestBody = value);
        promises.push(p);
      }

      if (bodyNeeded.response) {
        let p = this._getBody(response)
        .then((value) => this._responseBody = value);
        promises.push(p);
      }
      return Promise.all(promises);
    }
    /**
     * Creates an object with request and response data.
     *
     * @return {Object} Object that can be passed to other classes constructors.
     */
    _getRequestDetails() {
      return {
        request: this._request,
        requestBody: this._requestBody,
        response: this._response,
        responseBody: this._responseBody
      };
    }

    /**
     * Checks is conditions for the actions are meet.
     *
     * @return {Boolean} False of any of the conditions aren't meet.
     */
    _areConditionsMeet() {
      var cond = this.conditions;
      if (!cond || !cond.length) {
        return true;
      }
      var args = this._getRequestDetails();
      for (let i = 0, len = cond.length; i < len; i++) {
        if (!cond[i].satisfied(args)) {
          return false;
        }
      }
      return true;
    }
    /**
     * Checks if any source (either for main configuration or conditions') requires
     * to read request / response body.
     *
     * @return {Object} Map with boolean values for both request and response.
     * True indicates that the request / response body needs to be read.
     *
     * ### example
     * ```
     * {
     *  request: false,
     *  response: true
     * }
     * ```
     */
    _requiresBody() {
      let result = {
        request: false,
        response: false
      };
      if (this._source.indexOf('request.body') !== -1) {
        result.request = true;
      }
      if (this._source.indexOf('response.body') !== -1) {
        result.response = true;
      }
      var cond = this.conditions;
      if (cond && cond.length) {
        cond.forEach((obj) => {
          if (obj._source.indexOf('request.body') !== -1) {
            result.request = true;
          }
          if (obj._source.indexOf('response.body') !== -1) {
            result.response = true;
          }
        });
      }
      return result;
    }

    /**
     * Reads body value for given source.
     *
     * @param {Request|Response} source Request or Response object to read the
     * data from.
     * @return {Promise} Promise resolved to a value of the body.
     */
    _getBody(source) {
      const clone = source.clone();
      return clone.text();
    }
    /**
     * Performs action encoded in the configuration object.
     *
     * @param {String} value Value read from the request / response.
     * @return {Promise} Promise resolved when the action is performed.
     */
    _performAction(value) {
      switch (this._action) {
        case 'assign-variable': return this._assignVariable(value);
        case 'store-variable': return this._storeVariable(value);
        default: throw new Error('Unknown action: ' + this._action);
      }
    }
    /**
     * Assigns value to a variable.
     * It sends an event (Custom Event in a browser or EventEmmiter in node)
     * so the application can handle change of the variable in a correct way.
     * This event mean to update variable value in memory only. The implementation
     * should not store the new value in the data store.
     *
     * @param {?String} value A value read from the source path.
     * @return {Promise} A promise resolved when the value is updated.
     */
    _assignVariable(value) {
      let detail = {
        variable: this._destination,
        value: value
      };
      this.emit('variable-update-action', detail);
      return Promise.resolve();
    }
    /**
     * Assigns value to a variable.
     * It sends an event (Custom Event in a browser or EventEmmiter in node)
     * so the application can handle change of the variable in a correct way.
     *
     * This event mean to update variable value and store it in the data store.
     *
     * @param {?String} value A value read from the source path.
     * @return {Promise} A promise resolved when the value is updated.
     */
    _storeVariable(value) {
      let detail = {
        variable: this._destination,
        value: value
      };
      this.emit('variable-store-action', detail);
      return Promise.resolve();
    }
  }
  scope.RequestLogicAction = RequestLogicAction;
})(isNode ? exports : window);