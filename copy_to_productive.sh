#!/bin/bash
rm -r ./productive/*
cp -r ./page/* ./productive/
mv ./productive/README_productive.md ./productive/README.md
rm ./productive/assets/js/app_old.js
