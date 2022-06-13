
@echo off

REM *********************************************************************
REM
REM PURPOSE:
REM     This file is used to start the Mobilink Server so that
REM     Clients can synchronize with the server
REM
REM *********************************************************************

SETLOCAL

IF NOT DEFINED ISQL SET ISQL=dbisqlc -q
IF NOT DEFINED DSN        SET DSN=SalesDB

:SET_ASA_CMD
SET ASA_ANY=%SQLANY17%
SET ASA_CMD=mlsrv17.exe
SET ML_STOP=mlstop
if not "%ASA_ANY%" == "" goto SET_CURR_DIR
SET ASA_ANY=%SQLANY16%
SET ASA_CMD=mlsrv16.exe
SET ML_STOP=mlstop
if not "%ASA_ANY%" == "" goto SET_CURR_DIR
SET ASA_ANY=%SQLANY12%
SET ASA_CMD=mlsrv12.exe
SET ML_STOP=mlstop
if not "%ASA_ANY%" == "" goto SET_CURR_DIR
SET ASA_ANY=%SQLANY11%
SET ASA_CMD=mlsrv11.exe
SET ML_STOP=mlstop
if not "%ASA_ANY%" == "" goto SET_CURR_DIR
SET ASA_ANY=%SQLANY10%
SET ASA_CMD=mlsrv10.exe
SET ML_STOP=mlstop
if not "%ASA_ANY%" == "" goto SET_CURR_DIR
set ASA_ANY=%ASANY9%
set ASA_CMD=dbmlsrv9.exe
set ML_STOP=dbmlstop
if not "%ASA_ANY%"=="" goto SET_CURR_DIR
set ASA_ANY=%ASANY8%
set ASA_CMD=dbmlsrv8.exe
set ML_STOP=dbmlstop

:SET_CURR_DIR
rem Determine the current working directory
rem First check if this is 4NT %_cwd should be the current working directory

set db_dir=%_cwd%
if "%db_dir%" == "" set db_dir=%cd%
if "%db_dir%" == "" for /f %%i in ('cd') do @set db_dir=%%i

echo.
echo Stop Mobilink if it is currently running
echo.
%ML_STOP% -w %DSN%

if exist dbmlsrv.mle del dbmlsrv.mle

set ML_parms=-zu+ -v -zs %DSN% -c dsn=%DSN% -q
start %ASA_CMD% %ML_parms%

goto ML_END

:ML_END
echo.
echo MobiLink started
echo.
echo off

goto DONE

:ERRORS

echo.
echo SETUP FAILED
echo.
goto DONE

:DONE

ENDLOCAL
