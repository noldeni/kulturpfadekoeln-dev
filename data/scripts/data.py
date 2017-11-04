#!/usr/bin/env python
# -*- coding: utf-8 -*-

from openpyxl import load_workbook


# Souce columns
#  0  Stadtbezirk-Nr. borough-no
#  1  Stadtbezirk borough
#  2  Stadtteil  quarter
#  3  Tour-Nr track-no
#  4  Tourpunkt track-point
#  5  Unterteilung  track-sub
#  6  Name  name
#  7  Beschreibung  description
#  8  Marker map-position
#  9  Buildings  buildings
# 10  Wikipedia  wiki
# 11  Infos additional-info
# 12  Hinweise notes
# 13  Farbe  color
# 14  Aktiv  active
# 15  Nachfolger successor
# 16  Interner Hinweis  internal-note
# 17  Info  info-position 
# 18  Denkmal monument-no
# 19  InfoStatus  info-position-state
# 20  GeoStatus map-position-state
# 21  TextStatus  description-state
# 22  BuildingStatus  building-state

def get_value(row, index):
    try:
        return row[index].value
    except IndexError:
        return u''

def read_entries(source_filename):
	
    entries = []
    
    wb = load_workbook(filename=source_filename, read_only=True)
    ws = wb['kulturpfadekoeln']

    for row in ws.rows:
            
        entry = {}
        entry[u'borough-no'] = get_value(row, 0)
        entry[u'borough'] = get_value(row, 1)
        entry[u'quarter'] = get_value(row, 2)
        entry[u'track-no'] = get_value(row, 3)
        entry[u'track-point'] = get_value(row, 4)
        entry[u'track-sub'] = get_value(row, 5)
        entry[u'name'] = get_value(row, 6)
        entry[u'description'] = get_value(row, 7)
        entry[u'map-position'] = get_value(row, 8)
        entry[u'buildings'] = get_value(row, 9)
        entry[u'wiki'] = get_value(row, 10)
        entry[u'additional-info'] = get_value(row, 11)
        entry[u'notes'] = get_value(row, 12)
        entry[u'color'] = get_value(row, 13)
        entry[u'active'] = get_value(row, 14)
        entry[u'successor'] = get_value(row, 15)
        entry[u'internal-note'] = get_value(row, 16)
        entry[u'info-position'] = get_value(row, 17)
        entry[u'monument-no'] = get_value(row, 18)
        entry[u'info-position-state'] = get_value(row, 19)
        entry[u'map-position-state'] = get_value(row, 20)
        entry[u'description-state'] = get_value(row, 21)
        entry[u'building-state'] = get_value(row, 22)
        
        entries.append(entry)
    return entries

