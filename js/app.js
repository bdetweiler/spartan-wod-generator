/**
 * Copyright © 2016 Brian Detweiler. All Rights Reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
 * in the documentation and/or other materials provided with the distribution.
 *
 * 3. The name of the author may not be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY BRIAN DETWEILER "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, 
 * BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, 
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT 
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
 */

$(document).ready(function() {

  var sql = window.SQL;
  // var sql = require('sql.js');

  // Create a database
  var db = new sql.Database();

  initdb(db);

  sqlstr = "SELECT * FROM EXERCISE;";

  // Prepare an sql statement
  var rs = db.exec(sqlstr);
  
  console.dir(rs);
  
  // db.close();
  //stmt.free();
  // You can not use your statement anymore once it has been freed.
  // But not freeing your statements causes memory leaks. You don't want that.

  // Export the database to an Uint8Array containing the SQLite database file
  //var binaryArray = db.export();

  $('#add_wod').click(function() {
    addWOD(db);
  });

  $('#close_db').click(function() {
    db.close();
  });

  populateWODs(db);

});


function addWOD(db) {

  var spartanWODId = $('#workouts').find(':selected').attr('value');
  var wodName = $('#wod_name').val();
  var wodCategory = $('input[name="wod_category"]:checked').val();
  var wodQuote = $('#quote').val();
  var wodQuoteBy = $('#quote_by').val();
  var wodDescription = $('#wod_description').val();
  var wodSpecialDay = $('#special_day').val();

  var sqlstr = "";
  if (spartanWODId === 'new') {
  
    sqlstr = "SELECT MAX(SPARTAN_WOD_ID) FROM SPARTAN_WOD;";
    var rs = db.exec(sqlstr);
  
    console.dir(rs);

    console.dir(rs[0]);
    console.dir(rs[0]['values']);

    var spartanWODId = 1;

    console.dir(rs[0]['values'][0]);
    if (rs[0]['values'][0][0] != null) {
      console.log('values ...' + rs[0]['values'].length);
      spartanWODId = rs[0]['values'][0][0];
      spartanWODId++;
    }

    console.log('SPARTAN_WOD_ID = ');
    console.log(spartanWODId);

    // insert WOD
    sqlstr = "INSERT INTO SPARTAN_WOD(SPARTAN_WOD_ID, "
           + "                        NAME, "
           + "                        CATEGORY, "
           + "                        QUOTE, "
           + "                        QUOTE_BY, "
           + "                        DESCRIPTION, "
           + "                        SPECIAL_DAY, "
           + "                        WARMUP_SET, "
           + "                        MAIN_SET_SPRINT, "
           + "                        MAIN_SET_SUPER, "
           + "                        MAIN_SET_BEAST, "
           + "                        MAIN_SET_TRIFECTA, "
           + "                        COOLDOWN_SET) "
           + "                 VALUES(" + spartanWODId + ", "
           + "                        '" + wodName + "', "
           + "                        '" + wodCategory + "', "
           + "                        '" + wodQuote + "', "
           + "                        '" + wodQuoteBy + "', "
           + "                        '" + wodDescription + "', "
           + "                        '" + wodSpecialDay + "', "
           + "                        null, "
           + "                        null, "
           + "                        null, "
           + "                        null, "
           + "                        null,  "
           + "                        null); "
  } else {
    // update
    sqlstr = "UPDATE SPARTAN_WOD "
           + "   SET NAME = '" + wodName + "', "
           + "       CATEGORY = '" + wodCategory + "', "
           + "       QUOTE = '" + wodQuote + "', "
           + "       QUOTE_BY = '" + wodQuoteBy + "', " 
           + "       DESCRIPTION = '" + wodDescription + "', "
           + "       SPECIAL_DAY = '" + wodSpecialDay + "' "
           + " WHERE SPARTAN_WOD_ID = " + spartanWODId + "; "
  }

  db.exec(sqlstr);

  console.dir(rs);

  populateWODs(db);

  $('#workouts > option[value="' + spartanWODId + '"]').attr('selected', 'selected');

}

function populateWODs(db) {

  sqlstr = "SELECT SPARTAN_WOD_ID, NAME FROM SPARTAN_WOD;";
  var rs = db.exec(sqlstr);

  $('#workouts').empty();
  $('#workouts').append($('<option value="new" selected="selected">-- Add new --</option>'));

  console.dir(rs);

  if (rs.length == 0) {
    return;
  }

  var selectValues = [];
  for (i = 0; i < rs[0]['values'].length; ++i) {
    var row = rs[0]['values'][i];
    console.dir(row);
    selectValues.push({'id': row[0], 'name': row[1]});
  }

  console.dir(selectValues);

  $.each(selectValues, function(i) {   

    console.log("i = " + i);
    console.log("ID = " + selectValues[i]['id']);
    console.log("name = " + selectValues[i]['name']);

    $('#workouts')
        .append($("<option></option>")
        .attr("value", selectValues[i]['id'])
        .text(selectValues[i]['name'])); 
  });
}

function initdb(db) {

  // Execute some sql
  var sqlstr = "DROP TABLE IF EXISTS EXERCISE_SET_JOIN; ";
  db.exec(sqlstr);

  sqlstr = "DROP TABLE IF EXISTS EXERCISE_SET; ";
  db.exec(sqlstr);

  sqlstr = "DROP TABLE IF EXISTS EXERCISE; ";
  db.exec(sqlstr);

  sqlstr = "DROP TABLE IF EXISTS SET_OF_SETS; ";
  db.exec(sqlstr);

  sqlstr = "CREATE TABLE SET_OF_SETS(SET_OF_SETS_ID INTEGER PRIMARY KEY ASC, "
         + "                         CATEGORY VARCHAR,"
         + "                         REPS_MIN INTEGER,"
         + "                         REPS_MAX INTEGER,"
         + "                         DURATION_MIN FLOAT,"
         + "                         DURATION_MAX FLOAT,"
         + "                         DIST_MIN FLOAT,"
         + "                         DIST_MAX FLOAT,"
         + "                         TYPE VARCHAR); ";

  db.exec(sqlstr);

  sqlstr = "CREATE TABLE SPARTAN_WOD(SPARTAN_WOD_ID INTEGER PRIMARY KEY ASC,"
         + "                         NAME VARCHAR,"
         + "                         CATEGORY VARCHAR,"
         + "                         QUOTE VARCHAR,"
         + "                         QUOTE_BY VARCHAR,"
         + "                         DESCRIPTION VARCHAR,"
         + "                         SPECIAL_DAY VARCHAR,"
         + "                         WARMUP_SET INTEGER,"
         + "                         MAIN_SET_SPRINT INTEGER,"
         + "                         MAIN_SET_SUPER INTEGER,"
         + "                         MAIN_SET_BEAST INTEGER,"
         + "                         MAIN_SET_TRIFECTA INTEGER,"
         + "                         COOLDOWN_SET INTEGER,"
         + "                         FOREIGN KEY(WARMUP_SET) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),"
         + "                         FOREIGN KEY(MAIN_SET_SPRINT) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),"
         + "                         FOREIGN KEY(MAIN_SET_SUPER) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),"
         + "                         FOREIGN KEY(MAIN_SET_BEAST) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),"
         + "                         FOREIGN KEY(MAIN_SET_TRIFECTA) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),"
         + "                         FOREIGN KEY(COOLDOWN_SET) REFERENCES SET_OF_SETS(SET_OF_SETS_ID)); ";

  db.exec(sqlstr);

  sqlstr = "CREATE TABLE EXERCISE(EXERCISE_ID INTEGER PRIMARY KEY ASC,"
         + "                      NAME VARCHAR,"
         + "                      CATEGORY VARCHAR,"
         + "                      DEMO_URL VARCHAR,"
         + "                      GENERAL_MUSCLE_GROUP VARCHAR,"
         + "                      TARGET_MUSCLE_GROUP VARCHAR,"
         + "                      LOC_INDOORS INTEGER,"
         + "                      LOC_OUTDOORS INTEGER,"
         + "                      EQ_JUMP_ROPE INTEGER,"
         + "                      EQ_PULLUP_BAR INTEGER,"
         + "                      EQ_WEIGHTS INTEGER,"
         + "                      EQ_KETTLE_BELLS INTEGER,"
         + "                      EQ_HEAVY_OBJECT INTEGER,"
         + "                      EQ_TRX INTEGER,"
         + "                      EQ_MED_BALL INTEGER,"
         + "                      EQ_BOX INTEGER,"
         + "                      EQ_SQUAT_RACK INTEGER,"
         + "                      EQ_TREADMILL INTEGER,"
         + "                      EQ_TRACK INTEGER,"
         + "                      EQ_TRAIL INTEGER,"
         + "                      EQ_HILLS INTEGER,"
         + "                      EQ_POOL INTEGER,"
         + "                      EQ_BIKE INTEGER,"
         + "                      EQ_ROW_MACHINE INTEGER,"
         + "                      EQ_ROPE INTEGER); ";

  db.exec(sqlstr);

  sqlstr = "CREATE TABLE EXERCISE_SET(EXERCISE_SET_ID INTEGER PRIMARY KEY ASC,"
         + "                          DIRECTION VARCHAR,"
         + "                          EXERCISE_ID INTEGER,"
         + "                          TYPE VARCHAR,"
         + "                          REPS_MIN INTEGER,"
         + "                          REPS_MAX INTEGER,"
         + "                          DURATION_MIN FLOAT,"
         + "                          DURATION_MAX FLOAT,"
         + "                          DIST_MIN FLOAT,"
         + "                          DIST_MAX FLOAT,"
         + "                          REST_DURATION_MIN INTEGER,"
         + "                          REST_DURATION_MAX INTEGER,"
         + "                          FOREIGN KEY(EXERCISE_ID) REFERENCES EXERCISE(EXERCISE_ID)); ";

  db.exec(sqlstr);

  sqlstr = "CREATE TABLE EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID INTEGER PRIMARY KEY ASC,"
         + "                               SET_OF_SETS_ID INTEGER,"
         + "                               EXERCISE_SET_ID INTEGER,"
         + "                               SET_ORDER INTEGER,"
         + "                               FOREIGN KEY(SET_OF_SETS_ID) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),"
         + "                               FOREIGN KEY(EXERCISE_SET_ID) REFERENCES EXERCISE_SET(EXERCISE_SET_ID)); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(1, 'arm curls', 'strength', 'https://www.youtube.com/watch?v=kwG2ipFRgfo', 'arms', 'biceps', 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(2,'back extension', 'strength', 'https://www.youtube.com/watch?v=Bw9YuQTTc58', 'back', 'back', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(3, 'bear crawl', 'athleticism', 'https://www.youtube.com/watch?v=WMXbyYpZ9oY', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);


  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(4, 'belly crawl', 'athleticism', 'https://www.youtube.com/watch?v=cLwS1xkOLas', 'upper body', 'upper body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(5, 'bodyweight circuit', 'strength', '', 'full body', 'full body', 2, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(6, 'bodyweight squat', 'strength', 'https://www.youtube.com/watch?v=p3g4wAsu0R4', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(7, 'box jump', 'strength', 'https://www.youtube.com/watch?v=hxldG9FX4j4', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(8, 'box jump burpee', 'athleticism', 'https://www.youtube.com/watch?v=kiOcwv7YE6c', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(9, 'brazilian ab twist', 'strength', 'https://www.youtube.com/watch?v=iUk5T87cf34', 'core', 'abs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(10, 'burpee', 'athleticism', 'https://www.youtube.com/watch?v=JZQA08SlJnM', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(11, 'burpee pull-up', 'strength', 'https://www.youtube.com/watch?v=kAvZoa5iexA', 'full body', 'full body', 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(12, 'chest pass', 'strength', 'https://www.youtube.com/watch?v=FUdcjZ0weic', 'upper body', 'chest', 2, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(13, 'chore', 'active rest', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(14, 'crunch', 'strength', 'https://www.youtube.com/watch?v=Xyd_fa5zoEU', 'core', 'abs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(15, 'curl', 'strength', 'https://www.youtube.com/watch?v=oUqgPSZmhro', 'arms', 'biceps', 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(16, 'cycling', 'endurance', '', 'legs', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(17, 'dog walking', 'active rest', '', 'legs', 'legs', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(18, 'double leg butt kicks', 'warmup', 'https://www.youtube.com/watch?v=F5iYMAkGaY8', 'legs', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(19, 'drop push-up', 'strength', 'https://www.youtube.com/watch?v=y9aAhXt2wYk', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(20, 'dynamic warm up', 'warmup', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(21, 'easy jog', 'warmup', 'https://www.youtube.com/watch?v=BgZdwy1FO4Y', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(22, 'explosive broad jump', 'athleticism', 'https://www.youtube.com/watch?v=ko22JMOkzQQ', 'lower body', 'lower body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(23, 'flutter kick', 'strength', 'https://www.youtube.com/watch?v=ANVdMDaYRts', 'core', 'abs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(24, 'glute kickback', 'athleticism', 'https://www.youtube.com/watch?v=h4439IQFAqI', 'lower body', 'glutes', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(25, 'handstand hold', 'strength', 'https://www.youtube.com/watch?v=h4439IQFAqI', 'upper body', 'shoulders', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(26, 'hanging knee raise', 'strength', 'https://www.youtube.com/watch?v=PGSKkNB1Oyk', 'core', 'abs', 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(27, 'high knee', 'warmup', 'https://www.youtube.com/watch?v=8opcQdC-V-U', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(28, 'hiking', 'active rest', '', 'full body', 'full body', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(29, 'hill interval', 'athleticism', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 1, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(30, 'inverted pull-up', 'strength', 'https://www.youtube.com/watch?v=lgsyUiB6occ', 'upper body', 'back', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(31, 'isometric lunge hold', 'strength', 'https://www.youtube.com/watch?v=u-bhL8zo570', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(32, 'isometric wiper', 'strength', 'https://www.youtube.com/watch?v=VxrSMH5vVWY', 'upper body', 'arms', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(33, 'jog', 'endurance', 'https://www.youtube.com/watch?v=VxrSMH5vVWY', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(34, 'jump rope', 'warmup', 'https://www.youtube.com/watch?v=GRStB06uhgE', 'full body', 'full body', 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(35, 'jumping jack', 'warmup', 'https://www.youtube.com/watch?v=c4DAnQ6DtF8', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(36, 'jumping lunge', 'athleticism', 'https://www.youtube.com/watch?v=Kw4QpPfX-cU', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(37, 'kettle bell 1-arm overhead farmer''s carry', 'strength', 'https://www.youtube.com/watch?v=uT1LV1eLcdM', 'upper body', 'upper body', 2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(38, 'kettle bell swing', 'strength', 'https://www.youtube.com/watch?v=OopKTfLiz48', 'lower body', 'hip flexors', 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(39, 'laying leg raise', 'athleticism', 'https://www.youtube.com/watch?v=xqTh6NqbAtM', 'lower body', 'hip flexors', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(40, 'run', 'endurance', 'https://www.youtube.com/watch?v=wCVSv7UxB2E', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(41, 'mountain climber', 'endurance', 'https://www.youtube.com/watch?v=nmwgirgXLYM', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(42, 'muscle-up', 'strength', 'https://youtu.be/ZEDY9QNBKe4', 'upper body', 'upper body', 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(43, 'pistol squat', 'strength', 'https://www.youtube.com/watch?v=7NvOuty_Fnc', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(44, 'plank', 'strength', 'https://www.youtube.com/watch?v=pSHjTRCQxIw', 'core', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(45, 'plyometric push-up', 'strength', 'https://www.youtube.com/watch?v=mgkyTtQ0ODE', 'upper body', 'upper body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(46, 'power skip', 'warmup', 'https://www.youtube.com/watch?v=NCY9gFsZk9Y', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(47, 'pull-up', 'warmup', 'https://www.youtube.com/watch?v=NCY9gFsZk9Y', 'upper body', 'upper body', 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(48, 'recover', 'rest', 'https://www.youtube.com/watch?v=NCY9gFsZk9Y', 'full body', 'full body', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(49, 'rope climb', 'rest', 'https://www.youtube.com/watch?v=AD0uO7JGdZU', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(50, 'row', 'endurance', '', 'full body', 'full body', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(51, 'sandbag/medicine ball slam', 'strength', 'https://www.youtube.com/watch?v=Y2wSD7spnxk', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(52, 'sandbag squat', 'strength', 'https://www.youtube.com/watch?v=U9yK6rHy40A', 'lower body', 'lower body', 2, 2, 0, 0, 2, 2, 2, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(53, 'sandbag squat throw', 'strength', 'https://www.youtube.com/watch?v=R-zLekvxzpg', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(54, 'shuttle run', 'strength', 'https://www.youtube.com/watch?v=Zcj_xdwLnNc', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(55, 'side kick', 'warmup', 'https://www.youtube.com/watch?v=MsmmbeXJ6Lw', 'lower body', 'lower body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(56, 'side plank', 'strength', 'https://www.youtube.com/watch?v=6cRAFji80CQ', 'core', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(57, 'side-to-side hop', 'athleticism', 'https://www.youtube.com/watch?v=_AVX9cpPzks', 'core', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(58, 'sit-up', 'strength', 'https://www.youtube.com/watch?v=1fbU_MkV7NE', 'core', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(59, 'speed skater', 'athleticism', 'https://www.youtube.com/watch?v=EkESodXYDRM', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(60, 'spiderman push-up', 'strength', 'https://www.youtube.com/watch?v=fKBeHALPsSU', 'upper body', 'upper body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(61, 'squat jump', 'strength', 'https://www.youtube.com/watch?v=DeTBwEL4m7s', 'lower body', 'lower body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(62, 'star jump', 'athleticism', 'https://www.youtube.com/watch?v=h6wu4_LOhyU', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(63, 'stretch', 'cooldown', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(64, 'swimming', 'endurance', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(65, 'trail run', 'endurance', '', 'full body', 'full body', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(66, 'tricep overhead extension', 'strength', 'https://www.youtube.com/watch?v=YbX7Wd8jQ-Q', 'upper body', 'triceps', 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(67, 'uphill dash', 'athleticism', '', 'full body', 'full body', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(68, 'vertical jump', 'athleticism', 'https://www.youtube.com/watch?v=K9zzVwMyD1g', 'lower body', 'lower body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(69, 'walk', 'active rest', '', 'lower body', 'lower body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(70, 'walking lunge', 'strength', 'https://www.youtube.com/watch?v=L8fvypPrzzs', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(71, 'wide push-up', 'strength', 'https://www.youtube.com/watch?v=B78GwfC-87Y', 'upper body', 'chest', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE) VALUES(72, 'yoga', 'active recovery', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0); ";
  
  db.exec(sqlstr);
}
