#!/usr/bin/env bash

cd "$(dirname "$0")"

ID=onion.vpn.helper
DESCRIPTION="native part of the Onion VPN extension"

echo ".. Copy files to $HOME/.config/$ID/"
mkdir -p $HOME/.config/$ID/
cp assets/node.sh $HOME/.config/$ID/
cp assets/node $HOME/.config/$ID/
cp assets/tor $HOME/.config/$ID/
cp assets/app.js $HOME/.config/$ID/
cp assets/messaging.js $HOME/.config/$ID/

cat > $ID.json <<- EOM
{
  "name": "$ID",
  "description": "$DESCRIPTION",
  "path": "$HOME/.config/$ID/node.sh",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://diekiockdlleigoinkcjjkpnpapbkfbo/",
    "chrome-extension://laodgoeoeloaponlioalomjadbmkkkhd/"
  ]
}
EOM

echo ".. Copy Google Chrome manifest to $HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
cp $ID.json "$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts/"

echo ".. Copy Chromium manifest to $HOME/Library/Application Support/Chromium/NativeMessagingHosts"
cp $ID.json "$HOME/Library/Application Support/Chromium/NativeMessagingHosts/"

echo ".. Copy Vivaldi manifest to $HOME/Library/Application Support/Vivaldi/NativeMessagingHosts"
cp $ID.json "$HOME/Library/Application Support/Vivaldi/NativeMessagingHosts/"

echo ".. Copy Mozilla Firefox manifest to $HOME/Library/Application Support/Mozilla/NativeMessagingHosts"
cat > "$HOME/Library/Application Support/Mozilla/NativeMessagingHosts/$ID.json" <<- EOM
{
  "name": "$ID",
  "description": "$DESCRIPTION",
  "path": "$HOME/.config/$ID/node.sh",
  "type": "stdio",
  "allowed_extensions": ["{4d0fd54a-4590-45af-a943-60330144f676}"]
}
EOM

echo ".. Clean-up"
rm $ID.json

echo ".. Done!"
read -p "Press enter to continue"
