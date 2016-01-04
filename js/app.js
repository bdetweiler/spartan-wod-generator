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
  });

  $('#copy_sprint_set').click(function() {
    copySprintSet();
  });

  $('#copy_sprint_exercise').click(function() {
    copySprintExerciseSet();
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
    saveWarmupSet(db);
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

function saveWarmupSet(db) {

  var setCategory = 'warmup';
  var setType = 'warmup';

  var repsMin = parseFloat($('#warmup_reps_min').val());
  var repsMax = parseFloat($('#warmup_reps_max').val());

  var durationMin = parseFloat($('#warmup_duration_min').val());
  var durationMax = parseFloat($('#warmup_duration_max').val());

  var distanceMin = parseFloat($('#warmup_distance_min').val());
  var distanceMax = parseFloat($('#warmup_distance_max').val());

  var restMin = parseFloat($('#warmup_rest_min').val());
  var restMax = parseFloat($('#warmup_rest_max').val());

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
  
  sqlstr = "SELECT * "
         + "  FROM SET_OF_SETS"
         + " WHERE SET_OF_SETS_ID IN (SELECT WARMUP_SET"
         + "                            FROM SPARTAN_WOD"
         + "                           WHERE SPARTAN_WOD_ID = " + spartanWODId + ");";

  var rs = db.exec(sqlstr);

  if (rs.length == 0) {

    sqlstr = "SELECT MAX(SET_OF_SETS_ID) FROM SET_OF_SETS";
    rs = db.exec(sqlstr);
    
    var setOfSetsId = 1;

    if (rs[0]['values'][0][0] != null) {
      setOfSetsId = rs[0]['values'][0][0];
      setOfSetsId++;
    }


    var setOfSetsId = 1;
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
    sqlstr = "UPDATE SPARTAN_WOD"
           + "   SET WARMUP_SET = " + setOfSetsId + ";";

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
  $('#sets').append($('<option value="new" id="new">-- Add new --</option>'));


  $('#warmup_sets').empty();
  $('#warmup_sets').append($('<option value="new" id="new">-- Add new --</option>'));

  $('#sprint_sets').empty();
  $('#sprint_sets').append($('<option value="new" id="new">-- Add new --</option>'));

  $('#super_sets').empty();
  $('#super_sets').append($('<option value="new" id="new">-- Add new --</option>'));

  $('#beast_sets').empty();
  $('#beast_sets').append($('<option value="new" id="new">-- Add new --</option>'));

  $('#trifecta_sets').empty();
  $('#trifecta_sets').append($('<option value="new" id="new">-- Add new --</option>'));

  $('#cooldown_sets').empty();
  $('#cooldown_sets').append($('<option value="new" id="new">-- Add new --</option>'));

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

function copySprintSet() {

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

function copySprintExerciseSet() {

  var reps_min = $('#sprint_exercise_reps_min').val();
  var reps_max = $('#sprint_exercise_reps_max').val();

  var duration_min = $('#sprint_exercise_duration_min').val();
  var duration_max = $('#sprint_exercise_duration_max').val();

  var distance_min = $('#sprint_exercise_distance_min').val();
  var distance_max = $('#sprint_exercise_distance_max').val();

  var rest_min = $('#sprint_exercise_rest_min').val();
  var rest_max = $('#sprint_exercise_rest_max').val();

  // Super
  $('#super_exercise_reps_min').val(reps_min);
  $('#super_exercise_reps_max').val(reps_max);

  $('#super_exercise_duration_min').val(duration_min);
  $('#super_exercise_duration_max').val(duration_max);

  $('#super_exercise_distance_min').val(distance_min);
  $('#super_exercise_distance_max').val(distance_max);

  $('#super_exercise_rest_min').val(rest_min);
  $('#super_exercise_rest_max').val(rest_max);

  // Beast
  $('#beast_exercise_reps_min').val(reps_min);
  $('#beast_exercise_reps_max').val(reps_max);

  $('#beast_exercise_duration_min').val(duration_min);
  $('#beast_exercise_duration_max').val(duration_max);

  $('#beast_exercise_distance_min').val(distance_min);
  $('#beast_exercise_distance_max').val(distance_max);

  $('#beast_exercise_rest_min').val(rest_min);
  $('#beast_exercise_rest_max').val(rest_max);

  // Trifecta
  $('#trifecta_exercise_reps_min').val(reps_min);
  $('#trifecta_exercise_reps_max').val(reps_max);

  $('#trifecta_exercise_duration_min').val(duration_min);
  $('#trifecta_exercise_duration_max').val(duration_max);

  $('#trifecta_exercise_distance_min').val(distance_min);
  $('#trifecta_exercise_distance_max').val(distance_max);

  $('#trifecta_exercise_rest_min').val(rest_min);
  $('#trifecta_exercise_rest_max').val(rest_max);

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

function populateSetOfSets(db) {
  var spartanWODId = $('#workouts').find(':selected').attr('value');

  if (spartanWODId === 'new') {
    return;
  }
  
  sqlstr = "SELECT * FROM SPARTAN_WOD WHERE SPARTAN_WOD_ID = " + spartanWODId + ";";
  var rs = db.exec(sqlstr);

  if (rs.length == 0) {
    return;
  }

  var warmupSetId = parseInt(rs[0]['values'][0][7]);
  var sprintSetId = parseInt(rs[0]['values'][0][8]);
  var superSetId = parseInt(rs[0]['values'][0][9]);
  var beastSetId = parseInt(rs[0]['values'][0][10]);
  var trifectaSetId = parseInt(rs[0]['values'][0][11]);
  var cooldownSetId = parseInt(rs[0]['values'][0][12]);

}

function populateWorkout(db) {

  var spartanWODId = $('#workouts').find(':selected').attr('value');
  var wodName = $('#wod_name').val('');
  var wodQuote = $('#quote').val('');
  var wodQuoteBy = $('#quote_by').val('');
  var wodDescription = $('#wod_description').val('');
  var wodSpecialDay = $('#special_day').val('');

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
         + "                         REST_DURATION_MIN FLOAT,"
         + "                         REST_DURATION_MAX FLOAT,"
         + "                         TYPE VARCHAR,"
         + "                         CALORIES FLOAT); ";

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
         + "                      EQ_ROPE,"
         + "                      CALORIES FLOAT,"
         + "                      CALORIES_MEASURED_IN VARCHAR); ";

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
         + "                          CALORIES FLOAT,"
         + "                          FOREIGN KEY(EXERCISE_ID) REFERENCES EXERCISE(EXERCISE_ID)); ";

  db.exec(sqlstr);

  sqlstr = "CREATE TABLE EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID INTEGER PRIMARY KEY ASC,"
         + "                               SET_OF_SETS_ID INTEGER,"
         + "                               EXERCISE_SET_ID INTEGER,"
         + "                               SET_ORDER INTEGER,"
         + "                               FOREIGN KEY(SET_OF_SETS_ID) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),"
         + "                               FOREIGN KEY(EXERCISE_SET_ID) REFERENCES EXERCISE_SET(EXERCISE_SET_ID)); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(1, 'arm curls', 'strength', 'https://www.youtube.com/watch?v=kwG2ipFRgfo', 'upper body', 'arms', 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.23333, 'reps'); "; 

  db.exec(sqlstr); 

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(2,'back extension', 'strength', 'https://www.youtube.com/watch?v=Bw9YuQTTc58', 'upper body', 'back', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0.23333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(3, 'bear crawl', 'athleticism', 'https://www.youtube.com/watch?v=WMXbyYpZ9oY', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 607.84, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(4, 'belly crawl', 'athleticism', 'https://www.youtube.com/watch?v=cLwS1xkOLas', 'upper body', 'arms', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 300, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(5, 'bodyweight circuit', 'strength', '', 'full body', 'full body', 2, 2, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.6666, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(6, 'bodyweight squat', 'strength', 'https://www.youtube.com/watch?v=p3g4wAsu0R4', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.5787, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(7, 'box jump', 'strength', 'https://www.youtube.com/watch?v=hxldG9FX4j4', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(8, 'box jump burpee', 'athleticism', 'https://www.youtube.com/watch?v=kiOcwv7YE6c', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6666, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(9, 'brazilian ab twist', 'strength', 'https://www.youtube.com/watch?v=iUk5T87cf34', 'upper body', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0.1227, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(10, 'burpee', 'athleticism', 'https://www.youtube.com/watch?v=JZQA08SlJnM', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.6666, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(11, 'burpee pull-up', 'strength', 'https://www.youtube.com/watch?v=kAvZoa5iexA', 'full body', 'full body', 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(12, 'chest pass', 'athleticism', 'https://www.youtube.com/watch?v=FUdcjZ0weic', 'upper body', 'chest', 2, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5427, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(13, 'chore', 'active rest', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(14, 'crunch', 'strength', 'https://www.youtube.com/watch?v=Xyd_fa5zoEU', 'upper body', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.1666, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(15, 'curl', 'strength', 'https://www.youtube.com/watch?v=oUqgPSZmhro', 'upper body', 'arms', 2, 2, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.23333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(16, 'cycling', 'endurance', '', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1, 0, 0, 14, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(17, 'dog walking', 'active rest', '', 'lower body', 'legs', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 60, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(18, 'double leg butt kicks', 'warmup', 'https://www.youtube.com/watch?v=F5iYMAkGaY8', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(19, 'drop push-up', 'strength', 'https://www.youtube.com/watch?v=y9aAhXt2wYk', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.6666, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(20, 'dynamic warm up', 'warmup', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 3, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(21, 'easy jog', 'warmup', 'https://www.youtube.com/watch?v=BgZdwy1FO4Y', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 136, 'miles'); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(22, 'explosive broad jump', 'athleticism', 'https://www.youtube.com/watch?v=ko22JMOkzQQ', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.6666, 'reps'); ";  

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(23, 'flutter kick', 'strength', 'https://www.youtube.com/watch?v=ANVdMDaYRts', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.1666, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(24, 'glute kickback', 'athleticism', 'https://www.youtube.com/watch?v=h4439IQFAqI', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(25, 'handstand hold', 'strength', 'https://www.youtube.com/watch?v=h4439IQFAqI', 'upper body', 'arms', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 8.2, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(26, 'hanging knee raise', 'strength', 'https://www.youtube.com/watch?v=PGSKkNB1Oyk', 'full body', 'core', 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2666, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(27, 'high knee', 'warmup', 'https://www.youtube.com/watch?v=8opcQdC-V-U', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(28, 'hiking', 'active rest', '', 'full body', 'full body', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 70, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(29, 'hill interval', 'athleticism', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 1, 0, 0, 0, 0, 100, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(30, 'inverted pull-up', 'strength', 'https://www.youtube.com/watch?v=lgsyUiB6occ', 'upper body', 'upper body', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0.2733, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(31, 'isometric lunge hold', 'strength', 'https://www.youtube.com/watch?v=u-bhL8zo570', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 8.2, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(32, 'isometric wiper', 'strength', 'https://www.youtube.com/watch?v=VxrSMH5vVWY', 'upper body', 'arms', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(33, 'jog', 'endurance', 'https://www.youtube.com/watch?v=VxrSMH5vVWY', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 200, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(34, 'jump rope', 'warmup', 'https://www.youtube.com/watch?v=GRStB06uhgE', 'full body', 'full body', 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14.288, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(35, 'jumping jack', 'warmup', 'https://www.youtube.com/watch?v=c4DAnQ6DtF8', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.2381, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(36, 'jumping lunge', 'athleticism', 'https://www.youtube.com/watch?v=Kw4QpPfX-cU', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, .3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(37, 'kettle bell 1-arm overhead farmer''s carry', 'strength', 'https://www.youtube.com/watch?v=uT1LV1eLcdM', 'upper body', 'upper body', 2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(38, 'kettle bell swing', 'strength', 'https://www.youtube.com/watch?v=OopKTfLiz48', 'full body', 'full body', 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(39, 'laying leg raise', 'athleticism', 'https://www.youtube.com/watch?v=xqTh6NqbAtM', 'lower body', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.1666, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(40, 'run', 'endurance', 'https://www.youtube.com/watch?v=wCVSv7UxB2E', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 350, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(41, 'mountain climber', 'endurance', 'https://www.youtube.com/watch?v=nmwgirgXLYM', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.5555, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(42, 'muscle-up', 'strength', 'https://youtu.be/ZEDY9QNBKe4', 'upper body', 'upper body', 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(43, 'pistol squat', 'strength', 'https://www.youtube.com/watch?v=7NvOuty_Fnc', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(44, 'plank', 'strength', 'https://www.youtube.com/watch?v=pSHjTRCQxIw', 'upper body', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 3.68, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(45, 'plyometric push-up', 'strength', 'https://www.youtube.com/watch?v=mgkyTtQ0ODE', 'upper body', 'upper body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.4, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(46, 'power skip', 'warmup', 'https://www.youtube.com/watch?v=NCY9gFsZk9Y', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(47, 'pull-up', 'warmup', 'https://www.youtube.com/watch?v=NCY9gFsZk9Y', 'upper body', 'upper body', 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(48, 'push-up', 'warmup', 'https://www.youtube.com/watch?v=NCY9gFsZk9Y', 'upper body', 'upper body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.384, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(49, 'recover', 'rest', 'https://www.youtube.com/watch?v=NCY9gFsZk9Y', 'full body', 'full body', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0.01, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(50, 'rope climb', 'rest', 'https://www.youtube.com/watch?v=AD0uO7JGdZU', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1.32, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(51, 'row', 'endurance', '', 'full body', 'full body', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 8.21, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(52, 'sandbag/medicine ball slam', 'strength', 'https://www.youtube.com/watch?v=Y2wSD7spnxk', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.2, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(53, 'sandbag squat', 'strength', 'https://www.youtube.com/watch?v=U9yK6rHy40A', 'lower body', 'lower body', 2, 2, 0, 0, 2, 2, 2, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(54, 'sandbag squat throw', 'strength', 'https://www.youtube.com/watch?v=R-zLekvxzpg', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(55, 'shuttle run', 'strength', 'https://www.youtube.com/watch?v=Zcj_xdwLnNc', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 400, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(56, 'side kick', 'warmup', 'https://www.youtube.com/watch?v=MsmmbeXJ6Lw', 'lower body', 'lower body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.18, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(57, 'side plank', 'strength', 'https://www.youtube.com/watch?v=6cRAFji80CQ', 'upper body', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 3.68, 'minutes'); ";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(58, 'side-to-side hop', 'athleticism', 'https://www.youtube.com/watch?v=_AVX9cpPzks', 'upper body', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.2381, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(59, 'sit-up', 'strength', 'https://www.youtube.com/watch?v=1fbU_MkV7NE', 'upper body', 'core', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.1666, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(60, 'speed skater', 'athleticism', 'https://www.youtube.com/watch?v=EkESodXYDRM', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.2381, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(61, 'spiderman push-up', 'strength', 'https://www.youtube.com/watch?v=fKBeHALPsSU', 'upper body', 'upper body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.4, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(62, 'squat jump', 'strength', 'https://www.youtube.com/watch?v=DeTBwEL4m7s', 'lower body', 'lower body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(63, 'star jump', 'athleticism', 'https://www.youtube.com/watch?v=h6wu4_LOhyU', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(64, 'stretch', 'cooldown', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.01, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(65, 'swimming', 'endurance', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 8.3333, 'minutes'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(66, 'trail run', 'endurance', '', 'full body', 'full body', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 350, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(67, 'tricep overhead extension', 'strength', 'https://www.youtube.com/watch?v=YbX7Wd8jQ-Q', 'upper body', 'arms', 2, 2, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0.2733, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(68, 'uphill dash', 'athleticism', '', 'full body', 'full body', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 120, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(69, 'vertical jump', 'athleticism', 'https://www.youtube.com/watch?v=K9zzVwMyD1g', 'lower body', 'lower body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.3333, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(70, 'walk', 'active rest', '', 'lower body', 'lower body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 50, 'miles'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(71, 'walking lunge', 'strength', 'https://www.youtube.com/watch?v=L8fvypPrzzs', 'lower body', 'legs', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.2644, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(72, 'wide push-up', 'strength', 'https://www.youtube.com/watch?v=B78GwfC-87Y', 'upper body', 'chest', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.384, 'reps'); "; 

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE(EXERCISE_ID, NAME, CATEGORY, DEMO_URL, GENERAL_MUSCLE_GROUP, TARGET_MUSCLE_GROUP, LOC_INDOORS, LOC_OUTDOORS, EQ_JUMP_ROPE, EQ_PULLUP_BAR, EQ_WEIGHTS, EQ_KETTLE_BELLS, EQ_HEAVY_OBJECT, EQ_TRX, EQ_MED_BALL, EQ_BOX, EQ_SQUAT_RACK, EQ_TREADMILL, EQ_TRACK, EQ_TRAIL, EQ_HILLS, EQ_POOL, EQ_BIKE, EQ_ROW_MACHINE, EQ_ROPE, CALORIES, CALORIES_MEASURED_IN) VALUES(73, 'yoga', 'active recovery', '', 'full body', 'full body', 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0.1, 'minutes'); "; 


  // SET
  sqlstr = "INSERT INTO EXERCISE_SET(EXERCISE_SET_ID, EXERCISE_ID, DIRECTION, TYPE, REPS_MIN, REPS_MAX, DURATION_MIN, DURATION_MAX, DIST_MIN, DIST_MAX, REST_DURATION_MIN, REST_DURATION_MAX, CALORIES) VALUES(1, 20, null, 'warmup', null, null, 5, 10, null, null, null, null, 45);";

  db.exec(sqlstr);

  // SET
  sqlstr = "INSERT INTO EXERCISE_SET(EXERCISE_SET_ID, EXERCISE_ID, DIRECTION, TYPE, REPS_MIN, REPS_MAX, DURATION_MIN, DURATION_MAX, DIST_MIN, DIST_MAX, REST_DURATION_MIN, REST_DURATION_MAX, CALORIES) VALUES(2, 40, null, 'warmup', null, null, 10, 10, null, null, null, null, 350);";

  db.exec(sqlstr);

  // SET OF SETS
  sqlstr = "INSERT INTO SET_OF_SETS(SET_OF_SETS_ID, CATEGORY, REPS_MIN, REPS_MAX, DURATION_MIN, DURATION_MAX, DIST_MIN, DIST_MAX, REST_DURATION_MIN, REST_DURATION_MAX, TYPE, CALORIES) VALUES (1, 'warmup', 1, 1, null, null, null, null, null, null, 'warmup', 45);";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID, SET_OF_SETS_ID, EXERCISE_SET_ID, SET_ORDER) VALUES(1, 1, 1, 1);";

  db.exec(sqlstr);

  sqlstr = "INSERT INTO EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID, SET_OF_SETS_ID, EXERCISE_SET_ID, SET_ORDER) VALUES(2, 1, 2, 2);";

  db.exec(sqlstr);

  // WOD
  sqlstr = "INSERT INTO SPARTAN_WOD(SPARTAN_WOD_ID, NAME, CATEGORY, QUOTE, QUOTE_BY, DESCRIPTION, SPECIAL_DAY, WARMUP_SET, MAIN_SET_SPRINT, MAIN_SET_SUPER, MAIN_SET_BEAST, MAIN_SET_TRIFECTA, COOLDOWN_SET) VALUES(1, 'A Work of Art', 'athleticism', 'The human foot is a masterpiece of engineering and a work of art.', 'Leonardo da Vinci', 'Put those feet to good use in this workout. Celebrate your abilities by maximizing them.', null, 1, null, null, null, null, null); "; 

  db.exec(sqlstr);

}
