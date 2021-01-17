@echo off

pushd "%~dp0"

SET ID=onion.vpn.helper
SET DESCRIPTION=native part of the Onion VPN extension

SET PATH=C:\Windows\System32;%PATH%

FOR %%f in ("%LocalAPPData%") do SET SHORT_PATH=%%~sf

ECHO .. Kill already running instances
taskkill /im tor.exe /f >nul 2>&1
taskkill /im node.exe /f >nul 2>&1

ECHO.
ECHO .. Copy %FILE% to %SHORT_PATH%\%ID%\
mkdir %SHORT_PATH%\%ID%
mkdir %SHORT_PATH%\%ID%\node
copy assets\node\* %SHORT_PATH%\%ID%\node\
mkdir %SHORT_PATH%\%ID%\tor
copy assets\tor\* %SHORT_PATH%\%ID%\tor\
copy assets\app.js %SHORT_PATH%\%ID%\
copy assets\messaging.js %SHORT_PATH%\%ID%\

ECHO .. Copy Firefox manifest to %SHORT_PATH%\%ID%\manifest-firefox.json
(
  ECHO {
  ECHO   "name": "%ID%",
  ECHO   "description": "%DESCRIPTION%",
  ECHO   "path": "node\\node.bat",
  ECHO   "type": "stdio",
  ECHO   "allowed_extensions": ["{4d0fd54a-4590-45af-a943-60330144f676}"]
  ECHO }
) > %SHORT_PATH%\%ID%\manifest-firefox.json
ECHO .. Copy Chrome manifest to %SHORT_PATH%\%ID%\manifest-chrome.json
(
  ECHO {
  ECHO   "name": "%ID%",
  ECHO   "description": "%DESCRIPTION%",
  ECHO   "path": "node\\node.bat",
  ECHO   "type": "stdio",
  ECHO   "allowed_origins": ["chrome-extension://diekiockdlleigoinkcjjkpnpapbkfbo/", "chrome-extension://laodgoeoeloaponlioalomjadbmkkkhd/"]
  ECHO }
) > %SHORT_PATH%\%ID%\manifest-chrome.json

ECHO.
ECHO .. Writting to Chrome Registry
ECHO .. Key: HKCU\Software\Google\Chrome\NativeMessagingHosts\%ID%
REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\%ID%" /ve /t REG_SZ /d "%SHORT_PATH%\%ID%\manifest-chrome.json" /f

ECHO.
ECHO .. Writting to Firefox Registry
ECHO .. Key: HKCU\SOFTWARE\Mozilla\NativeMessagingHosts\%ID%
REG ADD "HKCU\SOFTWARE\Mozilla\NativeMessagingHosts\%ID%" /ve /t REG_SZ /d "%SHORT_PATH%\%ID%\manifest-firefox.json" /f

echo .. Done!
pause
