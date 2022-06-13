@echo off

SETLOCAL

echo ----- DETECT ASA VERSION ---------------------------------
SET ASA_PATH=%SQLANY10%
SET ASA_CMD=dbeng10
if not "%ASA_PATH%" == "" goto ASA_PATH_set
SET ASA_PATH=%ASANY9%
SET ASA_CMD=dbeng9
if not "%ASA_PATH%" == "" goto ASA_PATH_set
SET ASA_PATH=%ASANY8%
SET ASA_CMD=dbeng8
if "%ASA_PATH%" == "" goto ASANY_not_set
:ASA_PATH_set

set curr_dir=%_cwd%
if "%curr_dir%" == "" set curr_dir=%cd%
if "%curr_dir%" == "" for /f %%i in ('cd') do @set curr_dir=%%i

echo ----- SET UP DATABASE ------------------------------------
if exist salesdb.db "%ASA_PATH%\win32\dbstop" -y SalesDB
if exist salesdb_remote.db "%ASA_PATH%\win32\dbstop" -y SalesDB_remote

if exist salesdb.db "%ASA_PATH%\win32\dberase" -y salesdb.db
if not errorlevel == 0 goto done

if exist salesdb_remote.db "%ASA_PATH%\win32\dberase" -y salesdb_remote.db
if not errorlevel == 0 goto done

echo ----- CREATE CONSOLIDATED DATABASE -----------------------
"%ASA_PATH%\win32\dbinit" -p 2048 salesdb.db
if not errorlevel == 0 goto done

echo ----- CREATE REMOTE DATABASE -----------------------------
rem "%ASA_PATH%\win32\dbinit" -ea AES -ek secret -i -p 1024 salesdb_remote.db
"%ASA_PATH%\win32\dbinit" -ea AES -ek secret -i -p 2048 salesdb_remote.db
if not errorlevel == 0 goto done

echo ----- SET UP DSN -----------------------------------------
"%ASA_PATH%\win32\dbdsn" -ds SalesDB -y
"%ASA_PATH%\win32\dbdsn" -ws SalesDB -y -v -c "uid=dba;pwd=sql;eng=SalesDB;dbn=SalesDB;dbf=%curr_dir%\salesdb.db;links=shmem;start=%ASA_CMD% -c 8M -zl -ti 0" 

"%ASA_PATH%\win32\dbdsn" -ds SalesDB_remote -y
"%ASA_PATH%\win32\dbdsn" -ws SalesDB_remote -y -v -c "eng=SalesDB_remote;dbn=SalesDB_remote;dbf=%curr_dir%\salesdb_remote.db;links=shmem;start=%ASA_CMD% -c 8M -zl -ti 0" 

echo ----- SET UP CONSOLIDATED DATABASE -----------------------
if not "%ASA_CMD%" == "dbeng10" goto olddb
"%ASA_PATH%\win32\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" %ASA_PATH%\MobiLink\setup\syncsa.sql
"%ASA_PATH%\win32\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" -ODBC read salesdb.sql 
"%ASA_PATH%\win32\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" -ODBC read mluser10.sql 
goto dbend
:olddb
"%ASA_PATH%\win32\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" -ODBC read salesdb.sql 
"%ASA_PATH%\win32\dbisql" -q -nogui -c "uid=dba;pwd=sql;dsn=SalesDB" -ODBC read mluser9.sql 
:dbend
if not errorlevel == 0 goto done

echo ----- SET UP REMOTE DATABASE -----------------------------
"%ASA_PATH%\win32\dbisql" -q -nogui -c "uid=dba;pwd=sql;dbkey=secret;dsn=SalesDB_remote" -ODBC read salesdb_remote.sql 
if not errorlevel == 0 goto done
if not exist fresh mkdir fresh
copy salesdb_remote.db fresh
copy salesdb_remote.log fresh

goto done

rem ------------------- error: ASANY not set
:ASANY_not_set
echo environment variable SQLANY10/ASANY9/ASANY8 not set

:done
echo ----- COMPLETED ------------------------------------------
PAUSE

ENDLOCAL
