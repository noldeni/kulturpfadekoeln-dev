#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import codecs
from data import read_entries

# Commandline arguments
# 1 Source file
# 2 Destination file

def main():
	
    source_filename = sys.argv[1]
    dest_filename = sys.argv[2]
    if len(sys.argv) > 3:
        aktiv = sys.argv[3]
    else:
        aktiv = 'X'

    with codecs.open(dest_filename, 'w', 'utf-8') as dest:
        dest.write(u'{\n')
        dest.write(u'"type": "FeatureCollection",\n\n')
        dest.write(u'"features": [')
    
        first_entry = True
        entries = read_entries(source_filename)
        for entry in entries:
            #try:
            if entry[u'map-position'] \
              and entry[u'active'] in aktiv:

                if first_entry:
                    first_entry = False
                else:
                    dest.write(u',')
                dest.write(u'\n  {\n')
                dest.write(u'    "type": "Feature",\n')
                dest.write(u'    "properties": {\n')
                
                dest.write(u'      "id": "{}.{}.{}{}"'.format(entry[u'borough-no'], entry[u'track-no'], entry[u'track-point'] or u'0', entry[u'track-sub']))
                dest.write(u',\n      "borough_no": "{}"'.format(entry[u'borough-no']))
                dest.write(u',\n      "borough": "{}"'.format(entry[u'borough']))
                dest.write(u',\n      "quarter": "{}"'.format(entry[u'quarter']))
                dest.write(u',\n      "track_no": "{}"'.format(entry[u'track-no']))
                dest.write(u',\n      "track_point": "{}"'.format(entry[u'track-point'] or u'0'))
                dest.write(u',\n      "track_sub": "{}"'.format(entry[u'track-sub']))
                dest.write(u',\n      "name": "{}"'.format(entry[u'name']))
                dest.write(u',\n      "description": "{}"'.format(entry[u'description']))
                if entry[u'wiki']:
                    dest.write(u',\n      "wiki": "{}"'.format(entry[u'wiki']))
                if entry[u'additional-info']:
                    dest.write(u',\n      "additional_info": "{}"'.format(entry[u'additional-info']))
                if entry[u'notes']:
                    dest.write(u',\n      "notes": "{}"'.format(entry[u'notes']))
                dest.write(u',\n      "color": "{}"'.format(entry[u'color']))
                #dest.write(u',\n      "active": "{}"'.format(entry[u'active']))
                dest.write(u',\n      "successor": "{}"'.format(entry[u'successor']))
                #dest.write(u',\n      "internal-note": "{}"'.format(entry[u'internal-note']))
                #dest.write(u',\n      "": "{info-position}"'.format(entry[u'info-position']))
                #dest.write(u',\n      "": "{monument-no}"'.format(entry[u'monument-no']))
                #dest.write(u',\n      "": "{info-position-state}"'.format(entry[u'info-position-state']))
                #dest.write(u',\n      "": "{map-position-state}"'.format(entry[u'map-position-state']))
                #dest.write(u',\n      "": "{description-state}"'.format(entry[u'description-state']))
                #dest.write(u',\n      "": "{building-state}"'.format(entry[u'building-state']))                
                dest.write(u'\n    },\n')
                dest.write(u'    "geometry": { ')
                dest.write(u'"type": "Point", "coordinates": {}'.format( entry[u'map-position']))
                dest.write(u'}\n')
                dest.write(u'  }')
            #except:
                #print u'error in ' + str(entry)
        dest.write(u'\n]\n')
        dest.write(u'}\n')
    
    return 0

if __name__ == '__main__':
	main()

