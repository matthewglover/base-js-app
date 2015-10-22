import {expect} from 'chai';
import testIt from '../src/test';

// General test to check mocha, babel and chai are all working
describe('Array', () => {
  describe('#indexOf', () => {
    it(`should return -1 when the value is not present`, () => {
      expect([1, 2, 3].indexOf(5)).to.equal(-1);
    });
  });
});


// Test to check importing and compiling from src directory is working properly
describe('testIt', () => {
  it(`should return a "Hello [val]!" message`, () => {
    expect(testIt('World')).to.equal('Hello World!');
  });
});
