DROP TABLE IF EXISTS EXERCISE_SET_JOIN;
DROP TABLE IF EXISTS EXERCISE_SET;
DROP TABLE IF EXISTS EXERCISE;
DROP TABLE IF EXISTS SET_OF_SETS;

CREATE TABLE SET_OF_SETS(SET_OF_SETS_ID INTEGER PRIMARY KEY ASC,
                         CATEGORY VARCHAR,
                         REPS_MIN INTEGER,
                         REPS_MAX INTEGER,
                         DURATION_MIN FLOAT,
                         DURATION_MAX FLOAT,
                         DIST_MIN FLOAT,
                         DIST_MAX FLOAT,
                         TYPE VARCHAR);

CREATE TABLE SPARTAN_WOD(SPARTAN_WOD_ID INTEGER PRIMARY KEY ASC,
                         NAME VARCHAR,
                         CATEGORY VARCHAR,
                         QUOTE VARCHAR,
                         QUOTE_BY VARCHAR,
                         DESCRIPTION VARCHAR,
                         SPECIAL_DAY VARCHAR,
                         WARMUP_SET INTEGER,
                         MAIN_SET_SPRINT INTEGER,
                         MAIN_SET_SUPER INTEGER,
                         MAIN_SET_BEAST INTEGER,
                         MAIN_SET_TRIFECTA INTEGER,
                         COOLDOWN_SET INTEGER,
                         FOREIGN KEY(WARMUP_SET) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),
                         FOREIGN KEY(MAIN_SET_SPRINT) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),
                         FOREIGN KEY(MAIN_SET_SUPER) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),
                         FOREIGN KEY(MAIN_SET_BEAST) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),
                         FOREIGN KEY(MAIN_SET_TRIFECTA) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),
                         FOREIGN KEY(COOLDOWN_SET) REFERENCES SET_OF_SETS(SET_OF_SETS_ID));

CREATE TABLE EXERCISE(EXERCISE_ID INTEGER PRIMARY KEY ASC,
                      NAME VARCHAR,
                      CATEGORY VARCHAR,
                      DEMO_URL VARCHAR,
                      GENERAL_MUSCLE_GROUP VARCHAR,
                      TARGET_MUSCLE_GROUP VARCHAR,
                      LOC_INDOORS INTEGER,
                      LOC_OUTDOORS INTEGER,
                      EQ_JUMP_ROPE INTEGER,
                      EQ_PULLUP_BAR INTEGER,
                      EQ_WEIGHTS INTEGER,
                      EQ_KETTLE_BELLS INTEGER,
                      EQ_HEAVY_OBJECT INTEGER,
                      EQ_TRX INTEGER,
                      EQ_MED_BALL INTEGER,
                      EQ_BOX INTEGER,
                      EQ_SQUAT_RACK INTEGER,
                      EQ_TREADMILL INTEGER,
                      EQ_TRACK INTEGER,
                      EQ_TRAIL INTEGER,
                      EQ_HILLS INTEGER,
                      EQ_POOL INTEGER,
                      EQ_BIKE INTEGER,
                      EQ_ROW_MACHINE INTEGER,
                      EQ_ROPE INTEGER);

CREATE TABLE EXERCISE_SET(EXERCISE_SET_ID INTEGER PRIMARY KEY ASC,
                          DIRECTION VARCHAR,
                          EXERCISE_ID INTEGER,
                          TYPE VARCHAR,
                          REPS_MIN INTEGER,
                          REPS_MAX INTEGER,
                          DURATION_MIN FLOAT,
                          DURATION_MAX FLOAT,
                          DIST_MIN FLOAT,
                          DIST_MAX FLOAT,
                          REST_DURATION_MIN INTEGER,
                          REST_DURATION_MAX INTEGER,

                          FOREIGN KEY(EXERCISE_ID) REFERENCES EXERCISE(EXERCISE_ID));

CREATE TABLE EXERCISE_SET_JOIN(EXERCISE_SET_JOIN_ID INTEGER PRIMARY KEY ASC,
                               SET_OF_SETS_ID INTEGER,
                               EXERCISE_SET_ID INTEGER,
                               SET_ORDER INTEGER,

                               FOREIGN KEY(SET_OF_SETS_ID) REFERENCES SET_OF_SETS(SET_OF_SETS_ID),
                               FOREIGN KEY(EXERCISE_SET_ID) REFERENCES EXERCISE_SET(EXERCISE_SET_ID));

  --INSERT INTO employees VALUES (1,'JOHNSON','ADMIN',6,'1990-12-17',18000,NULL,4);
