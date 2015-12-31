INSERT INTO SET_OF_SETS(SET_OF_SETS_ID,
                        CATEGORY,
                        REPS_MIN,
                        REPS_MAX,
                        DURATION_MIN,
                        DURATION_MAX,
                        DIST_MIN,
                        DIST_MAX,
                        TYPE)
VALUES(1,
       'warmup',
       1,
       1,
       null,
       null,
       null,
       null,
       'any');


INSERT INTO SET_OF_SETS(SET_OF_SETS_ID,
                        CATEGORY,
                        REPS_MIN,
                        REPS_MAX,
                        DURATION_MIN,
                        DURATION_MAX,
                        DIST_MIN,
                        DIST_MAX,
                        TYPE)
VALUES(2,
       'main',
       2,
       3,
       null,
       null,
       null,
       null,
       'sprint');

INSERT INTO SET_OF_SETS(SET_OF_SETS_ID,
                        CATEGORY,
                        REPS_MIN,
                        REPS_MAX,
                        DURATION_MIN,
                        DURATION_MAX,
                        DIST_MIN,
                        DIST_MAX,
                        TYPE)
VALUES(3,
       'main',
       3,
       4,
       null,
       null,
       null,
       null,
       'super');

INSERT INTO SET_OF_SETS(SET_OF_SETS_ID,
                        CATEGORY,
                        REPS_MIN,
                        REPS_MAX,
                        DURATION_MIN,
                        DURATION_MAX,
                        DIST_MIN,
                        DIST_MAX,
                        TYPE)
VALUES(4,
       'main',
       4,
       5,
       null,
       null,
       null,
       null,
       'beast');

INSERT INTO SET_OF_SETS(SET_OF_SETS_ID,
                        CATEGORY,
                        REPS_MIN,
                        REPS_MAX,
                        DURATION_MIN,
                        DURATION_MAX,
                        DIST_MIN,
                        DIST_MAX,
                        TYPE)
VALUES(5,
       'main',
       5,
       6,
       null,
       null,
       null,
       null,
       'trifecta');

INSERT INTO SET_OF_SETS(SET_OF_SETS_ID,
                        CATEGORY,
                        REPS_MIN,
                        REPS_MAX,
                        DURATION_MIN,
                        DURATION_MAX,
                        DIST_MIN,
                        DIST_MAX,
                        TYPE)
VALUES(6,
       'cooldown',
       1,
       1,
       null,
       null,
       null,
       null,
       'any');

INSERT INTO SPARTAN_WOD(NAME,
                        CATEGORY,
                        QUOTE,
                        QUOTE_BY,
                        DESCRIPTION,
                        SPECIAL_DAY,
                        WARMUP_SET,
                        MAIN_SET_SPRINT,
                        MAIN_SET_SUPER,
                        MAIN_SET_BEAST,
                        MAIN_SET_TRIFECTA,
                        COOLDOWN_SET)
VALUES('A Work of Art',
       'athleticism',
       'The human foot is a masterpiece of engineering and a work of art.',
       'Leonardo da Vinci',
       'Put those feet to good use in this workout. Celebrate your abilities by maximizing them.',
       null,
       1,
       2,
       3,
       4,
       5, 
       6);



INSERT INTO EXERCISE_SET(EXERCISE_SET_ID,
                         EXERCISE_ID,
                         DIRECTION,
                         TYPE,
                         REPS_MIN,
                         REPS_MAX,
                         DURATION_MIN,
                         DURATION_MAX,
                         DIST_MIN,
                         DIST_MAX,
                         REST_DURATION_MIN,
                         REST_DURATION_MAX)
VALUES(1,
       20,
       null,
       null, 
       null,
       null, 
       null,
       null, 
       null,
       null, 
       null,
       null);
       

INSERT INTO EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID,
                              SET_OF_SETS_ID,
                              EXERCISE_SET_ID,
                              SET_ORDER)
VALUES(1,
       1,
       1,
       1);



INSERT INTO EXERCISE_SET(EXERCISE_SET_ID,
                         EXERCISE_ID,
                         DIRECTION,
                         TYPE,
                         REPS_MIN,
                         REPS_MAX,
                         DURATION_MIN,
                         DURATION_MAX,
                         DIST_MIN,
                         DIST_MAX,
                         REST_DURATION_MIN,
                         REST_DURATION_MAX)
VALUES(2,
       20,
       null,
       null, 
       null,
       null, 
       10,
       10, 
       null,
       null, 
       null,
       null);
       

INSERT INTO EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID,
                              SET_OF_SETS_ID,
                              EXERCISE_SET_ID,
                              SET_ORDER)
VALUES(2,
       1,
       2,
       2);



INSERT INTO EXERCISE_SET(EXERCISE_SET_ID,
                         EXERCISE_ID,
                         DIRECTION,
                         TYPE,
                         REPS_MIN,
                         REPS_MAX,
                         DURATION_MIN,
                         DURATION_MAX,
                         DIST_MIN,
                         DIST_MAX,
                         REST_DURATION_MIN,
                         REST_DURATION_MAX)
VALUES(3,
       40,
       null,
       null, 
       null,
       null, 
       null,
       0.5, 
       0.5,
       null, 
       null,
       null);
       

INSERT INTO EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID,
                              SET_OF_SETS_ID,
                              EXERCISE_SET_ID,
                              SET_ORDER)
VALUES(3,
       2,
       3,
       1);


INSERT INTO EXERCISE_SET(EXERCISE_SET_ID,
                         EXERCISE_ID,
                         DIRECTION,
                         TYPE,
                         REPS_MIN,
                         REPS_MAX,
                         DURATION_MIN,
                         DURATION_MAX,
                         DIST_MIN,
                         DIST_MAX,
                         REST_DURATION_MIN,
                         REST_DURATION_MAX)
VALUES(4,
       10,
       null,
       null, 
       10,
       10, 
       null,
       null, 
       null,
       null, 
       2,
       4);
       

INSERT INTO EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID,
                              SET_OF_SETS_ID,
                              EXERCISE_SET_ID,
                              SET_ORDER)
VALUES(4,
       2,
       4,
       2);

INSERT INTO EXERCISE_SET(EXERCISE_SET_ID,
                         EXERCISE_ID,
                         DIRECTION,
                         TYPE,
                         REPS_MIN,
                         REPS_MAX,
                         DURATION_MIN,
                         DURATION_MAX,
                         DIST_MIN,
                         DIST_MAX,
                         REST_DURATION_MIN,
                         REST_DURATION_MAX)
VALUES(5,
       10,
       null,
       null, 
       10,
       10, 
       null,
       null, 
       null,
       null, 
       null, 
       null);
       

INSERT INTO EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID,
                              SET_OF_SETS_ID,
                              EXERCISE_SET_ID,
                              SET_ORDER)
VALUES(5,
       2,
       4,
       3);

INSERT INTO EXERCISE_SET(EXERCISE_SET_ID,
                         EXERCISE_ID,
                         DIRECTION,
                         TYPE,
                         REPS_MIN,
                         REPS_MAX,
                         DURATION_MIN,
                         DURATION_MAX,
                         DIST_MIN,
                         DIST_MAX,
                         REST_DURATION_MIN,
                         REST_DURATION_MAX)
VALUES(6,
       40,
       null,
       null, 
       null,
       null, 
       null,
       0.5, 
       0.5,
       null, 
       2,
       4);
       

INSERT INTO EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID,
                              SET_OF_SETS_ID,
                              EXERCISE_SET_ID,
                              SET_ORDER)
VALUES(6,
       2,
       3,
       4);

-- Cooldown
INSERT INTO EXERCISE_SET(EXERCISE_SET_ID,
                         EXERCISE_ID,
                         DIRECTION,
                         TYPE,
                         REPS_MIN,
                         REPS_MAX,
                         DURATION_MIN,
                         DURATION_MAX,
                         DIST_MIN,
                         DIST_MAX,
                         REST_DURATION_MIN,
                         REST_DURATION_MAX)
VALUES(7,
       63,
       null,
       null, 
       null,
       null, 
       null,
       null, 
       null,
       null, 
       null,
       null);
       

INSERT INTO EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID,
                              SET_OF_SETS_ID,
                              EXERCISE_SET_ID,
                              SET_ORDER)
VALUES(7,
       6,
       7,
       1);
