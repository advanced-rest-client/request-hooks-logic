import { fixture, assert } from '@open-wc/testing';
import '../request-data-extractor.js';

describe('<request-data-extractor>', function() {
  async function basicFixture() {
    return await fixture(`<request-data-extractor></request-data-extractor>`);
  }
  const xmlStr = `<?xml version="1.0"?>
  <people xmlns:xul="some.xul" boolean-attribute="true">
    <person db-id="test1">
      <name first="george" last="bush" />
      <address street="1600 pennsylvania avenue" city="washington" country="usa"/>
      <phoneNumber>202-456-1111</phoneNumber>
    </person>
    <person db-id="test2">
      <name first="tony" last="blair" />
      <address street="10 downing street" city="london" country="uk"/>
      <phoneNumber>020 7925 0918</phoneNumber>
    </person>
  </people>`;

  const jsonStr = `{
    "nextPageToken": "test-token",
    "data": [{
      "name": "test1"
    }, {
      "name": "test2"
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

  describe('Response::extract()', function() {
    describe('Body', function() {
      describe('XML', function() {
        let logic;
        beforeEach(async () => {
          logic = await basicFixture();
          logic.request = {
            url: '/',
            headers: '',
            method: 'GET'
          };
          logic.response = {
            status: 200,
            payload: xmlStr,
            headers: 'content-type: application/xml'
          };
        });

        it('Parses string path', function() {
          logic.path = 'response.body.people.person';
          const result = logic.extract();
          assert.isTrue(result.indexOf('<name') !== -1);
        });

        it('Parses array path', function() {
          logic.path = ['response', 'body', 'people', 'person'];
          const result = logic.extract();
          assert.isTrue(result.indexOf('<name') !== -1);
        });

        it('Parses complex path', function() {
          logic.path = ['response', 'body', 'people', 'person', '1', 'phoneNumber'];
          const result = logic.extract();
          assert.equal(result, '020 7925 0918');
        });

        it('Gets attribute value', function() {
          logic.path = ['response', 'body', 'people', 'person', '0', 'attr(db-id)'];
          const result = logic.extract();
          assert.equal(result, 'test1');
        });

        it('Gets attribute value 2', function() {
          logic.path = ['response', 'body', 'people', 'person', '1', 'name', 'attr(first)'];
          const result = logic.extract();
          assert.equal(result, 'tony');
        });

        it('Gets attribute value 3', function() {
          logic.path = ['response', 'body', 'people', 'attr(xmlns:xul)'];
          const result = logic.extract();
          assert.equal(result, 'some.xul');
        });

        it('Gets boolean attribute value', function() {
          logic.path = ['response', 'body', 'people', 'attr(boolean-attribute)'];
          const result = logic.extract();
          assert.equal(result, 'true');
        });
      });

      describe('JSON', function() {
        let logic;
        beforeEach(async () => {
          logic = await basicFixture();
          logic.request = {
            url: '/',
            headers: '',
            method: 'GET'
          };
          logic.response = {
            status: 200,
            payload: jsonStr,
            headers: 'content-type: application/json'
          };
        });

        it('Parses string path', function() {
          logic.path = 'response.body.nextPageToken';
          const result = logic.extract();
          assert.equal(result, 'test-token');
        });

        it('Parses array path', function() {
          logic.path = ['response', 'body', 'nextPageToken'];
          const result = logic.extract();
          assert.equal(result, 'test-token');
        });

        it('Parses complex path', function() {
          logic.path = ['response', 'body', 'data', '1', 'name'];
          const result = logic.extract();
          assert.equal(result, 'test2');
        });

        it('Returns boolean value', function() {
          logic.path = ['response', 'body', 'data', '2', 'deep', 'booleanValue'];
          const result = logic.extract();
          assert.isTrue(result);
        });

        it('Returns null value', function() {
          logic.path = ['response', 'body', 'data', '2', 'deep', 'nullValue'];
          const result = logic.extract();
          assert.isTrue(result === null);
        });

        it('Returns numeric value', function() {
          logic.path = ['response', 'body', 'data', '2', 'deep', 'numberValue'];
          const result = logic.extract();
          assert.equal(result, 2);
        });

        it('Returns array value', function() {
          logic.path = ['response', 'body', 'data', '2', 'deep', 'arrayValue', '1'];
          const result = logic.extract();
          assert.equal(result, 'test2');
        });
      });
    });

    describe('Headers', function() {
      let logic;
      beforeEach(async () => {
        logic = await basicFixture();
        logic.request = {
          url: '/',
          headers: '',
          method: 'GET'
        };
        logic.response = {
          status: 200,
          payload: '{}',
          headers: 'content-type: application/json\nx-www-token: ' +
            'test-token\ncontent-encoding: gzip'
        };
      });

      it('Should get a value for default header', function() {
        logic.path = ['response', 'headers', 'content-type'];
        const result = logic.extract();
        assert.equal(result, 'application/json');
      });

      it('Should get a value for custom header', function() {
        logic.path = ['response', 'headers', 'x-www-token'];
        const result = logic.extract();
        assert.equal(result, 'test-token');
      });

      it('Should return undefined for whole headers object', function() {
        logic.path = ['response', 'headers'];
        const result = logic.extract();
        assert.equal(result, undefined);
      });

      it('Should return undefined for not existing header', function() {
        logic.path = ['response', 'headers', 'not-there'];
        const result = logic.extract();
        assert.equal(result, undefined);
      });
    });

    describe('URL', function() {
      let logic;
      const url = 'https://auth.domain.com/path/auth?query=value&a=b#hparam=hvalue&c=d';
      beforeEach(async () => {
        logic = await basicFixture();
        logic.request = {
          url: url,
          headers: '',
          method: 'GET'
        };
        logic.response = {
          url: url,
          status: 200,
          payload: '{}',
          headers: ''
        };
      });

      it('Should get whole URL', function() {
        logic.path = ['response', 'url'];
        const result = logic.extract();
        assert.equal(result, url);
      });

      it('Should read the host value', function() {
        logic.path = ['response', 'url', 'host'];
        const result = logic.extract();
        assert.equal(result, 'auth.domain.com');
      });

      it('Should read the protocol value', function() {
        logic.path = ['response', 'url', 'protocol'];
        const result = logic.extract();
        assert.equal(result, 'https:');
      });

      it('Should read the path value', function() {
        logic.path = ['response', 'url', 'path'];
        const result = logic.extract();
        assert.equal(result, '/path/auth');
      });

      it('Should read the whole query value', function() {
        logic.path = ['response', 'url', 'query'];
        const result = logic.extract();
        assert.equal(result, 'query=value&a=b');
      });

      it('Should read the query parameter value', function() {
        logic.path = ['response', 'url', 'query', 'query'];
        const result = logic.extract();
        assert.equal(result, 'value');
      });

      it('Should read the query parameter 2', function() {
        logic.path = ['response', 'url', 'query', 'a'];
        const result = logic.extract();
        assert.equal(result, 'b');
      });

      it('Should return undefined for unknown query parameter', function() {
        logic.path = ['response', 'url', 'query', 'c'];
        const result = logic.extract();
        assert.isUndefined(result);
      });

      it('Should read the whole hash value', function() {
        logic.path = ['response', 'url', 'hash'];
        const result = logic.extract();
        assert.equal(result, 'hparam=hvalue&c=d');
      });

      it('Should read the hash parameter value', function() {
        logic.path = ['response', 'url', 'hash', 'hparam'];
        const result = logic.extract();
        assert.equal(result, 'hvalue');
      });

      it('Should read the hash parameter 2', function() {
        logic.path = ['response', 'url', 'hash', 'c'];
        const result = logic.extract();
        assert.equal(result, 'd');
      });

      it('Should return undefined for unknown hash parameter', function() {
        logic.path = ['response', 'url', 'hash', 'e'];
        const result = logic.extract();
        assert.isUndefined(result);
      });
    });
  });

  describe('Request::extract()', function() {
    describe('Body', function() {
      describe('XML', function() {
        let logic;
        beforeEach(async () => {
          logic = await basicFixture();
          logic.request = {
            url: 'http://domain.com',
            headers: 'content-type: application/xml',
            method: 'POST',
            payload: xmlStr
          };
          logic.response = {
            url: '/',
            status: 200,
            payload: '<atom></atom>',
            headers: 'content-type: application/xml'
          };
        });

        it('Parses simple path', function() {
          logic.path = ['request', 'body', 'people', 'person'];
          const result = logic.extract();
          assert.isTrue(result.indexOf('<name') !== -1);
        });

        it('Parses complex path', function() {
          logic.path = ['request', 'body', 'people', 'person', '1', 'phoneNumber'];
          const result = logic.extract();
          assert.equal(result, '020 7925 0918');
        });

        it('Gets attribute value', function() {
          logic.path = ['request', 'body', 'people', 'person', '0', 'attr(db-id)'];
          const result = logic.extract();
          assert.equal(result, 'test1');
        });

        it('Gets attribute value 2', function() {
          logic.path = ['request', 'body', 'people', 'person', '1', 'name', 'attr(first)'];
          const result = logic.extract();
          assert.equal(result, 'tony');
        });

        it('Gets attribute value 3', function() {
          logic.path = ['request', 'body', 'people', 'attr(xmlns:xul)'];
          const result = logic.extract();
          assert.equal(result, 'some.xul');
        });

        it('Gets boolean attribute value', function() {
          logic.path = ['request', 'body', 'people', 'attr(boolean-attribute)'];
          const result = logic.extract();
          assert.equal(result, 'true');
        });
      });

      describe('JSON', function() {
        let logic;
        beforeEach(async () => {
          logic = await basicFixture();
          logic.request = {
            url: 'http://domain.com',
            headers: 'content-type: application/json',
            method: 'POST',
            payload: jsonStr
          };
          logic.response = {
            url: '/',
            status: 200,
            payload: '{}',
            headers: 'content-type: application/json'
          };
        });

        it('Parses simple path', function() {
          logic.path = ['request', 'body', 'nextPageToken'];
          const result = logic.extract();
          assert.equal(result, 'test-token');
        });

        it('Parses complex path', function() {
          logic.path = ['request', 'body', 'data', '1', 'name'];
          const result = logic.extract();
          assert.equal(result, 'test2');
        });

        it('Returns boolean value', function() {
          logic.path = ['request', 'body', 'data', '2', 'deep', 'booleanValue'];
          const result = logic.extract();
          assert.isTrue(result);
        });

        it('Returns null value', function() {
          logic.path = ['request', 'body', 'data', '2', 'deep', 'nullValue'];
          const result = logic.extract();
          assert.isTrue(result === null);
        });

        it('Returns numeric value', function() {
          logic.path = ['request', 'body', 'data', '2', 'deep', 'numberValue'];
          const result = logic.extract();
          assert.equal(result, 2);
        });

        it('Returns array value', function() {
          logic.path = ['request', 'body', 'data', '2', 'deep', 'arrayValue', '1'];
          const result = logic.extract();
          assert.equal(result, 'test2');
        });
      });
    });

    describe('Headers', function() {
      let logic;
      beforeEach(async () => {
        logic = await basicFixture();
        logic.request = {
          url: 'http://domain.com',
          headers: 'content-type: application/xml\nx-www-token: ' +
            'test-token\ncontent-encoding: gzip',
          method: 'GET'
        };
        logic.response = {
          url: '/',
          status: 200,
          payload: '<atom></atom>',
          headers: 'content-type: application/xml'
        };
      });

      it('Should get a value for default header', function() {
        logic.path = ['request', 'headers', 'content-type'];
        const result = logic.extract();
        assert.equal(result, 'application/xml');
      });

      it('Should get a value for custom header', function() {
        logic.path = ['request', 'headers', 'x-www-token'];
        const result = logic.extract();
        assert.equal(result, 'test-token');
      });

      it('Should return undefined for whole headers object', function() {
        logic.path = ['request', 'headers'];
        const result = logic.extract();
        assert.equal(result, undefined);
      });

      it('Should return undefined for not existing header', function() {
        logic.path = ['request', 'headers', 'not-there'];
        const result = logic.extract();
        assert.equal(result, undefined);
      });
    });

    describe('URL', function() {
      let logic;
      const url = 'https://auth.domain.com/path/auth?query=value&a=b#hparam=hvalue&c=d';
      beforeEach(async () => {
        logic = await basicFixture();
        logic.request = {
          url: url,
          headers: '',
          method: 'GET'
        };
        logic.response = {
          url: url,
          status: 200,
          payload: '<atom></atom>',
          headers: 'content-type: application/xml'
        };
      });

      it('Should get whole URL', function() {
        logic.path = ['request', 'url'];
        const result = logic.extract();
        assert.equal(result, url);
      });

      it('Should read the host value', function() {
        logic.path = ['request', 'url', 'host'];
        const result = logic.extract();
        assert.equal(result, 'auth.domain.com');
      });

      it('Should read the protocol value', function() {
        logic.path = ['request', 'url', 'protocol'];
        const result = logic.extract();
        assert.equal(result, 'https:');
      });

      it('Should read the path value', function() {
        logic.path = ['request', 'url', 'path'];
        const result = logic.extract();
        assert.equal(result, '/path/auth');
      });

      it('Should read the whole query value', function() {
        logic.path = ['request', 'url', 'query'];
        const result = logic.extract();
        assert.equal(result, 'query=value&a=b');
      });

      it('Should read the query parameter value', function() {
        logic.path = ['request', 'url', 'query', 'query'];
        const result = logic.extract();
        assert.equal(result, 'value');
      });

      it('Should read the query parameter 2', function() {
        logic.path = ['request', 'url', 'query', 'a'];
        const result = logic.extract();
        assert.equal(result, 'b');
      });

      it('Should return undefined for unknown query parameter', function() {
        logic.path = ['request', 'url', 'query', 'c'];
        const result = logic.extract();
        assert.isUndefined(result);
      });

      it('Should read the whole hash value', function() {
        logic.path = ['request', 'url', 'hash'];
        const result = logic.extract();
        assert.equal(result, 'hparam=hvalue&c=d');
      });

      it('Should read the hash parameter value', function() {
        logic.path = ['request', 'url', 'hash', 'hparam'];
        const result = logic.extract();
        assert.equal(result, 'hvalue');
      });

      it('Should read the hash parameter 2', function() {
        logic.path = ['request', 'url', 'hash', 'c'];
        const result = logic.extract();
        assert.equal(result, 'd');
      });

      it('Should return undefined for unknown hash parameter', function() {
        logic.path = ['request', 'url', 'hash', 'e'];
        const result = logic.extract();
        assert.isUndefined(result);
      });
    });
  });

  describe('_getDataUrl()', function() {
    const url = 'https://auth.domain.com/path/auth?query=value&a=b#hparam=hvalue&c=d';
    let logic;
    beforeEach(async () => {
      logic = await basicFixture();
      logic.request = {
        url: url,
        headers: '',
        method: 'GET'
      };
      logic.response = {
        url: url,
        status: 200,
        payload: '<atom></atom>',
        headers: 'content-type: application/xml'
      };
    });

    it('Should return the url value', function() {
      const result = logic._getDataUrl(url, []);
      assert.equal(result, url);
    });

    it('Should read the host value', function() {
      const result = logic._getDataUrl(url, ['host']);
      assert.equal(result, 'auth.domain.com');
    });

    it('Should read the protocol value', function() {
      const result = logic._getDataUrl(url, ['protocol']);
      assert.equal(result, 'https:');
    });

    it('Should read the path value', function() {
      const result = logic._getDataUrl(url, ['path']);
      assert.equal(result, '/path/auth');
    });

    it('Should read the whole query value', function() {
      const result = logic._getDataUrl(url, ['query']);
      assert.equal(result, 'query=value&a=b');
    });

    it('Should read the query parameter value', function() {
      const result = logic._getDataUrl(url, ['query', 'query']);
      assert.equal(result, 'value');
    });

    it('Should read the query parameter 2', function() {
      const result = logic._getDataUrl(url, ['query', 'a']);
      assert.equal(result, 'b');
    });

    it('Should return undefined for unknown query parameter', function() {
      const result = logic._getDataUrl(url, ['query', 'c']);
      assert.isUndefined(result);
    });

    it('Should read the whole hash value', function() {
      const result = logic._getDataUrl(url, ['hash']);
      assert.equal(result, 'hparam=hvalue&c=d');
    });

    it('Should read the hash parameter value', function() {
      const result = logic._getDataUrl(url, ['hash', 'hparam']);
      assert.equal(result, 'hvalue');
    });

    it('Should read the hash parameter 2', function() {
      const result = logic._getDataUrl(url, ['hash', 'c']);
      assert.equal(result, 'd');
    });

    it('Should return undefined for unknown hash parameter', function() {
      const result = logic._getDataUrl(url, ['hash', 'e']);
      assert.isUndefined(result);
    });
  });
});
