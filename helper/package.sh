#! /bin/bash

# get the official tor executable from www.torproject.org
cd helper/os/mac
wget -O TorBrowser.dmg https://www.torproject.org/dist/torbrowser/8.0.5/TorBrowser-8.0.5-osx64_en-US.dmg
dmg2img TorBrowser.dmg TorBrowser.img
7z e TorBrowser.img tor.real -r
mv tor.real tor
chmod +x tor
cd ../..

cd os/win
wget https://www.torproject.org/dist/torbrowser/8.0.5/tor-win32-0.3.5.7.zip
7z e tor-win32-0.3.5.7.zip tor.exe *.dll -r
cd ../..

cd os/linux
mkdir 32
cd 32
# wget https://www.torproject.org/dist/torbrowser/8.0.5/tor-browser-linux32-8.0.5_en-US.tar.xz
# tar -xf tor-browser-linux32-8.0.5_en-US.tar.xz "tor-browser_en-US/Browser/TorBrowser/Tor/tor"
# mv tor-browser_en-US/Browser/TorBrowser/Tor/tor ./tor
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
7z e node-v10.15.1-win-x64.zip node.exe -r
cd ../../..

cd os/linux/64
wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-linux-x64.tar.xz
tar -xf node-v10.15.1-linux-x64.tar.xz "node-v10.15.1-linux-x64/bin/node"
mv node-v10.15.1-linux-x64/bin/node ./node
cd ../../..

# mac packaging
mkdir temp1
cd temp1
cp ../os/mac/install.sh .
cp ../os/mac/uninstall.sh .
mkdir assets
cp ../os/mac/node assets/
cp ../os/mac/tor assets/
cp ../app.js assets/
cp ../messaging.js assets/
cp ../os/mac/node.sh assets/

zip -9 ../mac.zip * -r
cd ..

# linux 64-bit packaging
# mkdir temp2
# cd temp2
# cp ../os/linux/install.sh .
# cp ../os/linux/uninstall.sh .
# mkdir assets
# cp ../os/linux/64/node assets/
# cp ../os/linux/64/tor assets/
# cp ../app.js assets/
# cp ../messaging.js assets/
# cp ../os/mac/node.sh assets/

# zip -9 ../linux_64.zip * -r
# cd ..

#windows 32-bit packaging
mkdir temp3
cd temp3
cp ../os/win/install.bat .
cp ../os/win/uninstall.bat .
mkdir assets
mkdir assets/node
cp ../os/win/node.bat ./assets/node/
cp ../os/win/32/node.exe ./assets/node/
mkdir assets/tor
cp ../os/win/tor.exe ./assets/tor/
cp ../os/win/*.dll ./assets/tor/
cp ../app.js assets/
cp ../messaging.js assets/

zip -9 ../win_32.zip * -r
cd ..

#windows 64-bit packaging
mkdir temp4
cd temp4
cp ../os/win/install.bat .
cp ../os/win/uninstall.bat .
mkdir assets
mkdir assets/node
cp ../os/win/node.bat ./assets/node/
cp ../os/win/64/node.exe ./assets/node/
mkdir assets/tor
cp ../os/win/tor.exe ./assets/tor/
cp ../os/win/*.dll ./assets/tor/
cp ../app.js assets/
cp ../messaging.js assets/

zip -9 ../win_64.zip * -r
cd ..
