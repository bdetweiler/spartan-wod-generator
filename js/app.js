$(document).ready(function() {

  var sql = window.SQL;
  // var sql = require('sql.js');

  // Create a database
  var db = new sql.Database();

  // NOTE: You can also use new sql.Database(data) where
  // data is an Uint8Array representing an SQLite database file

  // Execute some sql
  sqlstr = "CREATE TABLE hello (a int, b char);";
  sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
  sqlstr += "INSERT INTO hello VALUES (1, 'world');"
  db.run(sqlstr); // Run the query without returning anything

  var res = db.exec("SELECT * FROM hello");
  /*
  [
      {columns:['a','b'], values:[[0,'hello'],[1,'world']]}
  ]
  */

  // Prepare an sql statement
  var stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

  // Bind values to the parameters and fetch the results of the query
  var result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
  console.log(result); // Will print {a:1, b:'world'}

  // Bind other values
  stmt.bind([0, 'hello']);
  while (stmt.step()) console.log(stmt.get()); // Will print [0, 'hello']

  // free the memory used by the statement
  stmt.free();
  // You can not use your statement anymore once it has been freed.
  // But not freeing your statements causes memory leaks. You don't want that.

  // Export the database to an Uint8Array containing the SQLite database file
  var binaryArray = db.export();
});
