var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');

var run = function run(cmd) {
  return (
    childProcess
      .execSync(cmd, {
        stdio: [0, 'pipe', 'ignore']
      })
      .toString() || ''
  ).trim();
};

describe('run4staged should:', () => {
  beforeEach(() => {
    rimraf.sync(path.resolve(__dirname, 'test'));
    fs.mkdirSync(path.resolve(__dirname, 'test'));
    fs.writeFileSync(path.resolve(__dirname, 'test', 'test.js'), JSON.stringify({ test: 'test' }));
    run('git add test/');
  });

  afterEach(() => {
    run('git reset HEAD ./test || true');
    rimraf.sync(path.resolve(__dirname, 'test'));
  });

  it('run with staged files', () => {
    expect(run('node index.js echo')).toMatchSnapshot();
  });

  it('run with staged files using command arg', () => {
    expect(run('node index.js --command "echo"')).toMatchSnapshot();
  });

  it('run npm script correctly with yarn', () => {
    expect(run('node index.js "yarn npmRunTestScript"')).toContain('YES test/test.js');
  });

  it('run npm script correctly with npm', () => {
    expect(run('node index.js "npm run npmRunTestScript"')).toContain('YES test/test.js');
  });

  it('run with correct staged files given glob', () => {
    fs.writeFileSync(path.resolve(__dirname, 'test', 'test.jsx'));
    run('git add test/');
    expect(run('node index.js echo --glob "**/*.jsx"')).toMatchSnapshot();
  });

  it('run with verbose messaging', () => {
    expect(run('node index.js echo --verbose')).toMatchSnapshot();
  });

  it('display "no command" with verbose', () => {
    expect(run('node index.js --verbose')).toMatchSnapshot();
  });

  it('run each staged file serially', () => {
    fs.writeFileSync(path.resolve(__dirname, 'test', 'test.jsx'));
    run('git add test/');
    expect(run('node index.js echo --serial')).toMatchSnapshot();
  });

  it('run each staged file silently', () => {
    expect(run('node index.js echo --silent')).toMatchSnapshot();
  });
});

describe('run4staged shouldnt:', () => {
  it('run with no staged files', () => {
    rimraf.sync(path.resolve(__dirname, 'test'));
    expect(run('node index.js echo')).toMatchSnapshot();
  });

  it('run with no staged files and warn with verbose', () => {
    rimraf.sync(path.resolve(__dirname, 'test'));
    expect(run('node index.js echo --verbose')).toMatchSnapshot();
  });
})
