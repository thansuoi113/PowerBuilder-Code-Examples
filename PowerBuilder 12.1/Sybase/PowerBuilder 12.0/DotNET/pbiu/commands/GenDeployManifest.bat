
rem %1mage %2appmanifest %3certfile %4ifinstall %5deploymanifest %6deployappname %7version %8installurl %9minversion 

if "%9"=="null" ( goto newnomv) else ( goto newhasmv)
:newnomv
%1 -New Deployment -I %4 -ToFile %5 -Name %6 -Version %7 -AppManifest %2 -providerUrl %8 -Processor "x86"
:newhasmv
%1 -New Deployment -I %4 -ToFile %5 -Name %6 -Version %7 -AppManifest %2 -providerUrl %8 -Processor "x86"
%1 -Update %5 -mv %9


