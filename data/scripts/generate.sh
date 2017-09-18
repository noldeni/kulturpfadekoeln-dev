#!/bin/bash

./infos_csv_to_geojson.py ../info.xlsx ../geojson/starts.geojson S
./infos_csv_to_geojson.py ../info.xlsx ../geojson/infos.geojson X
./infos_csv_to_geojson.py ../info.xlsx ../geojson/test.geojson T
./buildings_csv_to_geojson.py ../info.xlsx ../geojson/buildings.geojson X
