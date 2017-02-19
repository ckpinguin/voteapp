import expect from 'expect';
import convertVote from '../../../src/common/backend/convertVote';
import rawData from '../../fixtures/rawVote';
import expectedData from '../../fixtures/convertedVote';

describe('Backend', () => {
    describe('convertVote', () => {
        it('calculates total votes', () => {
            const convertedVote = convertVote(rawData);
            expect(convertedVote.totalVotes).toBe(expectedData.totalVotes);
        });
    });
});
