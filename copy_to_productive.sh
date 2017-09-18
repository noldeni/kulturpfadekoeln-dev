#!/bin/bash
rm -r ./productive/*
cp -r ./page/* ./productive/
rm ./productive/assets/js/app_old.js
cd ./productive
git gui
cd ..
rm -r ./productive/*
