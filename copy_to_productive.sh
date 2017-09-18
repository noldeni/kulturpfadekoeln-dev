#!/bin/bash
rm -r ./productive/*
cp -r ./page/* ./productive/
rm ./productive/assets/js/app_old.js
git gui
rm -r ./productive/*
