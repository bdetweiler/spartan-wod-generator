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
             + "   SET COOLDOWN_SET = " + setOfSetsId + " ";
             + " WHERE SPARTAN_WOD_ID = " + spartanWODId + ";";
    } else {
      sqlstr = "UPDATE SPARTAN_WOD"
             + "   SET MAIN_SET_" + setType + ' = ' + setOfSetsId + " ";
             + " WHERE SPARTAN_WOD_ID = " + spartanWODId + ";";
    }

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
var sqlstr = "CREATE TABLE SET_OF_SETS(SET_OF_SETS_ID INTEGER PRIMARY KEY ASC,                          CATEGORY VARCHAR,                         REPS_MIN INTEGER,                         REPS_MAX INTEGER,                         DURATION_MIN FLOAT,                         DURATION_MAX FLOAT,                         DIST_MIN FLOAT,                         DIST_MAX FLOAT,                         REST_DURATION_MIN FLOAT,                         REST_DURATION_MAX FLOAT,                         TYPE VARCHAR,                         CALORIES FLOAT); INSERT INTO \"SET_OF_SETS\" VALUES(1,'warmup',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'warmup',45.0); INSERT INTO \"SET_OF_SETS\" VALUES(2,'sprint',1,2,NULL,NULL,NULL,NULL,NULL,NULL,'sprint',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(3,'super',2,3,NULL,NULL,NULL,NULL,NULL,NULL,'super',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(4,'beast',3,4,NULL,NULL,NULL,NULL,NULL,NULL,'beast',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(5,'trifecta',4,5,NULL,NULL,NULL,NULL,NULL,NULL,'trifecta',0.0); INSERT INTO \"SET_OF_SETS\" VALUES(6,'cooldown',1,1,NULL,NULL,NULL,NULL,NULL,NULL,'cooldown',0.0); CREATE TABLE SPARTAN_WOD(SPARTAN_WOD_ID INTEGER PRIMARY KEY ASC,                         NAME VARCHAR,                         CATEGORY VARCHAR,                         QUOTE VARCHAR,                         QUOTE_BY VARCHAR,                         DESCRIPTION VARCHAR,                         SPECIAL_DAY VARCHAR,                         WARMUP_SET INTEGER,                         MAIN_SET_SPRINT INTEGER,                         MAIN_SET_SUPER INTEGER,                         MAIN_SET_BEAST INTEGER,                         MAIN_SET_TRIFECTA INTEGER,                         COOLDOWN_SET INTEGER,                         FOREIGN KEY(WARMUP_SET) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(MAIN_SET_SPRINT) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(MAIN_SET_SUPER) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(MAIN_SET_BEAST) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(MAIN_SET_TRIFECTA) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                         FOREIGN KEY(COOLDOWN_SET) REFERENCES SET_OF_SETS(SET_OF_SETS_ID)); INSERT INTO \"SPARTAN_WOD\" VALUES(1,'A Work of Art','athleticism','The human foot is a masterpiece of engineering and a work of art.','Leonardo da Vinci','Put those feet to good use in this workout. Celebrate your abilities by maximizing them.',NULL,1,2,3,4,5,6); CREATE TABLE EXERCISE(EXERCISE_ID INTEGER PRIMARY KEY ASC,                      NAME VARCHAR,                      CATEGORY VARCHAR,                      DEMO_URL VARCHAR,                      GENERAL_MUSCLE_GROUP VARCHAR,                      TARGET_MUSCLE_GROUP VARCHAR,                      LOC_INDOORS INTEGER,                      LOC_OUTDOORS INTEGER,                      EQ_JUMP_ROPE INTEGER,                      EQ_PULLUP_BAR INTEGER,                      EQ_WEIGHTS INTEGER,                      EQ_KETTLE_BELLS INTEGER,                      EQ_HEAVY_OBJECT INTEGER,                      EQ_TRX INTEGER,                      EQ_MED_BALL INTEGER,                      EQ_BOX INTEGER,                      EQ_SQUAT_RACK INTEGER,                      EQ_TREADMILL INTEGER,                      EQ_TRACK INTEGER,                      EQ_TRAIL INTEGER,                      EQ_HILLS INTEGER,                      EQ_POOL INTEGER,                      EQ_BIKE INTEGER,                      EQ_ROW_MACHINE INTEGER,                      EQ_ROPE,                      CALORIES FLOAT,                      CALORIES_MEASURED_IN VARCHAR); INSERT INTO \"EXERCISE\" VALUES(1,'arm curls','strength','https://www.youtube.com/watch?v=kwG2ipFRgfo','upper body','arms',2,2,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0.23333,'reps'); INSERT INTO \"EXERCISE\" VALUES(2,'back extension','strength','https://www.youtube.com/watch?v=Bw9YuQTTc58','upper body','back',2,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0.23333,'reps'); INSERT INTO \"EXERCISE\" VALUES(3,'bear crawl','athleticism','https://www.youtube.com/watch?v=WMXbyYpZ9oY','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,607.84,'miles'); INSERT INTO \"EXERCISE\" VALUES(4,'belly crawl','athleticism','https://www.youtube.com/watch?v=cLwS1xkOLas','upper body','arms',2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,300.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(5,'bodyweight circuit','strength','','full body','full body',2,2,0,2,0,0,0,2,0,2,0,0,2,2,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(6,'bodyweight squat','strength','https://www.youtube.com/watch?v=p3g4wAsu0R4','lower body','legs',2,2,0,0,0,0,0,2,0,0,0,0,2,2,0,0,0,0,0,0.5787,'reps'); INSERT INTO \"EXERCISE\" VALUES(7,'box jump','strength','https://www.youtube.com/watch?v=hxldG9FX4j4','lower body','legs',2,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.5,'reps'); INSERT INTO \"EXERCISE\" VALUES(8,'box jump burpee','athleticism','https://www.youtube.com/watch?v=kiOcwv7YE6c','full body','full body',2,2,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(9,'brazilian ab twist','strength','https://www.youtube.com/watch?v=iUk5T87cf34','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0.1227,'reps'); INSERT INTO \"EXERCISE\" VALUES(10,'burpee','athleticism','https://www.youtube.com/watch?v=JZQA08SlJnM','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(11,'burpee pull-up','strength','https://www.youtube.com/watch?v=kAvZoa5iexA','full body','full body',2,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(12,'chest pass','athleticism','https://www.youtube.com/watch?v=FUdcjZ0weic','upper body','chest',2,2,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0.5427,'reps'); INSERT INTO \"EXERCISE\" VALUES(13,'chore','active rest','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3.0,'minutes'); INSERT INTO \"EXERCISE\" VALUES(14,'crunch','strength','https://www.youtube.com/watch?v=Xyd_fa5zoEU','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.1666,'reps'); INSERT INTO \"EXERCISE\" VALUES(15,'curl','strength','https://www.youtube.com/watch?v=oUqgPSZmhro','upper body','arms',2,2,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0.23333,'reps'); INSERT INTO \"EXERCISE\" VALUES(16,'cycling','endurance','','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,0,2,2,0,1,0,0,14.0,'minutes'); INSERT INTO \"EXERCISE\" VALUES(17,'dog walking','active rest','','lower body','legs',0,1,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,60.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(18,'double leg butt kicks','warmup','https://www.youtube.com/watch?v=F5iYMAkGaY8','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(19,'drop push-up','strength','https://www.youtube.com/watch?v=y9aAhXt2wYk','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(20,'dynamic warm up','warmup','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,3.0,'minutes'); INSERT INTO \"EXERCISE\" VALUES(21,'easy jog','warmup','https://www.youtube.com/watch?v=BgZdwy1FO4Y','full body','full body',2,2,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,136.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(22,'explosive broad jump','athleticism','https://www.youtube.com/watch?v=ko22JMOkzQQ','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.6666,'reps'); INSERT INTO \"EXERCISE\" VALUES(23,'flutter kick','strength','https://www.youtube.com/watch?v=ANVdMDaYRts','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.1666,'reps'); INSERT INTO \"EXERCISE\" VALUES(24,'glute kickback','athleticism','https://www.youtube.com/watch?v=h4439IQFAqI','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(25,'handstand hold','strength','https://www.youtube.com/watch?v=h4439IQFAqI','upper body','arms',2,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,8.2,'minutes'); INSERT INTO \"EXERCISE\" VALUES(26,'hanging knee raise','strength','https://www.youtube.com/watch?v=PGSKkNB1Oyk','full body','core',2,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2666,'reps'); INSERT INTO \"EXERCISE\" VALUES(27,'high knee','warmup','https://www.youtube.com/watch?v=8opcQdC-V-U','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(28,'hiking','active rest','','full body','full body',0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,70.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(29,'hill interval','athleticism','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,2,0,2,1,0,0,0,0,100.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(30,'inverted pull-up','strength','https://www.youtube.com/watch?v=lgsyUiB6occ','upper body','upper body',1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0.2733,'reps'); INSERT INTO \"EXERCISE\" VALUES(31,'isometric lunge hold','strength','https://www.youtube.com/watch?v=u-bhL8zo570','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,8.2,'minutes'); INSERT INTO \"EXERCISE\" VALUES(32,'isometric wiper','strength','https://www.youtube.com/watch?v=VxrSMH5vVWY','upper body','arms',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(33,'jog','endurance','https://www.youtube.com/watch?v=VxrSMH5vVWY','full body','full body',2,2,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,200.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(34,'jump rope','warmup','https://www.youtube.com/watch?v=GRStB06uhgE','full body','full body',2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14.288,'minutes'); INSERT INTO \"EXERCISE\" VALUES(35,'jumping jack','warmup','https://www.youtube.com/watch?v=c4DAnQ6DtF8','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.2381,'reps'); INSERT INTO \"EXERCISE\" VALUES(36,'jumping lunge','athleticism','https://www.youtube.com/watch?v=Kw4QpPfX-cU','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(37,'kettle bell 1-arm overhead farmer''s carry','strength','https://www.youtube.com/watch?v=uT1LV1eLcdM','upper body','upper body',2,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,100.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(38,'kettle bell swing','strength','https://www.youtube.com/watch?v=OopKTfLiz48','full body','full body',2,2,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(39,'laying leg raise','athleticism','https://www.youtube.com/watch?v=xqTh6NqbAtM','lower body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.1666,'reps'); INSERT INTO \"EXERCISE\" VALUES(40,'run','endurance','https://www.youtube.com/watch?v=wCVSv7UxB2E','full body','full body',2,2,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,350.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(41,'mountain climber','endurance','https://www.youtube.com/watch?v=nmwgirgXLYM','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.5555,'reps'); INSERT INTO \"EXERCISE\" VALUES(42,'muscle-up','strength','https://youtu.be/ZEDY9QNBKe4','upper body','upper body',1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(43,'pistol squat','strength','https://www.youtube.com/watch?v=7NvOuty_Fnc','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,1.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(44,'plank','strength','https://www.youtube.com/watch?v=pSHjTRCQxIw','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,3.68,'minutes'); INSERT INTO \"EXERCISE\" VALUES(45,'plyometric push-up','strength','https://www.youtube.com/watch?v=mgkyTtQ0ODE','upper body','upper body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.4,'reps'); INSERT INTO \"EXERCISE\" VALUES(46,'power skip','warmup','https://www.youtube.com/watch?v=NCY9gFsZk9Y','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(47,'pull-up','warmup','https://www.youtube.com/watch?v=NCY9gFsZk9Y','upper body','upper body',2,2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1.0,'reps'); INSERT INTO \"EXERCISE\" VALUES(48,'push-up','warmup','https://www.youtube.com/watch?v=NCY9gFsZk9Y','upper body','upper body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.384,'reps'); INSERT INTO \"EXERCISE\" VALUES(49,'recover','rest','https://www.youtube.com/watch?v=NCY9gFsZk9Y','full body','full body',2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0.01,'minutes'); INSERT INTO \"EXERCISE\" VALUES(50,'rope climb','rest','https://www.youtube.com/watch?v=AD0uO7JGdZU','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1.32,'reps'); INSERT INTO \"EXERCISE\" VALUES(51,'row','endurance','','full body','full body',1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,8.21,'minutes'); INSERT INTO \"EXERCISE\" VALUES(52,'sandbag/medicine ball slam','strength','https://www.youtube.com/watch?v=Y2wSD7spnxk','full body','full body',2,2,0,0,0,0,0,0,1,0,0,0,2,2,0,0,0,0,0,0.2,'reps'); INSERT INTO \"EXERCISE\" VALUES(53,'sandbag squat','strength','https://www.youtube.com/watch?v=U9yK6rHy40A','lower body','lower body',2,2,0,0,2,2,2,0,2,0,0,0,2,2,0,0,0,0,0,0.3,'reps'); INSERT INTO \"EXERCISE\" VALUES(54,'sandbag squat throw','strength','https://www.youtube.com/watch?v=R-zLekvxzpg','full body','full body',2,2,0,0,0,0,2,0,2,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(55,'shuttle run','strength','https://www.youtube.com/watch?v=Zcj_xdwLnNc','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,400.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(56,'side kick','warmup','https://www.youtube.com/watch?v=MsmmbeXJ6Lw','lower body','lower body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.18,'reps'); INSERT INTO \"EXERCISE\" VALUES(57,'side plank','strength','https://www.youtube.com/watch?v=6cRAFji80CQ','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,3.68,'minutes'); INSERT INTO \"EXERCISE\" VALUES(58,'side-to-side hop','athleticism','https://www.youtube.com/watch?v=_AVX9cpPzks','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.2381,'reps'); INSERT INTO \"EXERCISE\" VALUES(59,'sit-up','strength','https://www.youtube.com/watch?v=1fbU_MkV7NE','upper body','core',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.1666,'reps'); INSERT INTO \"EXERCISE\" VALUES(60,'speed skater','athleticism','https://www.youtube.com/watch?v=EkESodXYDRM','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.2381,'reps'); INSERT INTO \"EXERCISE\" VALUES(61,'spiderman push-up','strength','https://www.youtube.com/watch?v=fKBeHALPsSU','upper body','upper body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.4,'reps'); INSERT INTO \"EXERCISE\" VALUES(62,'squat jump','strength','https://www.youtube.com/watch?v=DeTBwEL4m7s','lower body','lower body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(63,'star jump','athleticism','https://www.youtube.com/watch?v=h6wu4_LOhyU','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(64,'stretch','cooldown','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.01,'minutes'); INSERT INTO \"EXERCISE\" VALUES(65,'swimming','endurance','','full body','full body',2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,8.3333,'minutes'); INSERT INTO \"EXERCISE\" VALUES(66,'trail run','endurance','','full body','full body',0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,350.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(67,'tricep overhead extension','strength','https://www.youtube.com/watch?v=YbX7Wd8jQ-Q','upper body','arms',2,2,0,0,2,2,2,0,0,0,0,0,0,2,0,0,0,0,0,0.2733,'reps'); INSERT INTO \"EXERCISE\" VALUES(68,'uphill dash','athleticism','','full body','full body',0,1,0,0,0,0,0,0,0,0,0,0,0,2,1,0,0,0,0,120.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(69,'vertical jump','athleticism','https://www.youtube.com/watch?v=K9zzVwMyD1g','lower body','lower body',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.3333,'reps'); INSERT INTO \"EXERCISE\" VALUES(70,'walk','active rest','','lower body','lower body',2,2,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,50.0,'miles'); INSERT INTO \"EXERCISE\" VALUES(71,'walking lunge','strength','https://www.youtube.com/watch?v=L8fvypPrzzs','lower body','legs',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.2644,'reps'); INSERT INTO \"EXERCISE\" VALUES(72,'wide push-up','strength','https://www.youtube.com/watch?v=B78GwfC-87Y','upper body','chest',2,2,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0.384,'reps'); CREATE TABLE EXERCISE_SET(EXERCISE_SET_ID INTEGER PRIMARY KEY ASC,                          DIRECTION VARCHAR,                          EXERCISE_ID INTEGER,                          TYPE VARCHAR,                          REPS_MIN INTEGER,                          REPS_MAX INTEGER,                          DURATION_MIN FLOAT,                          DURATION_MAX FLOAT,                          DIST_MIN FLOAT,                          DIST_MAX FLOAT,                          REST_DURATION_MIN INTEGER,                          REST_DURATION_MAX INTEGER,                          CALORIES FLOAT,                          FOREIGN KEY(EXERCISE_ID) REFERENCES EXERCISE(EXERCISE_ID)); INSERT INTO \"EXERCISE_SET\" VALUES(1,NULL,20,'warmup',NULL,NULL,5.0,10.0,NULL,NULL,NULL,NULL,45.0); INSERT INTO \"EXERCISE_SET\" VALUES(2,NULL,40,'warmup',NULL,NULL,10.0,10.0,NULL,NULL,NULL,NULL,350.0); INSERT INTO \"EXERCISE_SET\" VALUES(3,'',40,'sprint',NULL,NULL,NULL,NULL,0.5,0.5,NULL,NULL,175.0); INSERT INTO \"EXERCISE_SET\" VALUES(4,'',40,'super',NULL,NULL,NULL,NULL,0.5,0.5,NULL,NULL,175.0); INSERT INTO \"EXERCISE_SET\" VALUES(5,'',40,'beast',NULL,NULL,NULL,NULL,0.5,0.5,NULL,NULL,175.0); INSERT INTO \"EXERCISE_SET\" VALUES(6,'',40,'trifecta',NULL,NULL,NULL,NULL,0.5,0.5,NULL,NULL,175.0); INSERT INTO \"EXERCISE_SET\" VALUES(7,'',10,'sprint',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(8,'',10,'super',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(9,'',10,'beast',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(10,'',10,'trifecta',10,10,NULL,NULL,NULL,NULL,NULL,NULL,6.666); INSERT INTO \"EXERCISE_SET\" VALUES(11,'',70,'sprint',NULL,NULL,NULL,NULL,0.125,0.25,NULL,NULL,9.375); INSERT INTO \"EXERCISE_SET\" VALUES(12,'',70,'super',NULL,NULL,NULL,NULL,0.125,0.25,NULL,NULL,9.375); INSERT INTO \"EXERCISE_SET\" VALUES(13,'',70,'beast',NULL,NULL,NULL,NULL,0.125,0.25,NULL,NULL,9.375); INSERT INTO \"EXERCISE_SET\" VALUES(14,'',70,'trifecta',NULL,NULL,NULL,NULL,0.125,0.25,NULL,NULL,9.375); INSERT INTO \"EXERCISE_SET\" VALUES(15,'',64,'cooldown',NULL,NULL,5.0,10.0,NULL,NULL,NULL,NULL,0.075); CREATE TABLE EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID INTEGER PRIMARY KEY ASC,                               SET_OF_SETS_ID INTEGER,                               EXERCISE_SET_ID INTEGER,                               SET_ORDER INTEGER,                               FOREIGN KEY(SET_OF_SETS_ID) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),                               FOREIGN KEY(EXERCISE_SET_ID) REFERENCES EXERCISE_SET(EXERCISE_SET_ID)); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(1,1,1,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(2,1,2,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(3,2,3,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(4,2,7,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(5,2,11,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(6,2,7,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(7,2,3,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(8,2,11,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(9,3,4,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(10,3,8,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(11,3,12,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(12,3,8,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(13,3,4,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(14,3,12,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(15,4,5,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(16,4,9,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(17,4,13,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(18,4,9,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(19,4,5,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(20,4,13,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(21,5,6,1); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(22,5,10,2); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(23,5,14,3); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(24,5,10,4); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(25,5,6,5); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(26,5,14,6); INSERT INTO \"EXERCISE_SET_JOIN\" VALUES(27,6,15,1); INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(73, 'yoga', 'active recovery', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.1, 'minutes'); INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(74, 'recover', 'active recovery', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0.001, 'minutes'); INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(75, 'medicine ball situp', 'strength', '', 'upper body', 'abs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.001, 'minutes'); ";

  db.exec(sqlstr);
}
