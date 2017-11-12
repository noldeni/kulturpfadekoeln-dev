#!/usr/bin/env python
# -*- coding: utf-8 -*-

from openpyxl import load_workbook


# Souce columns
#0	borough-no
#1	borough
#2	quarter
#3	track-no
#4	track-point
#5	track-subpt
#6	active
#7	color
#8	successor
#9	title
#10	description
#11	description-state
#12	map-position
#13	map-position-state
#14	buildings
#15	buildings-state
#16	wiki
#17	monument-no
#18	info-position
#19	info-osm
#20	info-state
#21	additional-info
#22	notes
#23	internal-notes
#24	internal-todo
#25	overall-state


def get_value(row, index):
    try:
        value = row[index].value
        if not value:
            return u''
        try:
            return str(value)
        except UnicodeEncodeError:
            return value
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
        entry[u'track-subpt'] = get_value(row, 5)
        entry[u'active'] = get_value(row, 6)
        entry[u'color'] = get_value(row, 7)
        entry[u'successor'] = get_value(row, 8)
        entry[u'title'] = get_value(row, 9)
        entry[u'description'] = get_value(row, 10)
        entry[u'description-state'] = get_value(row, 11)
        entry[u'map-position'] = get_value(row, 12)
        entry[u'map-position-state'] = get_value(row, 13)
        entry[u'buildings'] = get_value(row, 14)
        entry[u'buildings-state'] = get_value(row, 15)
        entry[u'wiki'] = get_value(row, 16)
        entry[u'monument-no'] = get_value(row, 17)
        entry[u'info-position'] = get_value(row, 18)
        entry[u'info-osm'] = get_value(row, 19)
        entry[u'info-state'] = get_value(row, 20)
        entry[u'additional-info'] = get_value(row, 21)
        entry[u'notes'] = get_value(row, 22)
        entry[u'internal-notes'] = get_value(row, 23)

        entries.append(entry)
    return entries

