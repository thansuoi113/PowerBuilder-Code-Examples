@echo off

SETLOCAL

echo ----- DETECT ASA VERSION ---------------------------------
SET ASA_PATH=%SQLANY17%
SET ASA_CMD=dbeng17
SET __SABIN=%ASA_PATH%\Bin32
if not "%ASA_PATH%" == "" goto ASA_PATH_set
SET ASA_PATH=%SQLANY16%
SET ASA_CMD=dbeng16
SET __SABIN=%ASA_PATH%\Bin32
if not "%ASA_PATH%" == "" goto ASA_PATH_set
SET ASA_PATH=%SQLANY12%
SET ASA_CMD=dbeng12
SET __SABIN=%ASA_PATH%\Bin32
if not "%ASA_PATH%" == "" goto ASA_PATH_set
SET ASA_PATH=%SQLANY11%
SET ASA_CMD=dbeng11
SET __SABIN=%ASA_PATH%\Bin32
if not "%ASA_PATH%" == "" goto ASA_PATH_set
SET ASA_PATH=%SQLANY10%
SET ASA_CMD=dbeng10
SET __SABIN=%ASA_PATH%\win32
if not "%ASA_PATH%" == "" goto ASA_PATH_set
SET ASA_PATH=%ASANY9%
SET ASA_CMD=dbeng9
SET __SABIN=%ASA_PATH%\win32
if not "%ASA_PATH%" == "" goto ASA_PATH_set
SET ASA_PATH=%ASANY8%
SET ASA_CMD=dbeng8
SET __SABIN=%ASA_PATH%\win32
if "%ASA_PATH%" == "" goto ASANY_not_set
:ASA_PATH_set

set curr_dir=%_cwd%
if "%curr_dir%" == "" set curr_dir=%cd%
if "%curr_dir%" == "" for /f %%i in ('cd') do @set curr_dir=%%i

echo ----- SET UP DATABASE ------------------------------------
if exist salesdb.db "%__SABIN%\dbstop" -y SalesDB
if exist salesdb_remote.db "%__SABIN%\dbstop" -y SalesDB_remote

if exist "%curr_dir%\salesdb.db" "%__SABIN%\dberase" -y "%curr_dir%\salesdb.db"
if not errorlevel == 0 goto done

if exist "%curr_dir%\salesdb_remote.db" "%__SABIN%\dberase" -ek secret -y "%curr_dir%\salesdb_remote.db"
if not errorlevel == 0 goto done

echo ----- CREATE CONSOLIDATED DATABASE -----------------------
"%__SABIN%\dbinit" -p 2048 -dba dba,appeon "%curr_dir%\salesdb.db"
if not errorlevel == 0 goto done

echo ----- CREATE REMOTE DATABASE -----------------------------
"%__SABIN%\dbinit" -ea AES -ek secret -i -p 2048 -dba dba,appeon "%curr_dir%\salesdb_remote.db"
if not errorlevel == 0 goto done

echo ----- SET UP DSN -----------------------------------------
"%__SABIN%\dbdsn" -du SalesDB -y
"%__SABIN%\dbdsn" -wu SalesDB -y -v -c "uid=dba;pwd=appeon;eng=SalesDB;dbn=SalesDB;dbf=%curr_dir%\salesdb.db;links=shmem;start=%ASA_CMD% -c 8M -zl -ti 0" 

"%__SABIN%\dbdsn" -du SalesDB_remote -y
"%__SABIN%\dbdsn" -wu SalesDB_remote -y -v -c "eng=SalesDB_remote;dbn=SalesDB_remote;dbf=%curr_dir%\salesdb_remote.db;links=shmem;start=%ASA_CMD% -c 8M -zl -ti 0" 

echo ----- SET UP CONSOLIDATED DATABASE -----------------------
if "%ASA_CMD%" == "dbeng17" goto newdb17
if "%ASA_CMD%" == "dbeng16" goto newdb16
if "%ASA_CMD%" == "dbeng12" goto newdb10
if "%ASA_CMD%" == "dbeng11" goto newdb10
if "%ASA_CMD%" == "dbeng10" goto newdb10
goto olddb
:newdb17
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=appeon;dsn=SalesDB" %ASA_PATH%\MobiLink\setup\syncsa.sql
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=appeon;dsn=SalesDB" read salesdb.sql 
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=appeon;dsn=SalesDB" read mluser16.sql
goto dbend
:newdb16
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" %ASA_PATH%\MobiLink\setup\syncsa.sql
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" read salesdb.sql 
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" read mluser16.sql
goto dbend
:newdb10
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" %ASA_PATH%\MobiLink\setup\syncsa.sql
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" read salesdb.sql 
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" read mluser10.sql
goto dbend
:olddb
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" read "%curr_dir%\salesdb.sql" 
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" read "%curr_dir%\mluser9.sql" 
:dbend
if not errorlevel == 0 goto done

echo ----- SET UP REMOTE DATABASE -----------------------------
"%__SABIN%\dbisql" -q -nogui -c "uid=dba;pwd=appeon;dbkey=secret;dsn=SalesDB_remote" read salesdb_remote.sql
if not errorlevel == 0 goto done
if not exist fresh mkdir fresh
copy "%curr_dir%\salesdb_remote.db" "%curr_dir%\fresh"
copy "%curr_dir%\salesdb_remote.log" "%curr_dir%\fresh"

goto done

rem ------------------- error: ASANY not set
:ASANY_not_set
echo environment variable SQLANY17/SQLANY16/SQLANY12/SQLANY11/SQLANY10/ASANY9/ASANY8 not set

:done
echo ----- COMPLETED ------------------------------------------
PAUSE

ENDLOCAL
