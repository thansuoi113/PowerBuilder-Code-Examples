rem %1 sourcedeploymentdir %2destinatedir %3sourceversion %4destversion %5sourcesupport %6destsupport %7IfHasPrerequisite
copy %1 %2 /y
xcopy %3 %4 /e /d  /r /y
IF "%7"=="true" xcopy %5 %6 /e /d /r /y
