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

def read_entries(source_filename):
	
    entries = []
    
    wb = load_workbook(filename=source_filename, read_only=True)
    ws = wb['kulturpfadekoeln']

    for row in ws.rows:
            
        entry = {}
        entry[u'borough-no'] = row[0].value or u''
        entry[u'borough'] = row[1].value or u''
        entry[u'quarter'] = row[2].value or u''
        entry[u'track-no'] = row[3].value or u''
        entry[u'track-point'] = row[4].value or u''
        entry[u'track-sub'] = row[5].value or u''
        entry[u'name'] = row[6].value or u''
        entry[u'description'] = row[7].value or u''
        entry[u'map-position'] = row[8].value or u''
        entry[u'buildings'] = row[9].value or u''
        entry[u'wiki'] = row[10].value or u''
        entry[u'additional-info'] = row[11].value or u''
        entry[u'notes'] = row[12].value or u''
        entry[u'color'] = row[13].value or u''
        entry[u'active'] = row[14].value or u''
        entry[u'successor'] = row[15].value or u''
        entry[u'internal-note'] = row[16].value or u''
        entry[u'info-position'] = row[17].value or u''
        entry[u'monument-no'] = row[18].value or u''
        entry[u'info-position-state'] = row[19].value or u''
        entry[u'map-position-state'] = row[20].value or u''
        entry[u'description-state'] = row[21].value or u''
        entry[u'building-state'] = row[22].value or u''
        
        entries.append(entry)

    return entries

