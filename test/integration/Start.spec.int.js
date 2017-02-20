import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import expect, { spyOn } from 'expect';
import TestUtils from 'react-addons-test-utils';

import * as Actions from '../../src/common/actions';
import routes from '../../src/common/routes';
import store from '../../src/common/store/store';
import votes from '../fixtures/convertedVotes';

import { createMemoryHistory } from 'react-router';
const history = createMemoryHistory('/');

function createResponse(jsonResponse, status = 200, contentType = 'application/json') {
    const response = new Response(JSON.stringify(jsonResponse), {
        status: status,
        headers: {
            'Content-type': contentType
        }
    });
    // Need to deliver a resolved Promise:
    return Promise.resolve(response);
}

describe('Application', () => {
    let fetchSpy;
    beforeEach(() => {
        fetchSpy = spyOn(window, 'fetch');

    });

    afterEach(() => {
        fetchSpy.restore();
    });

    it('navigates to votes and loads data on startup', () => {
        TestUtils.renderIntoDocument(
            <Provider store={store}>
                <Router history={history}>
                    { routes }
                </Router>
            </Provider>
        );
        fetchSpy.andReturn(createResponse(votes));

        store.dispatch(Actions.routeToMain());
        expect(store.getState().routing.location.pathname).toEqual('/votes');
        expect(fetchSpy.calls.length).toBe(1);
        expect(fetchSpy.calls[0].arguments.length).toBe(1);
        expect(fetchSpy.calls[0].arguments[0]).tomatch(/api\/votes$/);
    });
});
