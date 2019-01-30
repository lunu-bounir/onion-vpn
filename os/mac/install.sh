#!/usr/bin/env bash

cd "$(dirname "$0")"

FILE=helper
ID=native.helper
DESCRIPTION="native part of the Clipboard History Manager extension"

echo ".. Copy files to $HOME/.config/$ID/"
mkdir -p $HOME/.config/$ID/
cp run.sh $HOME/.config/$ID/
cp node $HOME/.config/$ID/
cp app.js $HOME/.config/$ID/
cp messaging.js $HOME/.config/$ID/

cat > $ID.json <<- EOM
{
  "name": "$ID",
  "description": "$DESCRIPTION",
  "path": "$HOME/.config/$ID/run.sh",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://ddeefmboniaokefbppleacoegfagifab/",
    "chrome-extension://empcclfpdmhckpdfpgljnbbkcakfnbho/"
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
  "path": "$HOME/.config/$ID/run.sh",
  "type": "stdio",
  "allowed_extensions": ["0472a3daed8fd439836efd3c54d94e90f6c46018@temporary-addon"]
}
EOM

echo ".. Clean-up"
rm $ID.json

echo ".. Done!"
read -p "Press enter to continue"
