import { fixture, assert } from '@open-wc/testing';
import '../request-logic-condition.js';

describe('<request-logic-condition>', function() {
  async function basicFixture() {
    return await fixture(`<request-logic-condition></request-logic-condition>`);
  }

  const EQ_OP = 'equal';
  const NEQ_OP = 'not-equal';
  const GT_OP = 'greater-than';
  const GTE_OP = 'greater-than-equal';
  const LT_OP = 'less-than';
  const LTE_OP = 'less-than-equal';
  const CO_OP = 'contains';
  const RE_OP = 'regex';

  describe('RequestLogicCondition', function() {
    const args = {
      source: 'test',
      operator: 'op',
      condition: 'test'
    };
    let c;
    describe('isEqual()', function() {
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('"a" equals "a"', function() {
        const result = c.isEqual('a', 'a');
        assert.isTrue(result);
      });

      it('"12" equals "12"', function() {
        const result = c.isEqual('12', '12');
        assert.isTrue(result);
      });

      it('"12" equals 12', function() {
        const result = c.isEqual('12', 12);
        assert.isTrue(result);
      });

      it('true equals true', function() {
        const result = c.isEqual(true, true);
        assert.isTrue(result);
      });

      it('"true" equals true', function() {
        const result = c.isEqual('true', true);
        assert.isTrue(result);
      });

      it('true equals "true"', function() {
        const result = c.isEqual(true, 'true');
        assert.isTrue(result);
      });

      it('false equals false', function() {
        const result = c.isEqual(false, false);
        assert.isTrue(result);
      });

      it('"false" equals false', function() {
        const result = c.isEqual('false', false);
        assert.isTrue(result);
      });

      it('false equals "false"', function() {
        const result = c.isEqual(false, 'false');
        assert.isTrue(result);
      });

      it('"a" not equals "b"', function() {
        const result = c.isEqual('a', 'b');
        assert.isFalse(result);
      });

      it('12 equals "12"', function() {
        const result = c.isEqual(12, '12');
        assert.isTrue(result);
      });

      it('undefined equals "a"', function() {
        const result = c.isEqual(undefined, 'a');
        assert.isFalse(result);
      });

      it('"a" equals undefined', function() {
        const result = c.isEqual('a', undefined);
        assert.isFalse(result);
      });
    });
    describe('isNotEqual()', function() {
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('"a" not equals "a"', function() {
        const result = c.isNotEqual('a', 'a');
        assert.isFalse(result);
      });

      it('"12" not equals "12"', function() {
        const result = c.isNotEqual('12', '12');
        assert.isFalse(result);
      });

      it('"12" not equals 12', function() {
        const result = c.isNotEqual('12', 12);
        assert.isFalse(result);
      });

      it('true not equals true', function() {
        const result = c.isNotEqual(true, true);
        assert.isFalse(result);
      });

      it('"true" not equals true', function() {
        const result = c.isNotEqual('true', true);
        assert.isFalse(result);
      });

      it('true not equals "true"', function() {
        const result = c.isNotEqual(true, 'true');
        assert.isFalse(result);
      });

      it('false not equals false', function() {
        const result = c.isNotEqual(false, false);
        assert.isFalse(result);
      });

      it('"false" not equals false', function() {
        const result = c.isNotEqual('false', false);
        assert.isFalse(result);
      });

      it('false not equals "false"', function() {
        const result = c.isNotEqual(false, 'false');
        assert.isFalse(result);
      });

      it('"a" not equals "b"', function() {
        const result = c.isNotEqual('a', 'b');
        assert.isTrue(result);
      });

      it('12 not equals "12"', function() {
        const result = c.isNotEqual(12, '12');
        assert.isFalse(result);
      });

      it('undefined not equals "a"', function() {
        const result = c.isNotEqual(undefined, 'a');
        assert.isTrue(result);
      });

      it('"a" not equals undefined', function() {
        const result = c.isNotEqual('a', undefined);
        assert.isTrue(result);
      });
    });

    describe('isLessThan()', function() {
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('1 less than 2', function() {
        const result = c.isLessThan(1, 2);
        assert.isTrue(result);
      });

      it('1 less than 1', function() {
        const result = c.isLessThan(1, 1);
        assert.isFalse(result);
      });

      it('"1" less than "2"', function() {
        const result = c.isLessThan('1', '2');
        assert.isTrue(result);
      });

      it('2 less than 1', function() {
        const result = c.isLessThan(2, 1);
        assert.isFalse(result);
      });

      it('"2" less than "1"', function() {
        const result = c.isLessThan('2', '1');
        assert.isFalse(result);
      });

      it('"a" less than "b"', function() {
        const result = c.isLessThan('a', 'b');
        assert.isFalse(result);
      });

      it('"b" less than "a"', function() {
        const result = c.isLessThan('a', 'b');
        assert.isFalse(result);
      });

      it('false less than true', function() {
        const result = c.isLessThan(false, true);
        assert.isTrue(result);
      });

      it('true less than false', function() {
        const result = c.isLessThan(true, false);
        assert.isFalse(result);
      });

      it('undefined less than "a"', function() {
        const result = c.isLessThan(undefined, 'a');
        assert.isFalse(result);
      });

      it('"a" less than undefined', function() {
        const result = c.isLessThan('a', undefined);
        assert.isFalse(result);
      });
    });

    describe('isLessThanEqual()', function() {
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('1 less than or equal 2', function() {
        const result = c.isLessThanEqual(1, 2);
        assert.isTrue(result);
      });

      it('1 less than or equal 1', function() {
        const result = c.isLessThanEqual(1, 1);
        assert.isTrue(result);
      });

      it('"1" less than or equal "2"', function() {
        const result = c.isLessThanEqual('1', '2');
        assert.isTrue(result);
      });

      it('"1" less than or equal "1"', function() {
        const result = c.isLessThanEqual('1', '1');
        assert.isTrue(result);
      });

      it('2 less than or equal 1', function() {
        const result = c.isLessThanEqual(2, 1);
        assert.isFalse(result);
      });

      it('"2" less than or equal "1"', function() {
        const result = c.isLessThanEqual('2', '1');
        assert.isFalse(result);
      });

      it('"a" less than or equal "b"', function() {
        const result = c.isLessThanEqual('a', 'b');
        assert.isFalse(result);
      });

      it('"b" less than or equal "a"', function() {
        const result = c.isLessThanEqual('a', 'b');
        assert.isFalse(result);
      });

      it('false less than or equal true', function() {
        const result = c.isLessThanEqual(false, true);
        assert.isTrue(result);
      });

      it('false less than or equal false', function() {
        const result = c.isLessThanEqual(false, false);
        assert.isTrue(result);
      });

      it('true less than or equal true', function() {
        const result = c.isLessThanEqual(true, true);
        assert.isTrue(result);
      });

      it('true less than or equal false', function() {
        const result = c.isLessThanEqual(true, false);
        assert.isFalse(result);
      });

      it('undefined less than or equal "a"', function() {
        const result = c.isLessThanEqual(undefined, 'a');
        assert.isFalse(result);
      });

      it('"a" less than or equal undefined', function() {
        const result = c.isLessThanEqual('a', undefined);
        assert.isFalse(result);
      });
    });

    describe('isGreaterThan()', function() {
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('1 greater than 2', function() {
        const result = c.isGreaterThan(1, 2);
        assert.isFalse(result);
      });

      it('1 greater than 1', function() {
        const result = c.isGreaterThan(1, 1);
        assert.isFalse(result);
      });

      it('"1" greater than "2"', function() {
        const result = c.isGreaterThan('1', '2');
        assert.isFalse(result);
      });

      it('2 greater than 1', function() {
        const result = c.isGreaterThan(2, 1);
        assert.isTrue(result);
      });

      it('"2" greater than "1"', function() {
        const result = c.isGreaterThan('2', '1');
        assert.isTrue(result);
      });

      it('"a" greater than "b"', function() {
        const result = c.isGreaterThan('a', 'b');
        assert.isFalse(result);
      });

      it('"b" less than "a"', function() {
        const result = c.isGreaterThan('a', 'b');
        assert.isFalse(result);
      });

      it('false greater than true', function() {
        const result = c.isGreaterThan(false, true);
        assert.isFalse(result);
      });

      it('true greater than false', function() {
        const result = c.isGreaterThan(true, false);
        assert.isTrue(result);
      });

      it('false greater than false', function() {
        const result = c.isGreaterThan(false, false);
        assert.isFalse(result);
      });

      it('true greater than true', function() {
        const result = c.isGreaterThan(true, true);
        assert.isFalse(result);
      });

      it('undefined greater than "a"', function() {
        const result = c.isGreaterThan(undefined, 'a');
        assert.isFalse(result);
      });

      it('"a" greater than undefined', function() {
        const result = c.isGreaterThan('a', undefined);
        assert.isFalse(result);
      });
    });

    describe('isGreaterThanEqual()', function() {
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('1 greater than or equal 2', function() {
        const result = c.isGreaterThanEqual(1, 2);
        assert.isFalse(result);
      });

      it('1 greater than or equal 1', function() {
        const result = c.isGreaterThanEqual(1, 1);
        assert.isTrue(result);
      });

      it('"1" greater than or equal "2"', function() {
        const result = c.isGreaterThanEqual('1', '2');
        assert.isFalse(result);
      });

      it('2 greater than or equal 1', function() {
        const result = c.isGreaterThanEqual(2, 1);
        assert.isTrue(result);
      });

      it('"2" greater than or equal "1"', function() {
        const result = c.isGreaterThanEqual('2', '1');
        assert.isTrue(result);
      });

      it('"2" greater than or equal "2"', function() {
        const result = c.isGreaterThanEqual('2', '2');
        assert.isTrue(result);
      });

      it('"a" greater than or equal "b"', function() {
        const result = c.isGreaterThanEqual('a', 'b');
        assert.isFalse(result);
      });

      it('"b" less than or equal "a"', function() {
        const result = c.isGreaterThanEqual('a', 'b');
        assert.isFalse(result);
      });

      it('false greater than or equal true', function() {
        const result = c.isGreaterThanEqual(false, true);
        assert.isFalse(result);
      });

      it('true greater than or equal false', function() {
        const result = c.isGreaterThanEqual(true, false);
        assert.isTrue(result);
      });

      it('false greater than or equal false', function() {
        const result = c.isGreaterThanEqual(false, false);
        assert.isTrue(result);
      });

      it('true greater than or equal true', function() {
        const result = c.isGreaterThanEqual(true, true);
        assert.isTrue(result);
      });

      it('undefined less than or equal "a"', function() {
        const result = c.isGreaterThanEqual(undefined, 'a');
        assert.isFalse(result);
      });

      it('"a" less than or equal undefined', function() {
        const result = c.isGreaterThanEqual('a', undefined);
        assert.isFalse(result);
      });
    });

    describe('contains()', function() {
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      describe('Strings', function() {
        it('abc contains a', function() {
          const result = c.contains('abc', 'a');
          assert.isTrue(result);
        });

        it('abc contains c', function() {
          const result = c.contains('abc', 'c');
          assert.isTrue(result);
        });

        it('abc does not contains d', function() {
          const result = c.contains('abc', 'd');
          assert.isFalse(result);
        });

        it('abc does not contains undefined', function() {
          const result = c.contains('abc', undefined);
          assert.isFalse(result);
        });

        it('undefined does not contains a', function() {
          const result = c.contains(undefined, 'a');
          assert.isFalse(result);
        });
      });

      describe('Arrays', function() {
        const value = ['a', 'b', 'c', 1, 2];
        it('[a,b,c,1,2,3] contains "a"', function() {
          const result = c.contains(value, 'a');
          assert.isTrue(result);
        });

        it('[a,b,c,1,2,3] contains "c"', function() {
          const result = c.contains(value, 'c');
          assert.isTrue(result);
        });

        it('[a,b,c,1,2,3] contains 1', function() {
          const result = c.contains(value, 1);
          assert.isTrue(result);
        });

        it('[a,b,c,1,2,3] contains "2"', function() {
          const result = c.contains(value, '2');
          assert.isTrue(result);
        });

        it('[a,b,c,1,2,3] does not contains d', function() {
          const result = c.contains(value, 'd');
          assert.isFalse(result);
        });

        it('[a,b,c,1,2,3] does not contains undefined', function() {
          const result = c.contains(value, undefined);
          assert.isFalse(result);
        });

        it('undefined does not contains a', function() {
          const result = c.contains(undefined, 'a');
          assert.isFalse(result);
        });
      });

      describe('Object', function() {
        const sym = Symbol('foo');
        const value = {
          a: 'a',
          b: 'b',
          c: 'c',
          1: '1',
          2: '2',
          3: '3'
        };
        before(function() {
          value[sym] = 'sym';
        });

        it('Object contains "a"', function() {
          const result = c.contains(value, 'a');
          assert.isTrue(result);
        });

        it('Object contains "c"', function() {
          const result = c.contains(value, 'a');
          assert.isTrue(result);
        });

        it('Object contains "1"', function() {
          const result = c.contains(value, '1');
          assert.isTrue(result);
        });

        it('Object contains 1', function() {
          const result = c.contains(value, 1);
          assert.isTrue(result);
        });

        it('Object contains Symbol', function() {
          const result = c.contains(value, sym);
          assert.isTrue(result);
        });

        it('Object does not contains d', function() {
          const result = c.contains(value, 'd');
          assert.isFalse(result);
        });

        it('Object does not contains undefined', function() {
          const result = c.contains(value, undefined);
          assert.isFalse(result);
        });

        it('undefined does not contains a', function() {
          const result = c.contains(undefined, 'a');
          assert.isFalse(result);
        });
      });

      describe('Other types', function() {
        it('False for boolean value', function() {
          const result = c.contains(true, true);
          assert.isFalse(result);
        });

        it('False for undefined value', function() {
          const result = c.contains(undefined, undefined);
          assert.isFalse(result);
        });

        it('False for null value', function() {
          const result = c.contains(null, null);
          assert.isFalse(result);
        });

        it('False for Symbol value', function() {
          const symbol = Symbol('a');
          const result = c.contains(symbol, symbol);
          assert.isFalse(result);
        });
      });
    });

    describe('isRegex()', function() {
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('returns true when matches', () => {
        const result = c.isRegex('make my day', 'make');
        assert.isTrue(result);
      });

      it('returns true when matches multiline', () => {
        const result = c.isRegex(`Please,
          make my day`, 'make');
        assert.isTrue(result);
      });

      it('is case sensitive', () => {
        const result = c.isRegex(`Please,
          make my day`, 'Make');
        assert.isFalse(result);
      });

      it('returns false when no match', () => {
        const result = c.isRegex(`make my day`, 'other');
        assert.isFalse(result);
      });

      it('returns false when invalid regexp', () => {
        const result = c.isRegex(`make my day`, '[a-z');
        assert.isFalse(result);
      });
    });

    describe('checkCondition()', function() {
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('true for equal action', function() {
        const result = c.checkCondition(1, EQ_OP, 1);
        assert.isTrue(result);
      });

      it('false for equal action', function() {
        const result = c.checkCondition(1, EQ_OP, 2);
        assert.isFalse(result);
      });

      it('true for not equal action', function() {
        const result = c.checkCondition(2, NEQ_OP, 1);
        assert.isTrue(result);
      });

      it('false for not equal action', function() {
        const result = c.checkCondition(1, NEQ_OP, 1);
        assert.isFalse(result);
      });

      it('true for less than action', function() {
        const result = c.checkCondition(1, LT_OP, 2);
        assert.isTrue(result);
      });

      it('false for less than action', function() {
        const result = c.checkCondition(2, LT_OP, 1);
        assert.isFalse(result);
      });

      it('true for less than or equal action', function() {
        const result = c.checkCondition(2, LTE_OP, 2);
        assert.isTrue(result);
      });

      it('false for less than or equal action', function() {
        const result = c.checkCondition(2, LTE_OP, 1);
        assert.isFalse(result);
      });

      it('true for greater than action', function() {
        const result = c.checkCondition(2, GT_OP, 1);
        assert.isTrue(result);
      });

      it('false for greater than action', function() {
        const result = c.checkCondition(1, GT_OP, 2);
        assert.isFalse(result);
      });

      it('true for greater than or equal action', function() {
        const result = c.checkCondition(2, GTE_OP, 2);
        assert.isTrue(result);
      });

      it('false for greater than or equal action', function() {
        const result = c.checkCondition(1, GTE_OP, 2);
        assert.isFalse(result);
      });

      it('true for contains action', function() {
        const result = c.checkCondition('abc', CO_OP, 'a');
        assert.isTrue(result);
      });

      it('false for contains action', function() {
        const result = c.checkCondition('abc', CO_OP, 'd');
        assert.isFalse(result);
      });

      it('true for regex action', function() {
        const result = c.checkCondition('abc', RE_OP, 'a');
        assert.isTrue(result);
      });

      it('false for regex action', function() {
        const result = c.checkCondition('abc', RE_OP, 'd');
        assert.isFalse(result);
      });
    });
  });

  describe('satisfied()', function() {
    const jsonStr = `{
      "nextPageToken": "test-token",
      "data": [{
        "name": "test1",
        "numeric": 1
      }, {
        "name": "test2",
        "arr": ["a", 1]
      }, {
        "name": "test3",
        "value": "array",
        "deep": {
          "booleanValue": true,
          "nullValue": null,
          "numberValue": 2,
          "arrayValue": ["test1", "test2"]
        }
      }]
    }`;
    let request;
    let response;
    let c;
    before(function() {
      request = {
        url: '/'
      };
      response = {
        payload: jsonStr,
        headers: 'content-type: application/json',
        url: '/'
      };
    });

    describe('equal op', function() {
      const args = {
        source: 'response.body.data.2.value',
        operator: 'equal',
        condition: 'array'
      };
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('true action', function() {
        const result = c.satisfied(request, response);
        assert.isTrue(result);
      });

      it('false action', function() {
        c.condition = 'not-equal';
        const result = c.satisfied(request, response);
        assert.isFalse(result);
      });
    });

    describe('not equal op', function() {
      const args = {
        source: 'response.body.data.2.value',
        operator: 'not-equal',
        condition: 'array'
      };
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('true for action', function() {
        c.condition = 'other';
        const result = c.satisfied(request, response);
        assert.isTrue(result);
      });

      it('false for action', function() {
        const result = c.satisfied(request, response);
        assert.isFalse(result);
      });
    });

    describe('less than op', function() {
      const args = {
        source: 'response.body.data.0.numeric',
        operator: 'less-than',
        condition: '2'
      };
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('true for action', function() {
        const result = c.satisfied(request, response);
        assert.isTrue(result);
      });

      it('false for action', function() {
        c.condition = 0;
        const result = c.satisfied(request, response);
        assert.isFalse(result);
      });
    });

    describe('less than or equal op', function() {
      const args = {
        source: 'response.body.data.0.numeric',
        operator: 'less-than-equal',
        condition: '1'
      };
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('true for action', function() {
        const result = c.satisfied(request, response);
        assert.isTrue(result);
      });

      it('false for action', function() {
        c.condition = 0;
        const result = c.satisfied(request, response);
        assert.isFalse(result);
      });
    });

    describe('greater than op', function() {
      const args = {
        source: 'response.body.data.0.numeric',
        operator: 'greater-than',
        condition: '0'
      };
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('true for action', function() {
        const result = c.satisfied(request, response);
        assert.isTrue(result);
      });

      it('false for action', function() {
        c.condition = 2;
        const result = c.satisfied(request, response);
        assert.isFalse(result);
      });
    });

    describe('greater than or equal op', function() {
      const args = {
        source: 'response.body.data.0.numeric',
        operator: 'greater-than-equal',
        condition: '1'
      };
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('true for action', function() {
        const result = c.satisfied(request, response);
        assert.isTrue(result);
      });

      it('false for action', function() {
        c.condition = 2;
        const result = c.satisfied(request, response);
        assert.isFalse(result);
      });
    });

    describe('contains op', function() {
      describe('String', function() {
        const args = {
          source: 'response.body.nextPageToken',
          operator: 'contains',
          condition: 'token'
        };
        beforeEach(async function() {
          c = await basicFixture();
          c.enabled = true;
          c.source = args.source;
          c.operator = args.operator;
          c.condition = args.condition;
        });

        it('true for action', function() {
          const result = c.satisfied(request, response);
          assert.isTrue(result);
        });

        it('false for action', function() {
          c.condition = 'hello';
          const result = c.satisfied(request, response);
          assert.isFalse(result);
        });
      });

      describe('Array', function() {
        const args = {
          source: 'response.body.data.1.arr',
          operator: 'contains',
          condition: 'a'
        };
        beforeEach(async function() {
          c = await basicFixture();
          c.enabled = true;
          c.source = args.source;
          c.operator = args.operator;
          c.condition = args.condition;
        });

        it('true for action', function() {
          const result = c.satisfied(request, response);
          assert.isTrue(result);
        });

        it('false for action', function() {
          c.condition = 'b';
          const result = c.satisfied(request, response);
          assert.isFalse(result);
        });
      });

      describe('Object', function() {
        const args = {
          source: 'response.body',
          operator: 'contains',
          condition: 'nextPageToken'
        };
        beforeEach(async function() {
          c = await basicFixture();
          c.enabled = true;
          c.source = args.source;
          c.operator = args.operator;
          c.condition = args.condition;
        });

        it('true for action', function() {
          const result = c.satisfied(request, response);
          assert.isTrue(result);
        });

        it('false for action', function() {
          c.condition = 'nextPageTokenNot';
          const result = c.satisfied(request, response);
          assert.isFalse(result);
        });
      });
    });

    describe('regexp op', function() {
      const args = {
        source: 'response.body.nextPageToken',
        operator: RE_OP,
        condition: 'test-token'
      };
      beforeEach(async function() {
        c = await basicFixture();
        c.enabled = true;
        c.source = args.source;
        c.operator = args.operator;
        c.condition = args.condition;
      });

      it('true for action', function() {
        const result = c.satisfied(request, response);
        assert.isTrue(result);
      });

      it('false for action', function() {
        c.condition = 'other-token';
        const result = c.satisfied(request, response);
        assert.isFalse(result);
      });
    });
  });

  describe('Disabled condition', function() {
    const jsonStr = `{
      "nextPageToken": "test-token",
      "data": [{
        "name": "test1",
        "numeric": 1
      }, {
        "name": "test2",
        "arr": ["a", 1]
      }, {
        "name": "test3",
        "value": "array",
        "deep": {
          "booleanValue": true,
          "nullValue": null,
          "numberValue": 2,
          "arrayValue": ["test1", "test2"]
        }
      }]
    }`;
    let c;
    const args = {
      source: 'response.body',
      operator: 'contains',
      condition: 'nextPageToken'
    };
    let request;
    let response;
    before(function() {
      request = {
        url: '/'
      };
      response = {
        payload: jsonStr,
        headers: 'content-type: application/json',
        url: '/'
      };
    });

    beforeEach(async function() {
      c = await basicFixture();
      c.enabled = false;
      c.source = args.source;
      c.operator = args.operator;
      c.condition = args.condition;
    });

    it('Sets enabled property to false', function() {
      assert.isFalse(c.enabled);
    });

    it('satisfied() always returns false', function() {
      const result = c.satisfied(request, response);
      assert.isFalse(result);
      c.condition = 'nextPageTokenNot';
      const result2 = c.satisfied(request, response);
      assert.isFalse(result2);
    });
  });
});
