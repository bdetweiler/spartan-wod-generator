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

  populateExercises(db)
  
  // db.close();
  //stmt.free();
  // You can not use your statement anymore once it has been freed.
  // But not freeing your statements causes memory leaks. You don't want that.

  // Export the database to an Uint8Array containing the SQLite database file
  //var binaryArray = db.export();

  $('#add_wod').click(function() {
    addWOD(db);
  });

  $('#export_db').click(function() {
    exportdb(db);
  });

  $('#close_db').click(function() {
    db.close();
  });

  $('#workouts').change(function() {
    populateWorkout(db);
    populateSetOfSets(db);
  });

  $('#copy_sprint_set').click(function() {
    copySprintExerciseSet();
  });

  $('#warmup_sets_added').delegate("a", "click", function() {
    console.dir($(this));
    var exerciseSetJoinId = $(this).attr('id');

    deleteExerciseSetJoin(exerciseSetJoinId, db);
  });

  $('#sprint_sets_added').delegate("a", "click", function() {
    console.dir($(this));
    var exerciseSetJoinId = $(this).attr('id');

    deleteExerciseSetJoin(exerciseSetJoinId, db);
  });

  $('#super_sets_added').delegate("a", "click", function() {
    console.dir($(this));
    var exerciseSetJoinId = $(this).attr('id');

    deleteExerciseSetJoin(exerciseSetJoinId, db);
  });

  $('#beast_sets_added').delegate("a", "click", function() {
    console.dir($(this));
    var exerciseSetJoinId = $(this).attr('id');

    deleteExerciseSetJoin(exerciseSetJoinId, db);
  });

  $('#trifecta_sets_added').delegate("a", "click", function() {
    console.dir($(this));
    var exerciseSetJoinId = $(this).attr('id');

    deleteExerciseSetJoin(exerciseSetJoinId, db);
  });

  $('#cooldown_sets_added').delegate("a", "click", function() {
    console.dir($(this));
    var exerciseSetJoinId = $(this).attr('id');

    deleteExerciseSetJoin(exerciseSetJoinId, db);
  });

  $('#all_sets').click(function() {
    toggleAllSets();
  });

  $('#exercise').change(function() {
    var units = $('#exercise > option:selected').attr('units');

    if (units === 'minutes') {
      $('#exercise_reps_min').prop('disabled', true);
      $('#exercise_reps_min').val('');
      $('#exercise_reps_max').prop('disabled', true);
      $('#exercise_reps_max').val('');

      $('#exercise_duration_min').prop('disabled', false);
      $('#exercise_duration_max').prop('disabled', false);

      $('#exercise_distance_min').prop('disabled', true);
      $('#exercise_distance_min').val('');
      $('#exercise_distance_max').prop('disabled', true);
      $('#exercise_distance_max').val('');
    } else if (units === 'reps') {
      $('#exercise_reps_min').prop('disabled', false);
      $('#exercise_reps_max').prop('disabled', false);

      $('#exercise_duration_min').prop('disabled', true);
      $('#exercise_duration_min').val('');
      $('#exercise_duration_max').prop('disabled', true);
      $('#exercise_duration_max').val('');

      $('#exercise_distance_min').prop('disabled', true);
      $('#exercise_distance_min').val('');
      $('#exercise_distance_max').prop('disabled', true);
      $('#exercise_distance_max').val('');
    } else if (units === 'miles') {
      $('#exercise_reps_min').prop('disabled', true);
      $('#exercise_reps_min').val('');
      $('#exercise_reps_max').prop('disabled', true);
      $('#exercise_reps_max').val('');

      $('#exercise_duration_min').prop('disabled', true);
      $('#exercise_duration_min').val('');
      $('#exercise_duration_max').prop('disabled', true);
      $('#exercise_duration_max').val('');

      $('#exercise_distance_min').prop('disabled', false);
      $('#exercise_distance_max').prop('disabled', false);
    }

  });

  $('#add_set').click(function() {
    insertSet(db);
  });

  $('#save_warmup_set').click(function() {
    saveSetOfSets('warmup', db);
  });

  $('#save_sprint_set').click(function() {
    saveSetOfSets('sprint', db);
  });

  $('#save_super_set').click(function() {
    saveSetOfSets('super', db);
  });

  $('#save_beast_set').click(function() {
    saveSetOfSets('beast', db);
  });

  $('#save_trifecta_set').click(function() {
    saveSetOfSets('trifecta', db);
  });
  
  $('#save_cooldown_set').click(function() {
    saveSetOfSets('cooldown', db);
  });

  $('#add_warmup_set').click(function() {
    addSet('warmup', db);
  });

  $('#add_sprint_set').click(function() {
    addSet('sprint', db);
  });

  $('#add_super_set').click(function() {
    addSet('super', db);
  });

  $('#add_beast_set').click(function() {
    addSet('beast', db);
  });

  $('#add_trifecta_set').click(function() {
    addSet('trifecta', db);
  });

  $('#add_cooldown_set').click(function() {
    addSet('cooldown', db);
  });

  populateWODs(db);
  populateSets(db);

});

function populateExercises(db) {
  sqlstr = "SELECT EXERCISE_ID, NAME, CALORIES, CALORIES_MEASURED_IN FROM EXERCISE;";

  // Prepare an sql statement
  var rs = db.exec(sqlstr);
  console.dir(rs[0]['values']);
  for (i = 0; i < rs[0]['values'].length; ++i) {
    // var exerciseId = 

    $('#exercise')
        .append($("<option></option>")
        .attr("value", rs[0]['values'][i][0])
        .attr("calories", rs[0]['values'][i][2])
        .attr("units", rs[0]['values'][i][3])
        .text(rs[0]['values'][i][1])); 
  }
}

function deleteExerciseSetJoin(exerciseSetJoinId, db) {
    
  var sqlstr = "DELETE FROM EXERCISE_SET_JOIN "
             + " WHERE EXERCISE_SET_JOIN_ID = " + exerciseSetJoinId + "; ";

  var rs = db.exec(sqlstr);

  populateSetOfSets(db);
}

function saveSetOfSets(setType, db) {

  var setCategory = setType;

  var repsMin = parseFloat($('#' + setType + '_reps_min').val());
  var repsMax = parseFloat($('#' + setType + '_reps_max').val());

  var durationMin = parseFloat($('#' + setType + '_duration_min').val());
  var durationMax = parseFloat($('#' + setType + '_duration_max').val());

  var distanceMin = parseFloat($('#' + setType + '_distance_min').val());
  var distanceMax = parseFloat($('#' + setType + '_distance_max').val());

  var restMin = parseFloat($('#' + setType + '_rest_min').val());
  var restMax = parseFloat($('#' + setType + '_rest_max').val());

  if (isNaN(repsMin)) {
    repsMin = 'null';
  }
  if (isNaN(repsMax)) {
    repsMax = 'null';
  }

  if (isNaN(durationMin)) {
    durationMin = 'null';
  }
  if (isNaN(durationMax)) {
    durationMax = 'null';
  }

  if (isNaN(distanceMin)) {
    distanceMin = 'null';
  }
  if (isNaN(distanceMax)) {
    distanceMax = 'null';
  }

  if (isNaN(restMin)) { 
    restMin = 'null';
  }

  if (isNaN(restMax)){
    restMax = 'null';
  }

  var setCalories = 0;

  // First see if the set exists
  
  var spartanWODId = $('#workouts > option:selected').attr('value'); 
 
  if (setType === 'warmup') {
    sqlstr = "SELECT * "
           + "  FROM SET_OF_SETS"
           + " WHERE SET_OF_SETS_ID IN (SELECT WARMUP_SET"
           + "                            FROM SPARTAN_WOD"
           + "                           WHERE SPARTAN_WOD_ID = " + spartanWODId + ");";
  } else if (setType === 'cooldown') { 
    sqlstr = "SELECT * "
           + "  FROM SET_OF_SETS"
           + " WHERE SET_OF_SETS_ID IN (SELECT COOLDOWN_SET"
           + "                            FROM SPARTAN_WOD"
           + "                           WHERE SPARTAN_WOD_ID = " + spartanWODId + ");";
  } else {
    sqlstr = "SELECT * "
           + "  FROM SET_OF_SETS"
           + " WHERE SET_OF_SETS_ID IN (SELECT MAIN_SET_" + setType.toUpperCase()
           + "                            FROM SPARTAN_WOD"
           + "                           WHERE SPARTAN_WOD_ID = " + spartanWODId + ");";
  }

  var rs = db.exec(sqlstr);

  if (rs.length == 0) {

    // If there's no set of this type for this WOD, get the max ID so we can add one
    sqlstr = "SELECT MAX(SET_OF_SETS_ID) FROM SET_OF_SETS";
    rs = db.exec(sqlstr);
    
    var setOfSetsId = 1;

    if (rs[0]['values'][0][0] != null) {
      setOfSetsId = rs[0]['values'][0][0];
      setOfSetsId++;
    }

    // insert Set of sets
    sqlstr = "INSERT INTO SET_OF_SETS(SET_OF_SETS_ID, "
           + "                        CATEGORY, "
           + "                        REPS_MIN, "
           + "                        REPS_MAX, "
           + "                        DURATION_MIN, "
           + "                        DURATION_MAX, "
           + "                        DIST_MIN, "
           + "                        DIST_MAX, "
           + "                        REST_DURATION_MIN, "
           + "                        REST_DURATION_MAX, "
           + "                        TYPE, "
           + "                        CALORIES) "
           + "                  VALUES(" + setOfSetsId + ", "
           + "                         '" + setCategory + "', "
           + "                         " + repsMin + ", "
           + "                         " + repsMax + ", "
           + "                         " + durationMin + ", "
           + "                         " + durationMax + ", "
           + "                         " + distanceMin + ", "
           + "                         " + distanceMax + ", "
           + "                         " + restMin + ", "
           + "                         " + restMax + ", "
           + "                         '" + setType + "', "
           + "                         " + setCalories + "); "

    rs = db.exec(sqlstr);

    // insert Set of sets
    if (setType === 'warmup') {
      sqlstr = "UPDATE SPARTAN_WOD"
             + "   SET WARMUP_SET = " + setOfSetsId + " "
             + " WHERE SPARTAN_WOD_ID = " + spartanWODId + ";";
    } else if (setType === 'cooldown') { 
      sqlstr = "UPDATE SPARTAN_WOD"
             + "   SET COOLDOWN_SET = " + setOfSetsId + " "
             + " WHERE SPARTAN_WOD_ID = " + spartanWODId + ";";
    } else {
      sqlstr = "UPDATE SPARTAN_WOD"
             + "   SET MAIN_SET_" + setType + ' = ' + setOfSetsId + " "
             + " WHERE SPARTAN_WOD_ID = " + spartanWODId + ";";
    }

    console.dir(sqlstr);

    rs = db.exec(sqlstr);

  } else {
    var setOfSetsId = rs[0]['values'][0][0];

    // insert Set of sets
    sqlstr = "UPDATE SET_OF_SETS "
           + "   SET CATEGORY = '" + setCategory + "', "
           + "       REPS_MIN = " + repsMin + ", "
           + "       REPS_MAX = " + repsMax + ", "
           + "       DURATION_MIN = " + durationMin + ", "
           + "       DURATION_MAX = " + durationMax + ", "
           + "       DIST_MIN = " + distanceMin + ", "
           + "       DIST_MAX = " + distanceMax + ", " 
           + "       REST_DURATION_MIN = " + restMin + ", "
           + "       REST_DURATION_MAX = " + restMax + ", "
           + "       TYPE = '" + setType + "', "
           + "       CALORIES = " + setCalories + " "
           + " WHERE SET_OF_SETS_ID = " + setOfSetsId + ";"

    rs = db.exec(sqlstr);
  }

}


function insertSet(db) {
  var exerciseSetId = $('#sets > option:selected').attr('id'); 

  var exerciseId = $('#exercise > option:selected').val(); 
  var exerciseCalories = $('#exercise > option:selected').attr('calories'); 
  var exerciseUnits = $('#exercise > option:selected').attr('units'); 
  var exerciseDirection = $('#exercise_direction > option:selected').attr('id'); 

  var repsMin = parseFloat($('#exercise_reps_min').val());
  var repsMax = parseFloat($('#exercise_reps_max').val());

  var durationMin = parseFloat($('#exercise_duration_min').val());
  var durationMax = parseFloat($('#exercise_duration_max').val());

  var distanceMin = parseFloat($('#exercise_distance_min').val());
  var distanceMax = parseFloat($('#exercise_distance_max').val());

  var restMin = parseFloat($('#exercise_rest_min').val());
  var restMax = parseFloat($('#exercise_rest_max').val());

  if (exerciseUnits === 'reps') {
    durationMin = 'null';
    durationMax = 'null';
    distanceMin = 'null';
    distanceMax = 'null';
  } else if (exerciseUnits === 'distance') {
    durationMin = 'null';
    durationMax = 'null';
    repsMin = 'null';
    repsMax = 'null';
  } else if (exerciseUnits === 'duration') {
    distanceMin = 'null';
    distanceMax = 'null';
    repsMin = 'null';
    repsMax = 'null';
  }

  if (isNaN(repsMin)) {
    repsMin = 'null';
  }
  if (isNaN(repsMax)) {
    repsMax = 'null';
  }

  if (isNaN(durationMin)) {
    durationMin = 'null';
  }
  if (isNaN(durationMax)) {
    durationMax = 'null';
  }

  if (isNaN(distanceMin)) {
    distanceMin = 'null';
  }
  if (isNaN(distanceMax)) {
    distanceMax = 'null';
  }


  if (isNaN(restMin)) { 
    restMin = 'null';
  }

  if (isNaN(restMax)){
    restMax = 'null';
  }

  var warmupSet = $('#warmup_set').prop('checked');
  var sprintSet = $('#sprint_set').prop('checked');
  var superSet = $('#super_set').prop('checked');
  var beastSet = $('#beast_set').prop('checked');
  var trifectaSet = $('#trifecta_set').prop('checked');
  var cooldownSet = $('#cooldown_set').prop('checked');

  var setCalories = 0;

  if (exerciseUnits === 'reps') {
    var repsAvg = ((repsMin + repsMax) / 2);
    console.log(repsAvg);
    console.log(exerciseCalories);
    setCalories = repsAvg * exerciseCalories;
    console.log(setCalories);
  } else if (exerciseUnits === 'minutes') {
    setCalories = ((durationMin + durationMax) / 2) * exerciseCalories;
  } else if (exerciseUnits === 'miles') {
    setCalories = ((distanceMin + distanceMax) / 2) * exerciseCalories;
  }

  //             0,         1,         2,        3,        4,           5 
  var setTypeArr = [warmupSet, sprintSet, superSet, beastSet, trifectaSet, cooldownSet];

  for (i = 0; i < setTypeArr.length; ++i) {
    
    // If it's not one of these, skip insert/update
    if (!setTypeArr[i]) {
      continue;
    }

    var setType = '';
    if (i == 0) {
      setType = 'warmup';
    } else if (i == 1) {
      setType = 'sprint';
    } else if (i == 2) {
      setType = 'super';
    } else if (i == 3) {
      setType = 'beast';
    } else if (i == 4) {
      setType = 'trifecta';
    } else if (i == 5) {
      setType = 'cooldown';
    }

    console.log(setType);
    var sqlstr = "";
    if (exerciseSetId === 'new') {
    
      sqlstr = "SELECT MAX(EXERCISE_SET_ID) FROM EXERCISE_SET;";
      var rs = db.exec(sqlstr);
    
      var exerciseSetId = 1;

      if (rs[0]['values'][0][0] != null) {
        exerciseSetId = rs[0]['values'][0][0];
        exerciseSetId++;
      }


      // insert WOD
      sqlstr = "INSERT INTO EXERCISE_SET(EXERCISE_SET_ID, "
             + "                         DIRECTION, "
             + "                         EXERCISE_ID, "
             + "                         TYPE, "
             + "                         REPS_MIN, "
             + "                         REPS_MAX, "
             + "                         DURATION_MIN, "
             + "                         DURATION_MAX, "
             + "                         DIST_MIN, "
             + "                         DIST_MAX, "
             + "                         REST_DURATION_MIN, "
             + "                         REST_DURATION_MAX, "
             + "                         CALORIES) "
             + "                  VALUES(" + exerciseSetId + ", "
             + "                         '" + exerciseDirection + "', "
             + "                         " + exerciseId + ", "
             + "                         '" + setType + "', "
             + "                         " + repsMin + ", "
             + "                         " + repsMax + ", "
             + "                         " + durationMin + ", "
             + "                         " + durationMax + ", "
             + "                         " + distanceMin + ", "
             + "                         " + distanceMax + ", "
             + "                         " + restMin + ", "
             + "                         " + restMax + ", "
             + "                         " + setCalories + "); "

      exerciseSetId = 'new';
    } else {
      // update
      sqlstr = "UPDATE  EXERCISE_SET"
             + "   SET  DIRECTION = '" + exerciseDirection + "', "
             + "        EXERCISE_ID = " + exerciseId + ", "
             + "        TYPE = '" + setType + "', "
             + "        REPS_MIN = " + repsMin + ", "
             + "        REPS_MAX = " + repsMax + ", "
             + "        DURATION_MIN = " + durationMin + ", "
             + "        DURATION_MAX = " + durationMax + ", "
             + "        DIST_MIN = " + distanceMin + ", " 
             + "        DIST_MAX = " + distanceMax + ", "
             + "        REST_DURATION_MIN = " + restMin + ", "
             + "        REST_DURATION_MAX = " + restMax + ", "
             + "        CALORIES = " + setCalories + " "
             + " WHERE EXERCISE_SET_ID = " + exerciseSetId + "; "
    }

    console.log(sqlstr);
    db.exec(sqlstr);

  }


  
  sqlstr = "SELECT * FROM EXERCISE_SET;"

  var rs = db.exec(sqlstr);
  console.dir(rs);
  populateSets(db);

  // Select Workout from the dropdown
  // $('#workouts > option[value="' + spartanWODId + '"]').attr('selected', 'selected');

}

function populateSets(db) {

  $('#sets').empty();
  $('#sets').append($('<option value="new" id="new">-- Select a set --</option>'));


  $('#warmup_sets').empty();
  $('#warmup_sets').append($('<option value="new" id="new">-- Select a set --</option>'));

  $('#sprint_sets').empty();
  $('#sprint_sets').append($('<option value="new" id="new">-- Select a set --</option>'));

  $('#super_sets').empty();
  $('#super_sets').append($('<option value="new" id="new">-- Select a set --</option>'));

  $('#beast_sets').empty();
  $('#beast_sets').append($('<option value="new" id="new">-- Select a set --</option>'));

  $('#trifecta_sets').empty();
  $('#trifecta_sets').append($('<option value="new" id="new">-- Select a set --</option>'));

  $('#cooldown_sets').empty();
  $('#cooldown_sets').append($('<option value="new" id="new">-- Select a set --</option>'));

  // get all sets
  sqlstr = "SELECT es.EXERCISE_SET_ID,"
         + "       es.REPS_MIN, "
         + "       es.REPS_MAX, "
         + "       es.DURATION_MIN, "
         + "       es.DURATION_MAX, "
         + "       es.DIST_MIN, "
         + "       es.DIST_MAX, "
         + "       es.REST_DURATION_MIN, "
         + "       es.REST_DURATION_MAX, "
         + "       e.NAME,"
         + "       es.TYPE"
         + "  FROM EXERCISE_SET es,"
         + "       EXERCISE e"
         + " WHERE es.EXERCISE_ID = e.EXERCISE_ID;";

  // Prepare an sql statement
  var rs = db.exec(sqlstr);
  console.dir(rs[0]['values']);
  for (i = 0; i < rs[0]['values'].length; ++i) {
    // var exerciseId = 
    
    var setDesc = rs[0]['values'][i][9] + " [";

    console.log(rs[0]['values'][i][1]);

    if (rs[0]['values'][i][1] != null) {
      setDesc += rs[0]['values'][i][1] + "/" + rs[0]['values'][i][2] + "rep ";
    }

    if (rs[0]['values'][i][3] != null) {
      setDesc += rs[0]['values'][i][3] + "/" + rs[0]['values'][i][4] + "min ";
    }

    if (rs[0]['values'][i][5] != null) {
      setDesc += rs[0]['values'][i][5] + "/" + rs[0]['values'][i][6] + "mi ";
    }

    if (rs[0]['values'][i][7] != null) {
      setDesc += rs[0]['values'][i][7] + "/" + rs[0]['values'][i][8] + "rst";
    }

    setDesc += "]";

    console.log(setDesc);

    var setType = rs[0]['values'][i][10];
    
    $('#sets').append($('<option value="' + rs[0]['values'][i][0] + '" id="' + rs[0]['values'][i][0] + '">' + setDesc + ' ' + setType + '</option>'));

    $('#' + setType + '_sets').append($('<option value="' + rs[0]['values'][i][0] + '" id="' + rs[0]['values'][i][0] + '">' + setDesc + '</option>'));
  }
}

function populateSetOfSets(db) {

  $('#warmup_reps_min').val('');
  $('#sprint_reps_min').val('');
  $('#super_reps_min').val('');
  $('#beast_reps_min').val('');
  $('#cooldown_reps_min').val('');

  $('#warmup_reps_max').val('');
  $('#sprint_reps_max').val('');
  $('#super_reps_max').val('');
  $('#beast_reps_max').val('');
  $('#cooldown_reps_max').val('');

  $('#warmup_duration_min').val('');
  $('#sprint_duration_min').val('');
  $('#super_duration_min').val('');
  $('#beast_duration_min').val('');
  $('#cooldown_duration_min').val('');

  $('#warmup_duration_max').val('');
  $('#sprint_duration_max').val('');
  $('#super_duration_max').val('');
  $('#beast_duration_max').val('');
  $('#cooldown_duration_max').val('');

  $('#warmup_distance_min').val('');
  $('#sprint_distance_min').val('');
  $('#super_distance_min').val('');
  $('#beast_distance_min').val('');
  $('#cooldown_distance_min').val('');

  $('#warmup_distance_max').val('');
  $('#sprint_distance_max').val('');
  $('#super_distance_max').val('');
  $('#beast_distance_max').val('');
  $('#cooldown_distance_max').val('');

  $('#warmup_rest_min').val('');
  $('#sprint_rest_min').val('');
  $('#super_rest_min').val('');
  $('#beast_rest_min').val('');
  $('#cooldown_rest_min').val('');

  $('#warmup_rest_max').val('');
  $('#sprint_rest_max').val('');
  $('#super_rest_max').val('');
  $('#beast_rest_max').val('');
  $('#cooldown_rest_max').val('');

  $('#warmup_sets_added').empty();
  $('#sprint_sets_added').empty();
  $('#super_sets_added').empty();
  $('#beast_sets_added').empty();
  $('#trifecta_sets_added').empty();
  $('#cooldown_sets_added').empty();

  var spartanWODId = $('#workouts > option:selected').attr('value');

  if (spartanWODId === 'new') {
    return;
  }

  // get all sets
  sqlstr = "SELECT WARMUP_SET, "
         + "       MAIN_SET_SPRINT, "
         + "       MAIN_SET_SUPER, "
         + "       MAIN_SET_BEAST, "
         + "       MAIN_SET_TRIFECTA, "
         + "       COOLDOWN_SET "
         + "  FROM SPARTAN_WOD "
         + " WHERE SPARTAN_WOD_ID = " + spartanWODId + ";";


  // Prepare an sql statement
  var rs = db.exec(sqlstr);

  var warmupSetId = rs[0]['values'][0][0];
  var sprintSetId = rs[0]['values'][0][1];
  var superSetId = rs[0]['values'][0][2];
  var beastSetId = rs[0]['values'][0][3];
  var trifectaSetId = rs[0]['values'][0][4];
  var cooldownSetId = rs[0]['values'][0][5];
 
  if (warmupSetId !== null) {
    
    // get all sets
    sqlstr = "SELECT REPS_MIN, "
           + "       REPS_MAX, "
           + "       DURATION_MIN, "
           + "       DURATION_MAX, "
           + "       DIST_MIN, "
           + "       DIST_MAX, "
           + "       REST_DURATION_MIN, " 
           + "       REST_DURATION_MAX  "
           + "  FROM SET_OF_SETS "
           + " WHERE SET_OF_SETS_ID = " + warmupSetId + ";";

    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    if (rs[0]['values'][0][0] !== null) {
      $('#warmup_reps_min').val(rs[0]['values'][0][0]);
    }
    if (rs[0]['values'][0][1] !== null) {
      $('#warmup_reps_max').val(rs[0]['values'][0][1]);
    }
    if (rs[0]['values'][0][2] !== null) {
      $('#warmup_duration_min').val(rs[0]['values'][0][2]);
    }
    if (rs[0]['values'][0][3] !== null) {
      $('#warmup_duration_max').val(rs[0]['values'][0][3]);
    }
    if (rs[0]['values'][0][4] !== null) {
      $('#warmup_dist_min').val(rs[0]['values'][0][4]);
    }
    if (rs[0]['values'][0][5] !== null) {
      $('#warmup_dist_max').val(rs[0]['values'][0][5]);
    }
    if (rs[0]['values'][0][6] !== null) {
      $('#warmup_rest_min').val(rs[0]['values'][0][6]);
    }
    if (rs[0]['values'][0][7] !== null) {
      $('#warmup_rest_max').val(rs[0]['values'][0][7]);
    }

    sqlstr = "SELECT esj.SET_ORDER, "
           + "       e.NAME, "
           + "       es.DIRECTION, "
           + "       es.REPS_MIN, "
           + "       es.REPS_MAX, "
           + "       es.DURATION_MIN, "
           + "       es.DURATION_MAX, "
           + "       es.DIST_MIN, "
           + "       es.DIST_MAX, "
           + "       es.REST_DURATION_MIN, "
           + "       es.REST_DURATION_MAX, "
           + "       esj.EXERCISE_SET_JOIN_ID "
           + "  FROM EXERCISE_SET_JOIN esj, "
           + "       EXERCISE_SET es, "
           + "       EXERCISE e "
           + " WHERE esj.SET_OF_SETS_ID = " + warmupSetId + " "
           + "   AND esj.EXERCISE_SET_ID = es.EXERCISE_SET_ID "
           + "   AND es.EXERCISE_ID = e.EXERCISE_ID "
           + " ORDER BY esj.SET_ORDER;";

    var rs = db.exec(sqlstr);

    try {
      for (i = 0; i < rs[0]['values'].length; ++i) {
        
        var descStr = '';

        if (rs[0]['values'][i][1] !== null) {
          descStr += rs[0]['values'][i][1];
        }

        if (rs[0]['values'][i][2] !== null) {
          descStr += '-' + rs[0]['values'][i][2];
        }

        descStr += ' [';

        if (rs[0]['values'][i][3] !== null) {
          descStr += ' ' + rs[0]['values'][i][3] + '/' + rs[0]['values'][i][4] + 'rps';
        }

        if (rs[0]['values'][i][5] !== null) {
          descStr += ' ' + rs[0]['values'][i][5] + '/' + rs[0]['values'][i][6] + 'min';
        }

        if (rs[0]['values'][i][7] !== null) {
          descStr += ' ' + rs[0]['values'][i][7] + '/' + rs[0]['values'][i][8] + 'mi';
        }

        if (rs[0]['values'][i][9] !== null) {
          descStr += ' ' + rs[0]['values'][i][9] + '/' + rs[0]['values'][i][10] + 'rst';
        }

        descStr += ']';

        $('#warmup_sets_added').append(descStr + '<a class="delete_exercise_set_join" href="#" id="' + rs[0]['values'][i][11] + '">X</a><br />')
      }
    } catch (e) {
      ;;;
    }
  }

  if (sprintSetId !== null) {
    
    // get all sets
    sqlstr = "SELECT REPS_MIN, "
           + "       REPS_MAX, "
           + "       DURATION_MIN, "
           + "       DURATION_MAX, "
           + "       DIST_MIN, "
           + "       DIST_MAX, "
           + "       REST_DURATION_MIN, " 
           + "       REST_DURATION_MAX  "
           + "  FROM SET_OF_SETS "
           + " WHERE SET_OF_SETS_ID = " + sprintSetId + ";";

    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    if (rs[0]['values'][0][0] !== null) {
      $('#sprint_reps_min').val(rs[0]['values'][0][0]);
    }
    if (rs[0]['values'][0][1] !== null) {
      $('#sprint_reps_max').val(rs[0]['values'][0][1]);
    }
    if (rs[0]['values'][0][2] !== null) {
      $('#sprint_duration_min').val(rs[0]['values'][0][2]);
    }
    if (rs[0]['values'][0][3] !== null) {
      $('#sprint_duration_max').val(rs[0]['values'][0][3]);
    }
    if (rs[0]['values'][0][4] !== null) {
      $('#sprint_dist_min').val(rs[0]['values'][0][4]);
    }
    if (rs[0]['values'][0][5] !== null) {
      $('#sprint_dist_max').val(rs[0]['values'][0][5]);
    }
    if (rs[0]['values'][0][6] !== null) {
      $('#sprint_rest_min').val(rs[0]['values'][0][6]);
    }
    if (rs[0]['values'][0][7] !== null) {
      $('#sprint_rest_max').val(rs[0]['values'][0][7]);
    }

    sqlstr = "SELECT esj.SET_ORDER, "
           + "       e.NAME, "
           + "       es.DIRECTION, "
           + "       es.REPS_MIN, "
           + "       es.REPS_MAX, "
           + "       es.DURATION_MIN, "
           + "       es.DURATION_MAX, "
           + "       es.DIST_MIN, "
           + "       es.DIST_MAX, "
           + "       es.REST_DURATION_MIN, "
           + "       es.REST_DURATION_MAX, "
           + "       esj.EXERCISE_SET_JOIN_ID "
           + "  FROM EXERCISE_SET_JOIN esj, "
           + "       EXERCISE_SET es, "
           + "       EXERCISE e "
           + " WHERE esj.SET_OF_SETS_ID = " + sprintSetId + " "
           + "   AND esj.EXERCISE_SET_ID = es.EXERCISE_SET_ID "
           + "   AND es.EXERCISE_ID = e.EXERCISE_ID "
           + " ORDER BY esj.SET_ORDER;";

    var rs = db.exec(sqlstr);

    try {
      for (i = 0; i < rs[0]['values'].length; ++i) {
        
        var descStr = '';

        if (rs[0]['values'][i][1] !== null) {
          descStr += rs[0]['values'][i][1];
        }

        if (rs[0]['values'][i][2] !== null) {
          descStr += '-' + rs[0]['values'][i][2];
        }

        descStr += ' [';

        if (rs[0]['values'][i][3] !== null) {
          descStr += ' ' + rs[0]['values'][i][3] + '/' + rs[0]['values'][i][4] + 'rps';
        }

        if (rs[0]['values'][i][5] !== null) {
          descStr += ' ' + rs[0]['values'][i][5] + '/' + rs[0]['values'][i][6] + 'min';
        }

        if (rs[0]['values'][i][7] !== null) {
          descStr += ' ' + rs[0]['values'][i][7] + '/' + rs[0]['values'][i][8] + 'mi';
        }

        if (rs[0]['values'][i][9] !== null) {
          descStr += ' ' + rs[0]['values'][i][9] + '/' + rs[0]['values'][i][10] + 'rst';
        }

        descStr += ']';
        
        $('#sprint_sets_added').append(descStr + '<a class="delete_exercise_set_join" href="#" id="' + rs[0]['values'][i][11] + '">X</a><br />')
      }
    } catch (e) {
      ;;;
    }
  }

  if (superSetId !== null) {
    
    // get all sets
    sqlstr = "SELECT REPS_MIN, "
           + "       REPS_MAX, "
           + "       DURATION_MIN, "
           + "       DURATION_MAX, "
           + "       DIST_MIN, "
           + "       DIST_MAX, "
           + "       REST_DURATION_MIN, " 
           + "       REST_DURATION_MAX  "
           + "  FROM SET_OF_SETS "
           + " WHERE SET_OF_SETS_ID = " + superSetId + ";";

    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    if (rs[0]['values'][0][0] !== null) {
      $('#super_reps_min').val(rs[0]['values'][0][0]);
    }
    if (rs[0]['values'][0][1] !== null) {
      $('#super_reps_max').val(rs[0]['values'][0][1]);
    }
    if (rs[0]['values'][0][2] !== null) {
      $('#super_duration_min').val(rs[0]['values'][0][2]);
    }
    if (rs[0]['values'][0][3] !== null) {
      $('#super_duration_max').val(rs[0]['values'][0][3]);
    }
    if (rs[0]['values'][0][4] !== null) {
      $('#super_dist_min').val(rs[0]['values'][0][4]);
    }
    if (rs[0]['values'][0][5] !== null) {
      $('#super_dist_max').val(rs[0]['values'][0][5]);
    }
    if (rs[0]['values'][0][6] !== null) {
      $('#super_rest_min').val(rs[0]['values'][0][6]);
    }
    if (rs[0]['values'][0][7] !== null) {
      $('#super_rest_max').val(rs[0]['values'][0][7]);
    }

    sqlstr = "SELECT esj.SET_ORDER, "
           + "       e.NAME, "
           + "       es.DIRECTION, "
           + "       es.REPS_MIN, "
           + "       es.REPS_MAX, "
           + "       es.DURATION_MIN, "
           + "       es.DURATION_MAX, "
           + "       es.DIST_MIN, "
           + "       es.DIST_MAX, "
           + "       es.REST_DURATION_MIN, "
           + "       es.REST_DURATION_MAX, "
           + "       esj.EXERCISE_SET_JOIN_ID "
           + "  FROM EXERCISE_SET_JOIN esj, "
           + "       EXERCISE_SET es, "
           + "       EXERCISE e "
           + " WHERE esj.SET_OF_SETS_ID = " + superSetId + " "
           + "   AND esj.EXERCISE_SET_ID = es.EXERCISE_SET_ID "
           + "   AND es.EXERCISE_ID = e.EXERCISE_ID "
           + " ORDER BY esj.SET_ORDER;";

    var rs = db.exec(sqlstr);

    try {
      for (i = 0; i < rs[0]['values'].length; ++i) {
        
        var descStr = '';

        if (rs[0]['values'][i][1] !== null) {
          descStr += rs[0]['values'][i][1];
        }

        if (rs[0]['values'][i][2] !== null) {
          descStr += '-' + rs[0]['values'][i][2];
        }

        descStr += ' [';

        if (rs[0]['values'][i][3] !== null) {
          descStr += ' ' + rs[0]['values'][i][3] + '/' + rs[0]['values'][i][4] + 'rps';
        }

        if (rs[0]['values'][i][5] !== null) {
          descStr += ' ' + rs[0]['values'][i][5] + '/' + rs[0]['values'][i][6] + 'min';
        }

        if (rs[0]['values'][i][7] !== null) {
          descStr += ' ' + rs[0]['values'][i][7] + '/' + rs[0]['values'][i][8] + 'mi';
        }

        if (rs[0]['values'][i][9] !== null) {
          descStr += ' ' + rs[0]['values'][i][9] + '/' + rs[0]['values'][i][10] + 'rst';
        }

        descStr += ']';

        $('#super_sets_added').append(descStr + '<a class="delete_exercise_set_join" href="#" id="' + rs[0]['values'][i][11] + '">X</a><br />')
      }
    } catch (e) {
      ;;;
    }
  }

  if (beastSetId !== null) {
    
    // get all sets
    sqlstr = "SELECT REPS_MIN, "
           + "       REPS_MAX, "
           + "       DURATION_MIN, "
           + "       DURATION_MAX, "
           + "       DIST_MIN, "
           + "       DIST_MAX, "
           + "       REST_DURATION_MIN, " 
           + "       REST_DURATION_MAX  "
           + "  FROM SET_OF_SETS "
           + " WHERE SET_OF_SETS_ID = " + beastSetId + ";";

    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    if (rs[0]['values'][0][0] !== null) {
      $('#beast_reps_min').val(rs[0]['values'][0][0]);
    }
    if (rs[0]['values'][0][1] !== null) {
      $('#beast_reps_max').val(rs[0]['values'][0][1]);
    }
    if (rs[0]['values'][0][2] !== null) {
      $('#beast_duration_min').val(rs[0]['values'][0][2]);
    }
    if (rs[0]['values'][0][3] !== null) {
      $('#beast_duration_max').val(rs[0]['values'][0][3]);
    }
    if (rs[0]['values'][0][4] !== null) {
      $('#beast_dist_min').val(rs[0]['values'][0][4]);
    }
    if (rs[0]['values'][0][5] !== null) {
      $('#beast_dist_max').val(rs[0]['values'][0][5]);
    }
    if (rs[0]['values'][0][6] !== null) {
      $('#beast_rest_min').val(rs[0]['values'][0][6]);
    }
    if (rs[0]['values'][0][7] !== null) {
      $('#beast_rest_max').val(rs[0]['values'][0][7]);
    }

    sqlstr = "SELECT esj.SET_ORDER, "
           + "       e.NAME, "
           + "       es.DIRECTION, "
           + "       es.REPS_MIN, "
           + "       es.REPS_MAX, "
           + "       es.DURATION_MIN, "
           + "       es.DURATION_MAX, "
           + "       es.DIST_MIN, "
           + "       es.DIST_MAX, "
           + "       es.REST_DURATION_MIN, "
           + "       es.REST_DURATION_MAX, "
           + "       esj.EXERCISE_SET_JOIN_ID "
           + "  FROM EXERCISE_SET_JOIN esj, "
           + "       EXERCISE_SET es, "
           + "       EXERCISE e "
           + " WHERE esj.SET_OF_SETS_ID = " + beastSetId + " "
           + "   AND esj.EXERCISE_SET_ID = es.EXERCISE_SET_ID "
           + "   AND es.EXERCISE_ID = e.EXERCISE_ID "
           + " ORDER BY esj.SET_ORDER;";

    var rs = db.exec(sqlstr);

    try {
      for (i = 0; i < rs[0]['values'].length; ++i) {
        
        var descStr = '';

        if (rs[0]['values'][i][1] !== null) {
          descStr += rs[0]['values'][i][1];
        }

        if (rs[0]['values'][i][2] !== null) {
          descStr += '-' + rs[0]['values'][i][2];
        }

        descStr += ' [';

        if (rs[0]['values'][i][3] !== null) {
          descStr += ' ' + rs[0]['values'][i][3] + '/' + rs[0]['values'][i][4] + 'rps';
        }

        if (rs[0]['values'][i][5] !== null) {
          descStr += ' ' + rs[0]['values'][i][5] + '/' + rs[0]['values'][i][6] + 'min';
        }

        if (rs[0]['values'][i][7] !== null) {
          descStr += ' ' + rs[0]['values'][i][7] + '/' + rs[0]['values'][i][8] + 'mi';
        }

        if (rs[0]['values'][i][9] !== null) {
          descStr += ' ' + rs[0]['values'][i][9] + '/' + rs[0]['values'][i][10] + 'rst';
        }

        descStr += ']';

        $('#beast_sets_added').append(descStr + '<a class="delete_exercise_set_join" href="#" id="' + rs[0]['values'][i][11] + '">X</a><br />')
      } 
    } catch (e) {
      ;;;
    }
  }

  if (trifectaSetId !== null) {
    
    // get all sets
    sqlstr = "SELECT REPS_MIN, "
           + "       REPS_MAX, "
           + "       DURATION_MIN, "
           + "       DURATION_MAX, "
           + "       DIST_MIN, "
           + "       DIST_MAX, "
           + "       REST_DURATION_MIN, " 
           + "       REST_DURATION_MAX  "
           + "  FROM SET_OF_SETS "
           + " WHERE SET_OF_SETS_ID = " + trifectaSetId + ";";

    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    if (rs[0]['values'][0][0] !== null) {
      $('#trifecta_reps_min').val(rs[0]['values'][0][0]);
    }
    if (rs[0]['values'][0][1] !== null) {
      $('#trifecta_reps_max').val(rs[0]['values'][0][1]);
    }
    if (rs[0]['values'][0][2] !== null) {
      $('#trifecta_duration_min').val(rs[0]['values'][0][2]);
    }
    if (rs[0]['values'][0][3] !== null) {
      $('#trifecta_duration_max').val(rs[0]['values'][0][3]);
    }
    if (rs[0]['values'][0][4] !== null) {
      $('#trifecta_dist_min').val(rs[0]['values'][0][4]);
    }
    if (rs[0]['values'][0][5] !== null) {
      $('#trifecta_dist_max').val(rs[0]['values'][0][5]);
    }
    if (rs[0]['values'][0][6] !== null) {
      $('#trifecta_rest_min').val(rs[0]['values'][0][6]);
    }
    if (rs[0]['values'][0][7] !== null) {
      $('#trifecta_rest_max').val(rs[0]['values'][0][7]);
    }

    sqlstr = "SELECT esj.SET_ORDER, "
           + "       e.NAME, "
           + "       es.DIRECTION, "
           + "       es.REPS_MIN, "
           + "       es.REPS_MAX, "
           + "       es.DURATION_MIN, "
           + "       es.DURATION_MAX, "
           + "       es.DIST_MIN, "
           + "       es.DIST_MAX, "
           + "       es.REST_DURATION_MIN, "
           + "       es.REST_DURATION_MAX, "
           + "       esj.EXERCISE_SET_JOIN_ID "
           + "  FROM EXERCISE_SET_JOIN esj, "
           + "       EXERCISE_SET es, "
           + "       EXERCISE e "
           + " WHERE esj.SET_OF_SETS_ID = " + trifectaSetId + " "
           + "   AND esj.EXERCISE_SET_ID = es.EXERCISE_SET_ID "
           + "   AND es.EXERCISE_ID = e.EXERCISE_ID "
           + " ORDER BY esj.SET_ORDER;";

    var rs = db.exec(sqlstr);

    try {
      for (i = 0; i < rs[0]['values'].length; ++i) {
        
        var descStr = '';

        if (rs[0]['values'][i][1] !== null) {
          descStr += rs[0]['values'][i][1];
        }

        if (rs[0]['values'][i][2] !== null) {
          descStr += '-' + rs[0]['values'][i][2];
        }

        descStr += ' [';

        if (rs[0]['values'][i][3] !== null) {
          descStr += ' ' + rs[0]['values'][i][3] + '/' + rs[0]['values'][i][4] + 'rps';
        }

        if (rs[0]['values'][i][5] !== null) {
          descStr += ' ' + rs[0]['values'][i][5] + '/' + rs[0]['values'][i][6] + 'min';
        }

        if (rs[0]['values'][i][7] !== null) {
          descStr += ' ' + rs[0]['values'][i][7] + '/' + rs[0]['values'][i][8] + 'mi';
        }

        if (rs[0]['values'][i][9] !== null) {
          descStr += ' ' + rs[0]['values'][i][9] + '/' + rs[0]['values'][i][10] + 'rst';
        }

        descStr += ']';

        $('#trifecta_sets_added').append(descStr + '<a class="delete_exercise_set_join" href="#" id="' + rs[0]['values'][i][11] + '">X</a><br />')
      }
    } catch (e) {
      ;;;
    }
  }

  if (cooldownSetId !== null) {
    
    // get all sets
    sqlstr = "SELECT REPS_MIN, "
           + "       REPS_MAX, "
           + "       DURATION_MIN, "
           + "       DURATION_MAX, "
           + "       DIST_MIN, "
           + "       DIST_MAX, "
           + "       REST_DURATION_MIN, " 
           + "       REST_DURATION_MAX  "
           + "  FROM SET_OF_SETS "
           + " WHERE SET_OF_SETS_ID = " + cooldownSetId + ";";

    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    if (rs[0]['values'][0][0] !== null) {
      $('#cooldown_reps_min').val(rs[0]['values'][0][0]);
    }
    if (rs[0]['values'][0][1] !== null) {
      $('#cooldown_reps_max').val(rs[0]['values'][0][1]);
    }
    if (rs[0]['values'][0][2] !== null) {
      $('#cooldown_duration_min').val(rs[0]['values'][0][2]);
    }
    if (rs[0]['values'][0][3] !== null) {
      $('#cooldown_duration_max').val(rs[0]['values'][0][3]);
    }
    if (rs[0]['values'][0][4] !== null) {
      $('#cooldown_dist_min').val(rs[0]['values'][0][4]);
    }
    if (rs[0]['values'][0][5] !== null) {
      $('#cooldown_dist_max').val(rs[0]['values'][0][5]);
    }
    if (rs[0]['values'][0][6] !== null) {
      $('#cooldown_rest_min').val(rs[0]['values'][0][6]);
    }
    if (rs[0]['values'][0][7] !== null) {
      $('#cooldown_rest_max').val(rs[0]['values'][0][7]);
    }


    sqlstr = "SELECT esj.SET_ORDER, "
           + "       e.NAME, "
           + "       es.DIRECTION, "
           + "       es.REPS_MIN, "
           + "       es.REPS_MAX, "
           + "       es.DURATION_MIN, "
           + "       es.DURATION_MAX, "
           + "       es.DIST_MIN, "
           + "       es.DIST_MAX, "
           + "       es.REST_DURATION_MIN, "
           + "       es.REST_DURATION_MAX, "
           + "       esj.EXERCISE_SET_JOIN_ID "
           + "  FROM EXERCISE_SET_JOIN esj, "
           + "       EXERCISE_SET es, "
           + "       EXERCISE e "
           + " WHERE esj.SET_OF_SETS_ID = " + cooldownSetId + " "
           + "   AND esj.EXERCISE_SET_ID = es.EXERCISE_SET_ID "
           + "   AND es.EXERCISE_ID = e.EXERCISE_ID "
           + " ORDER BY esj.SET_ORDER;";

    var rs = db.exec(sqlstr);

    try {
      for (i = 0; i < rs[0]['values'].length; ++i) {
        
        var descStr = '';

        if (rs[0]['values'][i][1] !== null) {
          descStr += rs[0]['values'][i][1];
        }

        if (rs[0]['values'][i][2] !== null) {
          descStr += '-' + rs[0]['values'][i][2];
        }

        descStr += ' [';

        if (rs[0]['values'][i][3] !== null) {
          descStr += ' ' + rs[0]['values'][i][3] + '/' + rs[0]['values'][i][4] + 'rps';
        }

        if (rs[0]['values'][i][5] !== null) {
          descStr += ' ' + rs[0]['values'][i][5] + '/' + rs[0]['values'][i][6] + 'min';
        }

        if (rs[0]['values'][i][7] !== null) {
          descStr += ' ' + rs[0]['values'][i][7] + '/' + rs[0]['values'][i][8] + 'mi';
        }

        if (rs[0]['values'][i][9] !== null) {
          descStr += ' ' + rs[0]['values'][i][9] + '/' + rs[0]['values'][i][10] + 'rst';
        }

        descStr += ']';

        $('#cooldown_sets_added').append(descStr + '<a class="delete_exercise_set_join" href="#" id="' + rs[0]['values'][i][11] + '">X</a><br />')
      }
    } catch (e) {
      ;;;
    }
  }
}


function toggleAllSets() {

  if ($('#all_sets').text() == "all") {
    $('#all_sets').text('none');
    $('#sprint_set').prop('checked', true);
    $('#super_set').prop('checked', true);
    $('#beast_set').prop('checked', true);
    $('#trifecta_set').prop('checked', true);
  } else {
    $('#all_sets').text('all');
    $('#sprint_set').prop('checked', false);
    $('#super_set').prop('checked', false);
    $('#beast_set').prop('checked', false);
    $('#trifecta_set').prop('checked', false);
  }


}

function addSet(setType, db) {
    
    var spartanWODId = $('#workouts > option:selected').attr('value');
   
    var columnName = '';
    var exerciseSetId = 0;
    if (setType === 'warmup') {
      columnName = 'WARMUP_SET'; 
      exerciseSetId = $('#warmup_sets > option:selected').attr('id');

    } else if (setType === 'cooldown') {
      columnName = 'COOLDOWN_SET'; 
      exerciseSetId = $('#cooldown_sets > option:selected').attr('id');

    } else if (setType === 'sprint') {
      columnName = 'MAIN_SET_SPRINT'; 
      exerciseSetId = $('#sprint_sets > option:selected').attr('id');

    } else if (setType === 'super') {
      columnName = 'MAIN_SET_SUPER'; 
      exerciseSetId = $('#super_sets > option:selected').attr('id');

    } else if (setType === 'beast') {
      columnName = 'MAIN_SET_BEAST'; 
      exerciseSetId = $('#beast_sets > option:selected').attr('id');

    } else if (setType === 'trifecta') {
      columnName = 'MAIN_SET_TRIFECTA'; 
      exerciseSetId = $('#trifecta_sets > option:selected').attr('id');

    }

    sqlstr = "SELECT " + columnName
           + "  FROM SPARTAN_WOD "
           + " WHERE SPARTAN_WOD_ID = " + spartanWODId;

    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    if (rs[0]['values'].length === 0) {
        alert(columnName + ' is null');
        return;
    }

    var setOfSetsId = parseInt(rs[0]['values'][0][0]);


    sqlstr = "SELECT MAX(EXERCISE_SET_JOIN_ID) FROM EXERCISE_SET_JOIN;"
    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    var exerciseSetJoinId = 1;

    if (rs[0]['values'][0][0] != null) {
      exerciseSetJoinId = rs[0]['values'][0][0];
      exerciseSetJoinId++;
    }

    sqlstr = "SELECT MAX(SET_ORDER) FROM EXERCISE_SET_JOIN WHERE SET_OF_SETS_ID = " + setOfSetsId + ";";
    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    var exerciseSetJoinOrder = 1;

    if (rs[0]['values'][0][0] != null) {
      exerciseSetJoinOrder = rs[0]['values'][0][0];
      exerciseSetJoinOrder++;
    }

    sqlstr = "INSERT INTO EXERCISE_SET_JOIN (EXERCISE_SET_JOIN_ID,"
           + "                               SET_OF_SETS_ID,"
           + "                               EXERCISE_SET_ID,"
           + "                               SET_ORDER)"
           + "                       VALUES (" + exerciseSetJoinId + ", "
           + "                               " + setOfSetsId + ", "
           + "                               " + exerciseSetId + ", "
           + "                               " + exerciseSetJoinOrder + ");";

    // Prepare an sql statement
    var rs = db.exec(sqlstr);

    populateSetOfSets(db);
}

function copySprintExerciseSet() {

  var reps_min = $('#sprint_reps_min').val();
  var reps_max = $('#sprint_reps_max').val();

  var duration_min = $('#sprint_duration_min').val();
  var duration_max = $('#sprint_duration_max').val();

  var distance_min = $('#sprint_distance_min').val();
  var distance_max = $('#sprint_distance_max').val();

  var rest_min = $('#sprint_rest_min').val();
  var rest_max = $('#sprint_rest_max').val();

  // Super
  $('#super_reps_min').val(reps_min);
  $('#super_reps_max').val(reps_max);

  $('#super_duration_min').val(duration_min);
  $('#super_duration_max').val(duration_max);

  $('#super_distance_min').val(distance_min);
  $('#super_distance_max').val(distance_max);

  $('#super_rest_min').val(rest_min);
  $('#super_rest_max').val(rest_max);

  // Beast
  $('#beast_reps_min').val(reps_min);
  $('#beast_reps_max').val(reps_max);

  $('#beast_duration_min').val(duration_min);
  $('#beast_duration_max').val(duration_max);

  $('#beast_distance_min').val(distance_min);
  $('#beast_distance_max').val(distance_max);

  $('#beast_rest_min').val(rest_min);
  $('#beast_rest_max').val(rest_max);

  // Trifecta
  $('#trifecta_reps_min').val(reps_min);
  $('#trifecta_reps_max').val(reps_max);

  $('#trifecta_duration_min').val(duration_min);
  $('#trifecta_duration_max').val(duration_max);

  $('#trifecta_distance_min').val(distance_min);
  $('#trifecta_distance_max').val(distance_max);

  $('#trifecta_rest_min').val(rest_min);
  $('#trifecta_rest_max').val(rest_max);

}


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
  
    var spartanWODId = 1;

    if (rs[0]['values'][0][0] != null) {
      spartanWODId = rs[0]['values'][0][0];
      spartanWODId++;
    }


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

  populateWODs(db);

  // Select Workout from the dropdown
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

function populateWorkout(db) {

  var spartanWODId = $('#workouts').find(':selected').attr('value');
  var wodName = $('#wod_name').val('');
  var wodQuote = $('#quote').val('');
  var wodQuoteBy = $('#quote_by').val('');
  var wodDescription = $('#wod_description').val('');
  var wodSpecialDay = $('#special_day').val('');
  
  if (spartanWODId === 'new') {
    return;
  }
  sqlstr = "SELECT * FROM SPARTAN_WOD WHERE SPARTAN_WOD_ID = " + spartanWODId + ";";
  var rs = db.exec(sqlstr);

  console.dir(rs);

  if (rs.length == 0) {
    return;
  }

  var spartanWODId = rs[0]['values'][0][0];
  var name = rs[0]['values'][0][1];

  // category
  var category = rs[0]['values'][0][2];

  var quote = rs[0]['values'][0][3];
  var quoteBy = rs[0]['values'][0][4];
  var description = rs[0]['values'][0][5];
  var specialDay = rs[0]['values'][0][6];
 
  $('#wod_name').val(name);
  $("input[value='" + category + "']").prop('checked', true);

  $('#quote').val(quote);
  $('#quote_by').val(quoteBy);
  $('#wod_description').val(description);
  $('#special_day').val(specialDay);

  populateSets(db);
}

function exportdb(db) {
  /* Uint8Array */
  var binArray = db.export();

  var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    return function (data, fileName) {
      var blob = new Blob([data], {type: "application/octet-stream"});
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    
  }());
  
  saveData(binArray, "spartan_wod.db");
}

// sqliteman dump
function initdb(db) {
var sqlstr = "PRAGMA foreign_keys=OFF; BEGIN TRANSACTION; CREATE TABLE SET_OF_SETS(SET_OF_SETS_ID INTEGER PRIMARY KEY ASC,                          CATEGORY VARCHAR,                         REPS_MIN INTEGER,                         REPS_MAX INTEGER,                         DURATION_MIN FLOAT,                         DURATION_MAX FLOAT,                         DIST_MIN FLOAT, DIST_MAX FLOAT,                         REST_DURATION_MIN FLOAT,                         REST_DURATION_MAX FLOAT,                         TYPE VARCHAR,                         CALORIES FLOAT); INSERT INTO \"SET_OF_SETS\" VALUES(1,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',45.0); INSERT INTO \"SET_OF_SETS\" VALUES(2,'sprint',1,2,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(3,'super',2,3,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(4,'beast',3,4,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(5,'trifecta',4,5,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(6,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(7,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(8,'sprint',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(9,'super',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(10,'beast',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(11,'trifecta',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(12,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(13,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(14,'sprint',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(15,'super',2,2,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(16,'beast',3,3,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(17,'trifecta',4,4,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(18,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(19,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(20,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(21,'sprint',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(22,'super',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(23,'beast',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(24,'trifecta',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(25,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(26,'sprint',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(27,'super',2,2,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(28,'beast',3,3,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(29,'trifecta',4,4,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(30,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(31,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(32,'sprint',3,3,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(33,'super',6,6,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(34,'beast',8,8,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(35,'trifecta',10,10,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(36,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(37,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(38,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(39,'sprint',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(40,'super',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(41,'beast',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(42,'trifecta',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(43,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(44,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(45,'sprint',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(46,'super',2,2,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(47,'beast',3,3,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(48,'trifecta',4,4,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(49,'sprint',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(50,'super',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(51,'beast',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(52,'trifecta',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(53,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(54,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',0.0); CREATE TABLE SPARTAN_WOD(SPARTAN_WOD_ID INTEGER PRIMARY KEY ASC,                         NAME VARCHAR,                         CATEGORY VARCHAR,                         QUOTE VARCHAR, QUOTE_BY VARCHAR,                         DESCRIPTION VARCHAR,                         SPECIAL_DAY VARCHAR,                         WARMUP_SET INTEGER,                         MAIN_SET_SPRINT INTEGER,                         MAIN_SET_SUPER INTEGER,                         MAIN_SET_BEAST INTEGER,                         MAIN_SET_TRIFECTA INTEGER,                         COOLDOWN_SET INTEGER,                         FOREIGN KEY(WARMUP_SET) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(MAIN_SET_SPRINT) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(MAIN_SET_SUPER) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(MAIN_SET_BEAST) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(MAIN_SET_TRIFECTA) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(COOLDOWN_SET) REFERENCES SET_OF_SETS(SET_OF_SETS_ID)); INSERT INTO \"SPARTAN_WOD\" VALUES(1,'A Work of Art','athleticism','The human foot is a masterpiece of engineering and a work of art.','Leonardo da Vinci','Put those feet to good use in this workout. Celebrate your abilities by maximizing them.',NULL,1,2,3,4,5,6); INSERT INTO \"SPARTAN_WOD\" VALUES(2,'Burpee-fest','athleticism','From the little spark may burst a mighty flame.','Dante','From a simple bodyweight exercise you can discover an entire world of fitness. Likewise, one simple workout can lead you to brand new capabilities. Burpees are simple and powerful. When in doubt on how to train, do burpees while you think about it. Master the burpee, and everything else will fall into place. How many burpees can you do in one day? If you dont know, find out by scheduling 15 minutes 2-4 times in the day where you can commit to doing burpees. Or, just set aside an hour and go for it!','',7,8,9,10,11,12); INSERT INTO \"SPARTAN_WOD\" VALUES(3,'Cheaper than Healthcare','athleticism','','','','',13,14,15,16,17,18); INSERT INTO \"SPARTAN_WOD\" VALUES(4,'Do You Dare?','athleticism','It is not because things are difficult that we do not dare; it is because we do not dare that things are difficult.','Seneca','','',19,21,22,23,24,20); INSERT INTO \"SPARTAN_WOD\" VALUES(5,'Fast Intervals','athleticism','To be is to do.','Immanuel Kant','','',25,26,27,28,29,30); INSERT INTO \"SPARTAN_WOD\" VALUES(6,'Fathers Day WOD','athleticism','One father is more than a hundred schoolmasters.','George Herbert','Todays Fathers Day workout is meant for you and your kids to do together. Show your children how far you can push yourself by doing as many sets as you can. Repeat up to 10x. If your kid(s) get tired, pick them up and carry them on your back, then finish your sets!  Finish by stretching with your kids.','Fathers Day',31,32,33,34,35,36); INSERT INTO \"SPARTAN_WOD\" VALUES(7,'Hill Intervals','athleticism','The world turns aside to let any man pass who knows where he is going. ','Epictetus','Going up? Thats where this workout is heading.','',37,39,40,41,42,38); INSERT INTO \"SPARTAN_WOD\" VALUES(8,'Hold Your Ground','athleticism','The greatest oak was once a little nut who held its ground.','Author Unknown','Perform this main set once for time.','',43,45,46,47,48,44); INSERT INTO \"SPARTAN_WOD\" VALUES(9,'Lo40: Sprint Session','athleticism','Trust only movement. Life happens at the level of events, not of words. Trust movement.','Alfred Adler','','',54,49,50,51,52,53); CREATE TABLE EXERCISE(EXERCISE_ID INTEGER PRIMARY KEY ASC,                      NAME VARCHAR,                      CATEGORY VARCHAR,                      DEMO_URL VARCHAR, GENERAL_MUSCLE_GROUP VARCHAR,                      TARGET_MUSCLE_GROUP VARCHAR,                      LOC_INDOORS INTEGER,                      LOC_OUTDOORS INTEGER,                      EQ_JUMP_ROPE INTEGER,                      EQ_PULLUP_BAR INTEGER,                      EQ_WEIGHTS INTEGER,                      EQ_KETTLE_BELLS INTEGER,                      EQ_HEAVY_OBJECT INTEGER, EQ_TRX INTEGER,                      EQ_MED_BALL INTEGER,                      EQ_BOX INTEGER,                      EQ_SQUAT_RACK INTEGER,                      EQ_TREADMILL INTEGER, EQ_TRACK INTEGER,                      EQ_TRAIL INTEGER,                      EQ_HILLS INTEGER,                      EQ_POOL INTEGER,                      EQ_BIKE INTEGER, EQ_ROW_MACHINE INTEGER,                      EQ_ROPE,                      CALORIES FLOAT,                      CALORIES_MEASURED_IN VARCHAR); INSERT INTO \"EXERCISE\" VALUES(1,'arm curls','strength','https://www.youtube.com/watch?v=kwG2ipFRgfo','upper body','arms',2,2,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0.23333,'reps'); INSERT INTO \"EXERCISE\" VALUES(2,'back extension','strength','https://www.youtube.com/watch?v=Bw9YuQTTc58','upper body','back',2,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0.23333,'reps'); INSERT INTO \"EXERCISE\" VALUES(3,'bear crawl','athleticism','https://www.youtube.com/watch?v=WMXbyYpZ9oY','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,607.84,'miles'); INSERT INTO \"EXERCISE\" VALUES(4,'belly crawl','athleticism','https://www.youtube.com/watch?v=cLwS1xkOLas','upper body','arms',2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(5,'bodyweight circuit','strength','','full body','full body',2,2,0,2,0,0,0,2,0,2,0,0,2,2,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(6,'bodyweight squat','strength','https://www.youtube.com/watch?v=p3g4wAsu0R4','lower body','legs',2,2,0,0,0,0,0,2,0,0,0,0,2,2,0,0,0,0,0,0.5787,'reps'); INSERT INTO \"EXERCISE\" VALUES(7,'box jump','strength','https://www.youtube.com/watch?v=hxldG9FX4j4','lower body','legs',2,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.5,'reps'); INSERT INTO \"EXERCISE\" VALUES(8,'box jump burpee','athleticism','https://www.youtube.com/watch?v=kiOcwv7YE6c','full body','full body',2,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(9,'brazilian ab twist','strength','https://www.youtube.com/watch?v=iUk5T87cf34','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0.1227,'reps'); INSERT INTO \"EXERCISE\" VALUES(10,'burpee','athleticism','https://www.youtube.com/watch?v=JZQA08SlJnM','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(11,'burpee pull-up','strength','https://www.youtube.com/watch?v=kAvZoa5iexA','full body','full body',2,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(12,'chest pass','athleticism','https://www.youtube.com/watch?v=FUdcjZ0weic','upper body','chest',2,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0.5427,'reps'); INSERT INTO \"EXERCISE\" VALUES(13,'chore','active rest','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3.0,'minutes'); INSERT INTO \"EXERCISE\" VALUES(14,'crunch','strength','https://www.youtube.com/watch?v=Xyd_fa5zoEU','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.1666,'reps'); INSERT INTO \"EXERCISE\" VALUES(15,'curl','strength','https://www.youtube.com/watch?v=oUqgPSZmhro','upper body','arms',2,2,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0.23333,'reps'); INSERT INTO \"EXERCISE\" VALUES(16,'cycling','endurance','','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,0,1,0,0,14.0,'minutes'); INSERT INTO \"EXERCISE\" VALUES(17,'dog walking','active rest','','lower body','legs',0,1,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,60.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(18,'double leg butt kicks','warmup','https://www.youtube.com/watch?v=F5iYMAkGaY8','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(19,'drop push-up','strength','https://www.youtube.com/watch?v=y9aAhXt2wYk','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(20,'dynamic warm up','warmup','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,3.0,'minutes'); INSERT INTO \"EXERCISE\" VALUES(21,'easy jog','warmup','https://www.youtube.com/watch?v=BgZdwy1FO4Y','full body','full body',2,2,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,136.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(22,'explosive broad jump','athleticism','https://www.youtube.com/watch?v=ko22JMOkzQQ','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(23,'flutter kick','strength','https://www.youtube.com/watch?v=ANVdMDaYRts','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.1666,'reps'); INSERT INTO \"EXERCISE\" VALUES(24,'glute kickback','athleticism','https://www.youtube.com/watch?v=h4439IQFAqI','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(25,'handstand hold','strength','https://www.youtube.com/watch?v=h4439IQFAqI','upper body','arms',2,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,8.2,'minutes'); INSERT INTO \"EXERCISE\" VALUES(26,'hanging knee raise','strength','https://www.youtube.com/watch?v=PGSKkNB1Oyk','full body','core',2,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2666,'reps'); INSERT INTO \"EXERCISE\" VALUES(27,'high knee','warmup','https://www.youtube.com/watch?v=8opcQdC-V-U','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(28,'hiking','active rest','','full body','full body',0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,70.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(29,'hill interval','athleticism','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,2,0,2,1,0,0,0,0,100.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(30,'inverted pull-up','strength','https://www.youtube.com/watch?v=lgsyUiB6occ','upper body','upper body',1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0.2733,'reps'); INSERT INTO \"EXERCISE\" VALUES(31,'isometric lunge hold','strength','https://www.youtube.com/watch?v=u-bhL8zo570','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,8.2,'minutes'); INSERT INTO \"EXERCISE\" VALUES(32,'isometric wiper','strength','https://www.youtube.com/watch?v=VxrSMH5vVWY','upper body','arms',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(33,'jog','endurance','https://www.youtube.com/watch?v=VxrSMH5vVWY','full body','full body',2,2,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,200.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(34,'jump rope','warmup','https://www.youtube.com/watch?v=GRStB06uhgE','full body','full body',2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14.288,'minutes'); INSERT INTO \"EXERCISE\" VALUES(35,'jumping jack','warmup','https://www.youtube.com/watch?v=c4DAnQ6DtF8','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.2381,'reps'); INSERT INTO \"EXERCISE\" VALUES(36,'jumping lunge','athleticism','https://www.youtube.com/watch?v=Kw4QpPfX-cU','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(37,'kettle bell 1-arm overhead farmer''s carry','strength','https://www.youtube.com/watch?v=uT1LV1eLcdM','upper body','upper body',2,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,100.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(38,'kettle bell swing','strength','https://www.youtube.com/watch?v=OopKTfLiz48','full body','full body',2,2,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(39,'laying leg raise','athleticism','https://www.youtube.com/watch?v=xqTh6NqbAtM','lower body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.1666,'reps'); INSERT INTO \"EXERCISE\" VALUES(40,'run','endurance','https://www.youtube.com/watch?v=wCVSv7UxB2E','full body','full body',2,2,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,350.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(41,'mountain climber','endurance','https://www.youtube.com/watch?v=nmwgirgXLYM','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.5555,'reps'); INSERT INTO \"EXERCISE\" VALUES(42,'muscle-up','strength','https://youtu.be/ZEDY9QNBKe4','upper body','upper body',1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(43,'pistol squat','strength','https://www.youtube.com/watch?v=7NvOuty_Fnc','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,1.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(44,'plank','strength','https://www.youtube.com/watch?v=pSHjTRCQxIw','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,3.68,'minutes'); INSERT INTO \"EXERCISE\" VALUES(45,'plyometric push-up','strength','https://www.youtube.com/watch?v=mgkyTtQ0ODE','upper body','upper body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.4,'reps'); INSERT INTO \"EXERCISE\" VALUES(46,'power skip','warmup','https://www.youtube.com/watch?v=NCY9gFsZk9Y','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(47,'pull-up','warmup','https://www.youtube.com/watch?v=NCY9gFsZk9Y','upper body','upper body',2,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(48,'push-up','warmup','https://www.youtube.com/watch?v=NCY9gFsZk9Y','upper body','upper body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.384,'reps'); INSERT INTO \"EXERCISE\" VALUES(49,'recover','rest','https://www.youtube.com/watch?v=NCY9gFsZk9Y','full body','full body',2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0.01,'minutes'); INSERT INTO \"EXERCISE\" VALUES(50,'rope climb','rest','https://www.youtube.com/watch?v=AD0uO7JGdZU','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1.32,'reps'); INSERT INTO \"EXERCISE\" VALUES(51,'row','endurance','','full body','full body',1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,8.21,'minutes'); INSERT INTO \"EXERCISE\" VALUES(52,'sandbag/medicine ball slam','strength','https://www.youtube.com/watch?v=Y2wSD7spnxk','full body','full body',2,2,0,0,0,0,0,0,1,0,0,0,2,2,0,0,0,0,0,0.2,'reps'); INSERT INTO \"EXERCISE\" VALUES(53,'sandbag squat','strength','https://www.youtube.com/watch?v=U9yK6rHy40A','lower body','lower body',2,2,0,0,2,2,2,0,2,0,0,0,2,2,0,0,0,0,0,0.3,'reps'); INSERT INTO \"EXERCISE\" VALUES(54,'sandbag squat throw','strength','https://www.youtube.com/watch?v=R-zLekvxzpg','full body','full body',2,2,0,0,0,0,2,0,2,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(55,'shuttle run','strength','https://www.youtube.com/watch?v=Zcj_xdwLnNc','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,400.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(56,'side kick','warmup','https://www.youtube.com/watch?v=MsmmbeXJ6Lw','lower body','lower body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.18,'reps'); INSERT INTO \"EXERCISE\" VALUES(57,'side plank','strength','https://www.youtube.com/watch?v=6cRAFji80CQ','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,3.68,'minutes'); INSERT INTO \"EXERCISE\" VALUES(58,'side-to-side hop','athleticism','https://www.youtube.com/watch?v=_AVX9cpPzks','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.2381,'reps'); INSERT INTO \"EXERCISE\" VALUES(59,'sit-up','strength','https://www.youtube.com/watch?v=1fbU_MkV7NE','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.1666,'reps'); INSERT INTO \"EXERCISE\" VALUES(60,'speed skater','athleticism','https://www.youtube.com/watch?v=EkESodXYDRM','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.2381,'reps'); INSERT INTO \"EXERCISE\" VALUES(61,'spiderman push-up','strength','https://www.youtube.com/watch?v=fKBeHALPsSU','upper body','upper body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.4,'reps'); INSERT INTO \"EXERCISE\" VALUES(62,'squat jump','strength','https://www.youtube.com/watch?v=DeTBwEL4m7s','lower body','lower body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(63,'star jump','athleticism','https://www.youtube.com/watch?v=h6wu4_LOhyU','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(64,'stretch','cooldown','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.01,'minutes'); INSERT INTO \"EXERCISE\" VALUES(65,'swimming','endurance','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,8.3333,'minutes'); INSERT INTO \"EXERCISE\" VALUES(66,'trail run','endurance','','full body','full body',0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,350.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(67,'tricep overhead extension','strength','https://www.youtube.com/watch?v=YbX7Wd8jQ-Q','upper body','arms',2,2,0,0,2,2,2,0,0,0,0,0,0,2,0,0,0,0,0,0.2733,'reps'); INSERT INTO \"EXERCISE\" VALUES(68,'uphill dash','athleticism','','full body','full body',0,1,0,0,0,0,0,0,0,0,0,0,0,2,1,0,0,0,0,120.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(69,'vertical jump','athleticism','https://www.youtube.com/watch?v=K9zzVwMyD1g','lower body','lower body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(70,'walk','active rest','','lower body','lower body',2,2,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,50.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(71,'walking lunge','strength','https://www.youtube.com/watch?v=L8fvypPrzzs','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.2644,'reps'); INSERT INTO \"EXERCISE\" VALUES(72,'wide push-up','strength','https://www.youtube.com/watch?v=B78GwfC-87Y','upper body','chest',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.384,'reps'); INSERT INTO \"EXERCISE\" VALUES(73,'yoga','active recovery','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.1,'minutes'); INSERT INTO \"EXERCISE\" VALUES(74,'recover','active recovery','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0.001,'minutes'); INSERT INTO \"EXERCISE\" VALUES(75,'medicine ball situp','strength','','upper body','abs',2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.001,'minutes'); CREATE TABLE EXERCISE_SET(EXERCISE_SET_ID INTEGER PRIMARY KEY ASC,                          DIRECTION VARCHAR, EXERCISE_ID INTEGER,                          TYPE VARCHAR,                          REPS_MIN INTEGER,                          REPS_MAX INTEGER,                          DURATION_MIN FLOAT,                          DURATION_MAX FLOAT,                          DIST_MIN FLOAT,                          DIST_MAX FLOAT,                          REST_DURATION_MIN INTEGER,                          REST_DURATION_MAX INTEGER,                          CALORIES FLOAT,                          FOREIGN KEY(EXERCISE_ID) REFERENCES EXERCISE(EXERCISE_ID)); INSERT INTO \"EXERCISE_SET\" VALUES(1,NULL,20,'warmup',NULL,NULL,5.0,10.0,NULL,NULL,NULL,NULL,45.0); INSERT INTO \"EXERCISE_SET\" VALUES(2,NULL,40,'warmup',NULL,NULL,10.0,10.0,NULL,NULL,NULL,NULL,350.0); INSERT INTO \"EXERCISE_SET\" VALUES(3,'',40,'sprint',NULL,NULL,NULL,NULL,0.5,0.5,NULL,NULL,175.0); INSERT INTO \"EXERCISE_SET\" VALUES(4,'',40,'super',NULL,NULL,NULL,NULL,0.5,0.5,NULL,NULL,175.0); INSERT INTO \"EXERCISE_SET\" VALUES(5,'',40,'beast',NULL,NULL,NULL,NULL,0.5,0.5,NULL,NULL,175.0); INSERT INTO \"EXERCISE_SET\" VALUES(6,'',40,'trifecta',NULL,NULL,NULL,NULL,0.5,0.5,NULL,NULL,175.0); INSERT INTO \"EXERCISE_SET\" VALUES(7,'',10,'sprint',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(8,'',10,'super',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(9,'',10,'beast',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(10,'',10,'trifecta',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(11,'',70,'sprint',NULL,NULL,NULL,NULL,0.125,0.25,NULL,NULL,9.375); INSERT INTO \"EXERCISE_SET\" VALUES(12,'',70,'super',NULL,NULL,NULL,NULL,0.125,0.25,NULL,NULL,9.375); INSERT INTO \"EXERCISE_SET\" VALUES(13,'',70,'beast',NULL,NULL,NULL,NULL,0.125,0.25,NULL,NULL,9.375); INSERT INTO \"EXERCISE_SET\" VALUES(14,'',70,'trifecta',NULL,NULL,NULL,NULL,0.125,0.25,NULL,NULL,9.375); INSERT INTO \"EXERCISE_SET\" VALUES(15,'',64,'cooldown',NULL,NULL,5.0,10.0,NULL,NULL,NULL,NULL,0.075); INSERT INTO \"EXERCISE_SET\" VALUES(16,'',10,'sprint',300,300,NULL,NULL,NULL,NULL,NULL,NULL,199.98); INSERT INTO \"EXERCISE_SET\" VALUES(17,'',10,'super',600,600,NULL,NULL,NULL,NULL,NULL,NULL,399.96); INSERT INTO \"EXERCISE_SET\" VALUES(18,'',10,'beast',900,900,NULL,NULL,NULL,NULL,NULL,NULL,599.94); INSERT INTO \"EXERCISE_SET\" VALUES(19,'',10,'trifecta',1200,1200,NULL,NULL,NULL,NULL,NULL,NULL,799.92); INSERT INTO \"EXERCISE_SET\" VALUES(20,'',41,'sprint',30,30,NULL,NULL,NULL,NULL,NULL,NULL,16.665); INSERT INTO \"EXERCISE_SET\" VALUES(21,'',41,'super',30,30,NULL,NULL,NULL,NULL,NULL,NULL,16.665); INSERT INTO \"EXERCISE_SET\" VALUES(22,'',41,'beast',30,30,NULL,NULL,NULL,NULL,NULL,NULL,16.665); INSERT INTO \"EXERCISE_SET\" VALUES(23,'',41,'trifecta',30,30,NULL,NULL,NULL,NULL,NULL,NULL,16.665); INSERT INTO \"EXERCISE_SET\" VALUES(24,'',61,'sprint',15,15,NULL,NULL,NULL,NULL,NULL,NULL,6.0); INSERT INTO \"EXERCISE_SET\" VALUES(25,'',61,'super',15,15,NULL,NULL,NULL,NULL,NULL,NULL,6.0); INSERT INTO \"EXERCISE_SET\" VALUES(26,'',61,'beast',15,15,NULL,NULL,NULL,NULL,NULL,NULL,6.0); INSERT INTO \"EXERCISE_SET\" VALUES(27,'',61,'trifecta',15,15,NULL,NULL,NULL,NULL,NULL,NULL,6.0); INSERT INTO \"EXERCISE_SET\" VALUES(28,'',44,'sprint',NULL,NULL,1.0,1.0,NULL,NULL,NULL,NULL,3.68); INSERT INTO \"EXERCISE_SET\" VALUES(29,'',44,'super',NULL,NULL,1.0,1.0,NULL,NULL,NULL,NULL,3.68); INSERT INTO \"EXERCISE_SET\" VALUES(30,'',44,'beast',NULL,NULL,1.0,1.0,NULL,NULL,NULL,NULL,3.68); INSERT INTO \"EXERCISE_SET\" VALUES(31,'',44,'trifecta',NULL,NULL,1.0,1.0,NULL,NULL,NULL,NULL,3.68); INSERT INTO \"EXERCISE_SET\" VALUES(32,'',30,'sprint',15,15,NULL,NULL,NULL,NULL,NULL,NULL,4.0995); INSERT INTO \"EXERCISE_SET\" VALUES(33,'',30,'super',15,15,NULL,NULL,NULL,NULL,NULL,NULL,4.0995); INSERT INTO \"EXERCISE_SET\" VALUES(34,'',30,'beast',15,15,NULL,NULL,NULL,NULL,NULL,NULL,4.0995); INSERT INTO \"EXERCISE_SET\" VALUES(35,'',30,'trifecta',15,15,NULL,NULL,NULL,NULL,NULL,NULL,4.0995); INSERT INTO \"EXERCISE_SET\" VALUES(36,'',75,'sprint',NULL,NULL,30.0,30.0,NULL,NULL,NULL,NULL,0.03); INSERT INTO \"EXERCISE_SET\" VALUES(37,'',75,'super',NULL,NULL,30.0,30.0,NULL,NULL,NULL,NULL,0.03); INSERT INTO \"EXERCISE_SET\" VALUES(38,'',75,'beast',NULL,NULL,30.0,30.0,NULL,NULL,NULL,NULL,0.03); INSERT INTO \"EXERCISE_SET\" VALUES(39,'',75,'trifecta',NULL,NULL,30.0,30.0,NULL,NULL,NULL,NULL,0.03); INSERT INTO \"EXERCISE_SET\" VALUES(40,'',62,'sprint',15,15,NULL,NULL,NULL,NULL,NULL,NULL,4.9995); INSERT INTO \"EXERCISE_SET\" VALUES(41,'',62,'super',15,15,NULL,NULL,NULL,NULL,NULL,NULL,4.9995); INSERT INTO \"EXERCISE_SET\" VALUES(42,'',62,'beast',15,15,NULL,NULL,NULL,NULL,NULL,NULL,4.9995); INSERT INTO \"EXERCISE_SET\" VALUES(43,'',62,'trifecta',15,15,NULL,NULL,NULL,NULL,NULL,NULL,4.9995); INSERT INTO \"EXERCISE_SET\" VALUES(44,'',33,'trifecta',NULL,NULL,NULL,NULL,0.5,2.0,NULL,NULL,250.0); INSERT INTO \"EXERCISE_SET\" VALUES(45,'',43,'warmup',10,10,NULL,NULL,NULL,NULL,NULL,NULL,10.0); INSERT INTO \"EXERCISE_SET\" VALUES(46,'',45,'warmup',10,10,NULL,NULL,NULL,NULL,NULL,NULL,4.0); INSERT INTO \"EXERCISE_SET\" VALUES(47,'',24,'warmup',10,10,NULL,NULL,NULL,NULL,NULL,NULL,3.333); INSERT INTO \"EXERCISE_SET\" VALUES(48,'',68,'sprint',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,7.5); INSERT INTO \"EXERCISE_SET\" VALUES(49,'',68,'super',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,7.5); INSERT INTO \"EXERCISE_SET\" VALUES(50,'',68,'beast',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,7.5); INSERT INTO \"EXERCISE_SET\" VALUES(51,'',68,'trifecta',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,7.5); INSERT INTO \"EXERCISE_SET\" VALUES(52,'',66,'sprint',NULL,NULL,NULL,NULL,3.0,4.0,NULL,NULL,1225.0); INSERT INTO \"EXERCISE_SET\" VALUES(53,'',66,'super',NULL,NULL,NULL,NULL,4.0,5.0,NULL,NULL,1575.0); INSERT INTO \"EXERCISE_SET\" VALUES(54,'',66,'beast',NULL,NULL,NULL,NULL,5.0,6.0,NULL,NULL,1925.0); INSERT INTO \"EXERCISE_SET\" VALUES(55,'',66,'trifecta',NULL,NULL,NULL,NULL,6.0,7.0,NULL,NULL,2275.0); INSERT INTO \"EXERCISE_SET\" VALUES(56,'',33,'warmup',NULL,NULL,NULL,NULL,0.5,2.0,NULL,NULL,250.0); INSERT INTO \"EXERCISE_SET\" VALUES(57,'',33,'trifecta',NULL,NULL,NULL,NULL,0.5,2.0,NULL,NULL,250.0); INSERT INTO \"EXERCISE_SET\" VALUES(58,'',10,'warmup',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(59,'',10,'trifecta',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(60,'',40,'sprint',NULL,NULL,NULL,NULL,0.25,0.25,NULL,NULL,87.5); INSERT INTO \"EXERCISE_SET\" VALUES(61,'',40,'super',NULL,NULL,NULL,NULL,0.25,0.25,NULL,NULL,87.5); INSERT INTO \"EXERCISE_SET\" VALUES(62,'',40,'beast',NULL,NULL,NULL,NULL,0.25,0.25,NULL,NULL,87.5); INSERT INTO \"EXERCISE_SET\" VALUES(63,'',40,'trifecta',NULL,NULL,NULL,NULL,0.25,0.25,NULL,NULL,87.5); INSERT INTO \"EXERCISE_SET\" VALUES(64,'',39,'sprint',5,15,NULL,NULL,NULL,NULL,NULL,NULL,1.666); INSERT INTO \"EXERCISE_SET\" VALUES(65,'',39,'super',5,15,NULL,NULL,NULL,NULL,NULL,NULL,1.666); INSERT INTO \"EXERCISE_SET\" VALUES(66,'',39,'beast',5,15,NULL,NULL,NULL,NULL,NULL,NULL,1.666); INSERT INTO \"EXERCISE_SET\" VALUES(67,'',39,'trifecta',5,15,NULL,NULL,NULL,NULL,NULL,NULL,1.666); INSERT INTO \"EXERCISE_SET\" VALUES(68,'',44,'sprint',NULL,NULL,0.5,0.5,NULL,NULL,NULL,NULL,1.84); INSERT INTO \"EXERCISE_SET\" VALUES(69,'',44,'super',NULL,NULL,0.5,0.5,NULL,NULL,NULL,NULL,1.84); INSERT INTO \"EXERCISE_SET\" VALUES(70,'',44,'beast',NULL,NULL,0.5,0.5,NULL,NULL,NULL,NULL,1.84); INSERT INTO \"EXERCISE_SET\" VALUES(71,'',44,'trifecta',NULL,NULL,0.5,0.5,NULL,NULL,NULL,NULL,1.84); INSERT INTO \"EXERCISE_SET\" VALUES(72,'',49,'sprint',NULL,NULL,0.5,0.5,NULL,NULL,NULL,NULL,0.005); INSERT INTO \"EXERCISE_SET\" VALUES(73,'',49,'super',NULL,NULL,0.5,0.5,NULL,NULL,NULL,NULL,0.005); INSERT INTO \"EXERCISE_SET\" VALUES(74,'',49,'beast',NULL,NULL,0.5,0.5,NULL,NULL,NULL,NULL,0.005); INSERT INTO \"EXERCISE_SET\" VALUES(75,'',49,'trifecta',NULL,NULL,0.5,0.5,NULL,NULL,NULL,NULL,0.005); INSERT INTO \"EXERCISE_SET\" VALUES(76,'',41,'sprint',10,30,NULL,NULL,NULL,NULL,NULL,NULL,11.11); INSERT INTO \"EXERCISE_SET\" VALUES(77,'',41,'super',10,30,NULL,NULL,NULL,NULL,NULL,NULL,11.11); INSERT INTO \"EXERCISE_SET\" VALUES(78,'',41,'beast',10,30,NULL,NULL,NULL,NULL,NULL,NULL,11.11); INSERT INTO \"EXERCISE_SET\" VALUES(79,'',41,'trifecta',10,30,NULL,NULL,NULL,NULL,NULL,NULL,11.11); INSERT INTO \"EXERCISE_SET\" VALUES(80,'',35,'warmup',75,75,NULL,NULL,NULL,NULL,NULL,NULL,17.8575); INSERT INTO \"EXERCISE_SET\" VALUES(81,'',10,'sprint',5,5,NULL,NULL,NULL,NULL,NULL,NULL,3.333); INSERT INTO \"EXERCISE_SET\" VALUES(82,'',10,'super',5,5,NULL,NULL,NULL,NULL,NULL,NULL,3.333); INSERT INTO \"EXERCISE_SET\" VALUES(83,'',10,'beast',5,5,NULL,NULL,NULL,NULL,NULL,NULL,3.333); INSERT INTO \"EXERCISE_SET\" VALUES(84,'',10,'trifecta',5,5,NULL,NULL,NULL,NULL,NULL,NULL,3.333); INSERT INTO \"EXERCISE_SET\" VALUES(85,'',71,'sprint',10,10,NULL,NULL,NULL,NULL,NULL,NULL,2.644); INSERT INTO \"EXERCISE_SET\" VALUES(86,'',71,'super',10,10,NULL,NULL,NULL,NULL,NULL,NULL,2.644); INSERT INTO \"EXERCISE_SET\" VALUES(87,'',71,'beast',10,10,NULL,NULL,NULL,NULL,NULL,NULL,2.644); INSERT INTO \"EXERCISE_SET\" VALUES(88,'',71,'trifecta',10,10,NULL,NULL,NULL,NULL,NULL,NULL,2.644); INSERT INTO \"EXERCISE_SET\" VALUES(89,'',40,'sprint',NULL,NULL,NULL,NULL,0.1,0.25,NULL,NULL,61.25); INSERT INTO \"EXERCISE_SET\" VALUES(90,'',40,'super',NULL,NULL,NULL,NULL,0.1,0.25,NULL,NULL,61.25); INSERT INTO \"EXERCISE_SET\" VALUES(91,'',40,'beast',NULL,NULL,NULL,NULL,0.1,0.25,NULL,NULL,61.25); INSERT INTO \"EXERCISE_SET\" VALUES(92,'',40,'trifecta',NULL,NULL,NULL,NULL,0.1,0.25,NULL,NULL,61.25); INSERT INTO \"EXERCISE_SET\" VALUES(93,'',20,'warmup',NULL,NULL,0.5,0.5,NULL,NULL,NULL,NULL,1.5); INSERT INTO \"EXERCISE_SET\" VALUES(94,'',68,'sprint',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,7.5); INSERT INTO \"EXERCISE_SET\" VALUES(95,'',68,'super',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,7.5); INSERT INTO \"EXERCISE_SET\" VALUES(96,'',68,'beast',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,7.5); INSERT INTO \"EXERCISE_SET\" VALUES(97,'',68,'trifecta',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,7.5); INSERT INTO \"EXERCISE_SET\" VALUES(98,'',74,'sprint',NULL,NULL,0.166,0.166,NULL,NULL,NULL,NULL,0.000166); INSERT INTO \"EXERCISE_SET\" VALUES(99,'',74,'super',NULL,NULL,0.166,0.166,NULL,NULL,NULL,NULL,0.000166); INSERT INTO \"EXERCISE_SET\" VALUES(100,'',74,'beast',NULL,NULL,0.166,0.166,NULL,NULL,NULL,NULL,0.000166); INSERT INTO \"EXERCISE_SET\" VALUES(101,'',74,'trifecta',NULL,NULL,0.166,0.166,NULL,NULL,NULL,NULL,0.000166); INSERT INTO \"EXERCISE_SET\" VALUES(102,'',68,'sprint',NULL,NULL,NULL,NULL,0.125,0.125,NULL,NULL,15.0); INSERT INTO \"EXERCISE_SET\" VALUES(103,'',68,'super',NULL,NULL,NULL,NULL,0.125,0.125,NULL,NULL,15.0); INSERT INTO \"EXERCISE_SET\" VALUES(104,'',68,'beast',NULL,NULL,NULL,NULL,0.125,0.125,NULL,NULL,15.0); INSERT INTO \"EXERCISE_SET\" VALUES(105,'',68,'trifecta',NULL,NULL,NULL,NULL,0.125,0.125,NULL,NULL,15.0); INSERT INTO \"EXERCISE_SET\" VALUES(106,'',74,'sprint',NULL,NULL,0.3333,0.3333,NULL,NULL,NULL,NULL,0.0003333); INSERT INTO \"EXERCISE_SET\" VALUES(107,'',74,'super',NULL,NULL,0.3333,0.3333,NULL,NULL,NULL,NULL,0.0003333); INSERT INTO \"EXERCISE_SET\" VALUES(108,'',74,'beast',NULL,NULL,0.3333,0.3333,NULL,NULL,NULL,NULL,0.0003333); INSERT INTO \"EXERCISE_SET\" VALUES(109,'',74,'trifecta',NULL,NULL,0.3333,0.3333,NULL,NULL,NULL,NULL,0.0003333); INSERT INTO \"EXERCISE_SET\" VALUES(110,'',68,'sprint',NULL,NULL,NULL,NULL,0.1875,0.1875,NULL,NULL,22.5); INSERT INTO \"EXERCISE_SET\" VALUES(111,'',68,'super',NULL,NULL,NULL,NULL,0.1875,0.1875,NULL,NULL,22.5); INSERT INTO \"EXERCISE_SET\" VALUES(112,'',68,'beast',NULL,NULL,NULL,NULL,0.1875,0.1875,NULL,NULL,22.5); INSERT INTO \"EXERCISE_SET\" VALUES(113,'',68,'trifecta',NULL,NULL,NULL,NULL,0.1875,0.1875,NULL,NULL,22.5); INSERT INTO \"EXERCISE_SET\" VALUES(114,'',33,'sprint',NULL,NULL,NULL,NULL,1.5,3.0,NULL,NULL,450.0); INSERT INTO \"EXERCISE_SET\" VALUES(115,'',33,'super',NULL,NULL,NULL,NULL,1.5,3.0,NULL,NULL,450.0); INSERT INTO \"EXERCISE_SET\" VALUES(116,'',33,'beast',NULL,NULL,NULL,NULL,1.5,3.0,NULL,NULL,450.0); INSERT INTO \"EXERCISE_SET\" VALUES(117,'',33,'trifecta',NULL,NULL,NULL,NULL,1.5,3.0,NULL,NULL,450.0); INSERT INTO \"EXERCISE_SET\" VALUES(118,'',33,'warmup',NULL,NULL,NULL,NULL,1.0,1.0,NULL,NULL,200.0); INSERT INTO \"EXERCISE_SET\" VALUES(119,'',10,'sprint',20,20,NULL,NULL,NULL,NULL,NULL,NULL,13.332); INSERT INTO \"EXERCISE_SET\" VALUES(120,'',10,'super',20,20,NULL,NULL,NULL,NULL,NULL,NULL,13.332); INSERT INTO \"EXERCISE_SET\" VALUES(121,'',10,'beast',20,20,NULL,NULL,NULL,NULL,NULL,NULL,13.332); INSERT INTO \"EXERCISE_SET\" VALUES(122,'',10,'trifecta',20,20,NULL,NULL,NULL,NULL,NULL,NULL,13.332); INSERT INTO \"EXERCISE_SET\" VALUES(123,'',40,'sprint',NULL,NULL,NULL,NULL,1.0,1.0,NULL,NULL,350.0); INSERT INTO \"EXERCISE_SET\" VALUES(124,'',40,'super',NULL,NULL,NULL,NULL,1.0,1.0,NULL,NULL,350.0); INSERT INTO \"EXERCISE_SET\" VALUES(125,'',40,'beast',NULL,NULL,NULL,NULL,1.0,1.0,NULL,NULL,350.0); INSERT INTO \"EXERCISE_SET\" VALUES(126,'',40,'trifecta',NULL,NULL,NULL,NULL,1.0,1.0,NULL,NULL,350.0); INSERT INTO \"EXERCISE_SET\" VALUES(127,'',14,'sprint',30,30,NULL,NULL,NULL,NULL,NULL,NULL,4.998); INSERT INTO \"EXERCISE_SET\" VALUES(128,'',14,'super',30,30,NULL,NULL,NULL,NULL,NULL,NULL,4.998); INSERT INTO \"EXERCISE_SET\" VALUES(129,'',14,'beast',30,30,NULL,NULL,NULL,NULL,NULL,NULL,4.998); INSERT INTO \"EXERCISE_SET\" VALUES(130,'',14,'trifecta',30,30,NULL,NULL,NULL,NULL,NULL,NULL,4.998); INSERT INTO \"EXERCISE_SET\" VALUES(131,'',39,'sprint',10,10,NULL,NULL,NULL,NULL,NULL,NULL,1.666); INSERT INTO \"EXERCISE_SET\" VALUES(132,'',39,'super',10,10,NULL,NULL,NULL,NULL,NULL,NULL,1.666); INSERT INTO \"EXERCISE_SET\" VALUES(133,'',39,'beast',10,10,NULL,NULL,NULL,NULL,NULL,NULL,1.666); INSERT INTO \"EXERCISE_SET\" VALUES(134,'',39,'trifecta',10,10,NULL,NULL,NULL,NULL,NULL,NULL,1.666); INSERT INTO \"EXERCISE_SET\" VALUES(135,'',3,'sprint',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,37.99); INSERT INTO \"EXERCISE_SET\" VALUES(136,'',3,'super',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,37.99); INSERT INTO \"EXERCISE_SET\" VALUES(137,'',3,'beast',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,37.99); INSERT INTO \"EXERCISE_SET\" VALUES(138,'',3,'trifecta',NULL,NULL,NULL,NULL,0.0625,0.0625,NULL,NULL,37.99); INSERT INTO \"EXERCISE_SET\" VALUES(139,'',40,'sprint',NULL,NULL,NULL,NULL,0.1,0.1,NULL,NULL,35.0); INSERT INTO \"EXERCISE_SET\" VALUES(140,'',40,'super',NULL,NULL,NULL,NULL,0.1,0.1,NULL,NULL,35.0); INSERT INTO \"EXERCISE_SET\" VALUES(141,'',40,'beast',NULL,NULL,NULL,NULL,0.1,0.1,NULL,NULL,35.0); INSERT INTO \"EXERCISE_SET\" VALUES(142,'',40,'trifecta',NULL,NULL,NULL,NULL,0.1,0.1,NULL,NULL,35.0); INSERT INTO \"EXERCISE_SET\" VALUES(143,'',49,'sprint',NULL,NULL,2.0,2.0,NULL,NULL,NULL,NULL,0.02); INSERT INTO \"EXERCISE_SET\" VALUES(144,'',49,'super',NULL,NULL,2.0,2.0,NULL,NULL,NULL,NULL,0.02); INSERT INTO \"EXERCISE_SET\" VALUES(145,'',49,'beast',NULL,NULL,2.0,2.0,NULL,NULL,NULL,NULL,0.02); INSERT INTO \"EXERCISE_SET\" VALUES(146,'',49,'trifecta',NULL,NULL,2.0,2.0,NULL,NULL,NULL,NULL,0.02); INSERT INTO \"EXERCISE_SET\" VALUES(147,'',40,'sprint',NULL,NULL,NULL,NULL,0.25,0.25,NULL,NULL,87.5); INSERT INTO \"EXERCISE_SET\" VALUES(148,'',40,'super',NULL,NULL,NULL,NULL,0.25,0.25,NULL,NULL,87.5); INSERT INTO \"EXERCISE_SET\" VALUES(149,'',40,'beast',NULL,NULL,NULL,NULL,0.25,0.25,NULL,NULL,87.5); INSERT INTO \"EXERCISE_SET\" VALUES(150,'',40,'trifecta',NULL,NULL,NULL,NULL,0.25,0.25,NULL,NULL,87.5); INSERT INTO \"EXERCISE_SET\" VALUES(151,'',49,'sprint',NULL,NULL,3.0,3.0,NULL,NULL,NULL,NULL,0.03); INSERT INTO \"EXERCISE_SET\" VALUES(152,'',49,'super',NULL,NULL,3.0,3.0,NULL,NULL,NULL,NULL,0.03); INSERT INTO \"EXERCISE_SET\" VALUES(153,'',49,'beast',NULL,NULL,3.0,3.0,NULL,NULL,NULL,NULL,0.03); INSERT INTO \"EXERCISE_SET\" VALUES(154,'',49,'trifecta',NULL,NULL,3.0,3.0,NULL,NULL,NULL,NULL,0.03); INSERT INTO \"EXERCISE_SET\" VALUES(155,'',40,'sprint',NULL,NULL,NULL,NULL,2.0,3.0,NULL,NULL,875.0); INSERT INTO \"EXERCISE_SET\" VALUES(156,'',40,'super',NULL,NULL,NULL,NULL,2.0,3.0,NULL,NULL,875.0); INSERT INTO \"EXERCISE_SET\" VALUES(157,'',40,'beast',NULL,NULL,NULL,NULL,2.0,3.0,NULL,NULL,875.0); INSERT INTO \"EXERCISE_SET\" VALUES(158,'',40,'trifecta',NULL,NULL,NULL,NULL,2.0,3.0,NULL,NULL,875.0); INSERT INTO \"EXERCISE_SET\" VALUES(159,'',40,'sprint',NULL,NULL,NULL,NULL,3.0,4.0,NULL,NULL,1225.0); INSERT INTO \"EXERCISE_SET\" VALUES(160,'',40,'super',NULL,NULL,NULL,NULL,3.0,4.0,NULL,NULL,1225.0); INSERT INTO \"EXERCISE_SET\" VALUES(161,'',40,'beast',NULL,NULL,NULL,NULL,3.0,4.0,NULL,NULL,1225.0); INSERT INTO \"EXERCISE_SET\" VALUES(162,'',40,'trifecta',NULL,NULL,NULL,NULL,3.0,4.0,NULL,NULL,1225.0); INSERT INTO \"EXERCISE_SET\" VALUES(163,'',40,'beast',NULL,NULL,NULL,NULL,4.0,5.0,NULL,NULL,1575.0); INSERT INTO \"EXERCISE_SET\" VALUES(164,'',40,'trifecta',NULL,NULL,NULL,NULL,5.0,6.0,NULL,NULL,1925.0); CREATE TABLE EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID INTEGER PRIMARY KEY ASC,                               SET_OF_SETS_ID INTEGER,                               EXERCISE_SET_ID INTEGER, SET_ORDER INTEGER,                               FOREIGN KEY(SET_OF_SETS_ID) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                               FOREIGN KEY(EXERCISE_SET_ID) REFERENCES EXERCISE_SET(EXERCISE_SET_ID)); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(1,1,1,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(2,1,2,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(3,2,3,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(4,2,7,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(5,2,11,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(6,2,7,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(7,2,3,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(8,2,11,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(9,3,4,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(10,3,8,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(11,3,12,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(12,3,8,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(13,3,4,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(14,3,12,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(15,4,5,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(16,4,9,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(17,4,13,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(18,4,9,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(19,4,5,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(20,4,13,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(21,5,6,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(22,5,10,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(23,5,14,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(24,5,10,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(25,5,6,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(26,5,14,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(27,6,15,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(28,7,1,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(29,8,16,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(30,9,17,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(31,10,18,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(32,11,19,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(33,12,15,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(34,13,1,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(35,18,15,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(36,14,20,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(37,14,24,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(38,14,28,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(39,14,32,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(40,14,36,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(41,14,40,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(42,15,21,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(43,15,25,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(44,15,29,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(45,15,33,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(46,15,37,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(47,15,41,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(48,16,22,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(49,16,26,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(50,16,34,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(51,16,38,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(52,16,42,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(53,17,23,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(54,17,27,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(55,17,31,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(56,17,35,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(57,17,39,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(58,17,43,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(59,20,15,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(60,19,44,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(61,19,45,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(62,19,46,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(63,19,47,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(64,21,48,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(65,21,48,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(66,21,48,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(67,21,48,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(68,21,48,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(69,21,48,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(70,21,48,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(71,21,48,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(72,21,48,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(73,21,48,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(74,21,48,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(75,21,48,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(76,21,48,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(77,21,48,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(78,21,48,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(79,22,49,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(80,22,49,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(81,22,49,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(82,22,49,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(83,22,49,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(84,22,49,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(85,22,49,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(86,22,49,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(87,22,49,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(88,22,49,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(89,22,49,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(90,22,49,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(91,22,49,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(92,22,49,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(93,22,49,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(94,23,50,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(95,23,50,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(96,23,50,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(97,23,50,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(98,23,50,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(99,23,50,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(100,23,50,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(101,23,50,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(102,23,50,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(103,23,50,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(104,23,50,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(105,23,50,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(106,23,50,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(107,23,50,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(108,23,50,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(109,24,51,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(110,24,51,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(111,24,51,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(112,24,51,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(113,24,51,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(114,24,51,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(115,24,51,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(116,24,51,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(117,24,51,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(118,24,51,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(119,24,51,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(120,24,51,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(121,24,51,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(122,24,51,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(123,24,51,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(124,21,52,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(125,22,53,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(126,23,54,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(127,24,55,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(128,25,56,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(129,25,58,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(130,30,15,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(131,26,60,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(132,27,61,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(133,28,62,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(134,29,63,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(135,26,64,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(136,26,64,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(137,27,65,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(138,27,65,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(139,28,66,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(140,28,66,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(141,29,67,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(142,29,67,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(143,26,68,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(144,27,69,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(145,28,70,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(146,29,71,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(147,26,72,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(148,27,73,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(149,28,74,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(150,29,75,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(151,26,60,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(152,27,61,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(153,28,62,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(154,29,63,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(155,26,76,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(156,26,76,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(157,27,77,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(158,27,77,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(159,28,78,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(160,28,78,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(161,29,79,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(162,29,79,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(163,26,68,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(164,27,65,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(165,28,70,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(166,29,71,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(167,31,80,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(168,36,15,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(169,32,81,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(170,33,82,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(171,34,83,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(172,35,84,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(173,32,85,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(174,33,86,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(175,34,87,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(176,35,88,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(177,32,89,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(178,33,90,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(179,34,91,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(180,35,92,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(182,38,15,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(183,37,93,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(184,37,93,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(185,37,93,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(186,37,93,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(187,37,93,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(188,37,93,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(189,39,94,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(190,39,98,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(191,39,94,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(192,39,98,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(193,39,94,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(194,39,98,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(195,39,94,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(196,39,98,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(197,39,94,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(198,39,98,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(199,39,94,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(200,39,98,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(201,39,94,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(202,39,98,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(203,39,94,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(204,39,98,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(205,39,94,17); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(206,39,98,18); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(207,39,94,19); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(208,39,98,20); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(209,39,102,21); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(210,39,106,22); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(211,39,102,23); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(212,39,106,24); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(213,39,102,25); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(214,39,106,26); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(215,39,102,27); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(216,39,106,28); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(217,39,110,29); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(218,39,72,30); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(219,39,110,31); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(220,39,98,32); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(221,39,114,33); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(222,40,95,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(223,40,99,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(224,40,95,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(225,40,99,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(226,40,95,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(227,40,99,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(228,40,95,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(229,40,99,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(230,40,95,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(231,40,99,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(232,40,95,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(233,40,99,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(234,40,95,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(235,40,99,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(236,40,95,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(237,40,99,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(238,40,95,17); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(239,40,99,18); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(240,40,95,19); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(241,40,99,20); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(242,40,103,21); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(243,40,107,22); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(244,40,103,23); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(245,40,107,24); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(246,40,103,25); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(247,40,107,26); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(248,40,103,27); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(249,40,107,28); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(250,40,103,29); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(251,40,107,30); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(252,40,111,31); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(253,40,73,32); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(254,40,111,33); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(255,40,73,34); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(256,40,115,35); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(257,41,96,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(258,41,100,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(259,41,96,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(260,41,100,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(261,41,96,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(262,41,100,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(263,41,96,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(264,41,100,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(265,41,96,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(266,41,100,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(267,41,96,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(268,41,100,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(269,41,96,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(270,41,100,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(271,41,96,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(272,41,100,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(273,41,96,17); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(274,41,100,18); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(275,41,96,19); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(276,41,100,20); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(277,41,104,21); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(278,41,108,22); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(279,41,104,23); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(280,41,108,24); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(281,41,104,25); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(282,41,108,26); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(283,41,104,27); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(284,41,108,28); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(285,41,104,29); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(286,41,108,30); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(287,41,112,31); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(288,41,74,32); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(289,41,112,33); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(290,41,74,34); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(291,41,116,35); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(292,42,97,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(293,42,101,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(294,42,97,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(295,42,101,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(296,42,97,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(297,42,101,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(298,42,97,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(299,42,101,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(300,42,97,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(301,42,101,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(302,42,97,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(303,42,101,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(304,42,97,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(305,42,101,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(306,42,97,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(307,42,101,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(308,42,97,17); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(309,42,101,18); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(310,42,97,19); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(311,42,101,20); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(312,42,105,21); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(313,42,109,22); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(314,42,105,23); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(315,42,109,24); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(316,42,105,25); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(317,42,109,26); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(318,42,105,27); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(319,42,109,28); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(320,42,105,29); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(321,42,109,30); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(322,42,113,31); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(323,42,75,32); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(324,42,113,33); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(325,42,75,34); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(326,42,117,35); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(327,44,15,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(328,43,80,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(329,43,118,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(330,43,93,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(331,43,93,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(332,43,93,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(333,43,93,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(334,43,93,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(335,43,93,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(336,45,119,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(337,46,120,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(338,47,121,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(339,48,122,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(340,45,123,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(341,46,124,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(342,47,125,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(343,48,126,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(344,45,127,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(345,46,128,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(346,47,129,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(347,48,130,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(348,45,131,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(349,46,132,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(350,47,133,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(351,48,134,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(352,45,68,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(353,46,69,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(354,47,70,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(355,48,71,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(356,45,135,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(357,45,135,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(358,45,135,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(359,46,136,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(360,46,136,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(361,46,136,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(362,47,137,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(363,47,137,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(364,47,137,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(365,48,138,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(366,48,138,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(367,48,138,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(368,53,15,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(369,54,93,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(370,54,93,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(371,54,93,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(372,54,93,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(373,54,93,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(374,54,93,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(375,54,56,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(376,49,139,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(377,49,143,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(378,49,139,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(379,49,143,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(380,49,139,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(381,49,143,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(382,49,139,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(383,49,143,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(384,49,139,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(385,49,143,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(386,49,139,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(387,49,143,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(388,49,139,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(389,49,143,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(390,49,139,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(391,49,143,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(392,49,139,17); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(393,49,143,18); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(394,49,139,19); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(395,49,143,20); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(396,49,139,21); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(397,49,143,22); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(398,49,139,23); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(399,49,143,24); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(400,49,139,25); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(401,49,143,26); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(402,49,139,27); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(403,49,143,28); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(404,49,139,29); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(405,49,143,30); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(406,50,140,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(407,50,144,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(408,50,140,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(409,50,144,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(410,50,140,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(411,50,144,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(412,50,140,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(413,50,144,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(414,50,140,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(415,50,144,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(416,50,140,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(417,50,144,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(418,50,140,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(419,50,144,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(420,50,140,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(421,50,144,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(422,50,140,17); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(423,50,144,18); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(424,50,140,19); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(425,50,144,20); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(426,50,140,21); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(427,50,144,22); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(428,50,140,23); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(429,50,144,24); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(430,50,140,25); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(431,50,144,26); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(432,50,140,27); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(433,50,144,28); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(434,50,140,29); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(435,50,144,30); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(436,51,141,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(437,51,145,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(438,51,141,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(439,51,145,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(440,51,141,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(441,51,145,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(442,51,141,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(443,51,145,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(444,51,141,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(445,51,145,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(446,51,141,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(447,51,145,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(448,51,141,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(449,51,145,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(450,51,141,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(451,51,145,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(452,51,141,17); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(453,51,145,18); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(454,51,141,19); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(455,51,145,20); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(456,51,141,21); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(457,51,145,22); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(458,51,141,23); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(459,51,145,24); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(460,51,141,25); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(461,51,145,26); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(462,51,141,27); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(463,51,145,28); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(464,51,141,29); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(465,51,145,30); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(466,52,142,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(467,52,146,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(468,52,142,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(469,52,146,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(470,52,142,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(471,52,146,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(472,52,142,7); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(473,52,146,8); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(474,52,142,9); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(475,52,146,10); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(476,52,142,11); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(477,52,146,12); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(478,52,142,13); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(479,52,146,14); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(480,52,142,15); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(481,52,146,16); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(482,52,142,17); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(483,52,146,18); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(484,52,142,19); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(485,52,146,20); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(486,52,142,21); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(487,52,146,22); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(488,52,142,23); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(489,52,146,24); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(490,52,142,25); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(491,52,146,26); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(492,52,142,27); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(493,52,146,28); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(494,52,142,29); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(495,52,146,30); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(496,49,147,31); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(497,49,151,32); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(498,49,147,33); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(499,49,151,34); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(500,49,147,35); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(501,49,151,36); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(502,49,147,37); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(503,49,151,38); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(504,49,147,39); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(505,49,151,40); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(506,49,147,41); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(507,49,151,42); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(508,49,147,43); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(509,49,151,44); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(510,49,147,45); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(511,49,151,46); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(512,50,148,31); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(513,50,152,32); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(514,50,148,33); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(515,50,152,34); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(516,50,148,35); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(517,50,152,36); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(518,50,148,37); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(519,50,152,38); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(520,50,148,39); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(521,50,152,40); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(522,50,148,41); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(523,50,152,42); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(524,50,148,43); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(525,50,152,44); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(526,50,148,45); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(527,50,152,46); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(528,51,149,31); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(529,51,153,32); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(530,51,149,33); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(531,51,153,34); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(532,51,149,35); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(533,51,153,36); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(534,51,149,37); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(535,51,153,38); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(536,51,149,39); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(537,51,153,40); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(538,51,149,41); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(539,51,153,42); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(540,51,149,43); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(541,51,153,44); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(542,51,149,45); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(543,51,153,46); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(544,52,150,31); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(545,52,154,32); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(546,52,150,33); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(547,52,154,34); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(548,52,150,35); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(549,52,154,36); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(550,52,150,37); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(551,52,154,38); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(552,52,150,39); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(553,52,154,40); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(554,52,150,41); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(555,52,154,42); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(556,52,150,43); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(557,52,154,44); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(558,52,150,45); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(559,52,154,46); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(560,49,155,47); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(561,50,160,47); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(562,51,163,47); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(563,52,164,47); COMMIT;";

  db.exec(sqlstr);
}
