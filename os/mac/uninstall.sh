#!/usr/bin/env bash

FILE=helper
ID=desktop.clipboard.manager

echo " .. Removing manifest file for Google Chrome"
rm -f $HOME/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/$ID.json
echo " .. Removing manifest file for Chromium"
rm -f $HOME/Library/Application\ Support/Chromium/NativeMessagingHosts/$ID.json
echo " .. Removing manifest file for Vivaldi"
rm -f $HOME/Library/Application\ Support/Vivaldi/NativeMessagingHosts/$ID.json
echo " .. Removing manifest file for Mozilla Firefox"
rm -f $HOME/Library/Application\ Support/Mozilla/NativeMessagingHosts/$ID.json
echo " .. Removing executables"
rm -f -r $HOME/.config/$ID/

echo " .. Native Client is removed"
read -p "Press enter to continue"
