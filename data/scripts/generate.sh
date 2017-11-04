#!/bin/bash

./infos_csv_to_geojson.py ../info.xlsx ../../page/data/geojson/starts.geojson S
./infos_csv_to_geojson.py ../info.xlsx ../../page/data/geojson/infos.geojson X
./infos_csv_to_geojson.py ../info.xlsx ../../page/data/geojson/test.geojson T
./buildings_csv_to_geojson.py ../info.xlsx ../../page/data/geojson/buildings.geojson X
