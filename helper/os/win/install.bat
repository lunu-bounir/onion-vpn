@echo off

pushd "%~dp0"

SET ID=onion.vpn.helper
SET =native part of the Onion VPN extension

SET PATH=C:\Windows\System32;%PATH%

ECHO .. Kill already running instances
taskkill /im tor.exe /f >nul 2>&1
taskkill /im node.exe /f >nul 2>&1

ECHO.
ECHO .. Copy %FILE% to %LocalAPPData%\%ID%\
mkdir %LocalAPPData%\%ID%
mkdir %LocalAPPData%\%ID%\node
copy assets\node\* %LocalAPPData%\%ID%\node\
mkdir %LocalAPPData%\%ID%\tor
copy assets\tor\* %LocalAPPData%\%ID%\tor\
copy assets\app.js %LocalAPPData%\%ID%\
copy assets\messaging.js %LocalAPPData%\%ID%\

ECHO .. Copy Firefox manifest to %LocalAPPData%\%ID%\manifest-firefox.json
(
  ECHO {
  ECHO   "name": "%ID%",
  ECHO   "description": "%DESCRIPTION%",
  ECHO   "path": "node\\node.bat",
  ECHO   "type": "stdio",
  ECHO   "allowed_extensions": ["{4d0fd54a-4590-45af-a943-60330144f676}"]
  ECHO }
) > %LocalAPPData%\%ID%\manifest-firefox.json
ECHO .. Copy Chrome manifest to %LocalAPPData%\%ID%\manifest-chrome.json
(
  ECHO {
  ECHO   "name": "%ID%",
  ECHO   "description": "%DESCRIPTION%",
  ECHO   "path": "node\\node.bat",
  ECHO   "type": "stdio",
  ECHO   "allowed_origins": ["chrome-extension://diekiockdlleigoinkcjjkpnpapbkfbo/", "chrome-extension://laodgoeoeloaponlioalomjadbmkkkhd/"]
  ECHO }
) > %LocalAPPData%\%ID%\manifest-chrome.json

ECHO.
ECHO .. Writting to Chrome Registry
ECHO .. Key: HKCU\Software\Google\Chrome\NativeMessagingHosts\%ID%
REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\%ID%" /ve /t REG_SZ /d "%LocalAPPData%\%ID%\manifest-chrome.json" /f

ECHO.
ECHO .. Writting to Firefox Registry
ECHO .. Key: HKCU\SOFTWARE\Mozilla\NativeMessagingHosts\%ID%
FOR %%f in ("%LocalAPPData%") do SET SHORT_PATH=%%~sf
REG ADD "HKCU\SOFTWARE\Mozilla\NativeMessagingHosts\%ID%" /ve /t REG_SZ /d "%SHORT_PATH%\%ID%\manifest-firefox.json" /f

echo .. Done!
pause
