import <%= fileName %> from '<%= rootPath %>../src/<%= filePath %><%= fileName %>';
import assert from 'assert';

describe('<%= fileName %>', function() {

  it('should be a function', function() {
    assert.equal('function', typeof <%= fileName %>);
  });
});
