#! /bin/bash

# get the official tor executable from www.torproject.org
cd cd os/mac
wget https://www.torproject.org/dist/torbrowser/8.0.5/TorBrowser-8.0.5-osx64_en-US.dmg
7z e TorBrowser-8.0.5-osx64_en-US.dmg tor.real -r
mv tor.real tor
chmod +x tor
cd ../..

cd os/win
wget https://www.torproject.org/dist/torbrowser/8.0.5/tor-win32-0.3.5.7.zip
7z e tor-win32-0.3.5.7.zip tor.exe *.dll -r
cd ../..

cd linux
mkdir 32
cd 32
wget https://www.torproject.org/dist/torbrowser/8.0.5/tor-browser-linux32-8.0.5_en-US.tar.xz
tar -xf tor-browser-linux32-8.0.5_en-US.tar.xz "tor-browser_en-US/Browser/TorBrowser/Tor/tor"
mv tor-browser_en-US/Browser/TorBrowser/Tor/tor ./tor
cd ..

mkdir 64
cd 64
wget https://www.torproject.org/dist/torbrowser/8.0.5/tor-browser-linux64-8.0.5_en-US.tar.xz
tar -xf tor-browser-linux64-8.0.5_en-US.tar.xz "tor-browser_en-US/Browser/TorBrowser/Tor/tor"
mv tor-browser_en-US/Browser/TorBrowser/Tor/tor ./tor
cd ../../..

#get the official NodeJS executable
cd os/mac
wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-darwin-x64.tar.gz
tar -xf node-v10.15.1-darwin-x64.tar.gz "node-v10.15.1-darwin-x64/bin/node"
mv node-v10.15.1-darwin-x64/bin/node ./node
cd ../..

cd os/win
mkdir 32
cd 32
wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-win-x86.zip
7z e node-v10.15.1-win-x86.zip node.exe -r
cd ..
mkdir 64
cd 64
wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-win-x64.zip
7z e node-v10.15.1-win-x86.zip node.exe -r
cd ../../..

cd os/linux/64
wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-linux-x64.tar.xz
tar -xf node-v10.15.1-linux-x64.tar.xz "node-v10.15.1-linux-x64/bin/node"
mv node-v10.15.1-linux-x64/bin/node ./node
cd ../../..

# mac packaging
zip  -j -9 mac.zip os/mac/install.sh os/mac/uninstall.sh os/mac/node os/mac/tor app.js messaging.js os/mac/run.sh

# linux packaging
zip  -j -9 linux.zip os/linux/install.sh os/linux/uninstall.sh os/linux/node os/linux/tor app.js messaging.js os/linux/run.sh

#windows 32-bit packaging
mkdir temp1
cd temp1
cp ../os/win/install.bat .
cp ../os/win/uninstall.bat .
mkdir node
cp ../os/win/run.bat ./node/
cp ../os/win/32/node.exe ./node/
mkdir tor
cp ../os/win/tor.exe ./tor/
cp ../os/win/*.dll ./tor/

zip -9 ../win_32.zip *
cd ..

#windows 64-bit packaging
mkdir temp2
cd temp2
cp ../os/win/install.bat .
cp ../os/win/uninstall.bat .
mkdir node
cp ../os/win/run.bat ./node/
cp ../os/win/64/node.exe ./node/
mkdir tor
cp ../os/win/tor.exe ./tor/
cp ../os/win/*.dll ./tor/

zip -9 ../win_64.zip *
cd ..
