const CDBDriver = require('../app/main.js');

test('construction using config object without auth',() => {
  const driver = new CDBDriver({
    host: 'http://localhost:5984/'
  })

  expect(driver).toBeInstanceOf(CDBDriver);
  expect(driver).toHaveProperty('_auth',false);
  expect(driver).toHaveProperty('host','http://localhost:5984/');
})

test('construction using config object with auth',() => {
  const driver = new CDBDriver({
    host: 'http://localhost:5984/',
    user: 'admin',
    pass: 'p455w0rd'
  })

  expect(driver).toBeInstanceOf(CDBDriver);
  expect(driver).toHaveProperty('_auth',true);
  expect(driver).toHaveProperty('host','http://localhost:5984/');
  expect(driver).toHaveProperty('user','admin');
  expect(driver).toHaveProperty('pass','p455w0rd');
})

test('construction using config string without auth',() => {
  const driver = new CDBDriver('http://localhost:5984/');

  expect(driver).toBeInstanceOf(CDBDriver);
  expect(driver).toHaveProperty('_auth',false);
  expect(driver).toHaveProperty('host','http://localhost:5984/');
})

test('construction using config string with auth',() => {
  const driver = new CDBDriver('http://admin:p455w0rd@localhost:5984/');

  expect(driver).toBeInstanceOf(CDBDriver);
  expect(driver).toHaveProperty('_auth',true);
  expect(driver).toHaveProperty('host','http://localhost:5984/');
  expect(driver).toHaveProperty('user','admin');
  expect(driver).toHaveProperty('pass','p455w0rd');
})

const testing_driver = new CDBDriver({
  host: 'http://localhost:5984/',
  user: 'testuser',
  pass: 'testpass'
})

test('info method (sync)',() => {
  var info = testing_driver.info();

  expect(info).toHaveProperty('state',200);
  expect(info).toHaveProperty('response.couchdb','Welcome');
  expect(info).toHaveProperty('response.version');
  expect(info).toHaveProperty('response.vendor');
})

test('info method (async)',done => {
  function callback(result) {
    expect(result).toHaveProperty('state',200);
    expect(result).toHaveProperty('response.couchdb','Welcome');
    expect(result).toHaveProperty('response.version');
    expect(result).toHaveProperty('response.vendor');

    done();
  }

  testing_driver.info(callback);
})

test('allDbs method (sync)',() => {
  var dbs = testing_driver.allDbs();

  expect(dbs).toHaveProperty('state',200);
  expect(dbs.response).toContain('_users');
  expect(dbs.response).toContain('timekeeper_projects');
  expect(dbs.response).toContain('timekeeper_customers');
  expect(dbs.response).toContain('timekeeper_recordings');
})

test('allDbs method (async)',done => {
  function callback(result) {
    expect(result).toHaveProperty('state',200);
    expect(result.response).toContain('_users');
    expect(result.response).toContain('timekeeper_projects');
    expect(result.response).toContain('timekeeper_customers');
    expect(result.response).toContain('timekeeper_recordings');

    done();
  }

  testing_driver.allDbs(callback);
})
