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
                
                dest.write(u'      "id": "{}.{}.{}{}"'.format(entry[u'borough-no'], entry[u'track-no'], entry[u'track-point'] or u'0', entry[u'track-subpt']))
                dest.write(u',\n      "borough_no": "{}"'.format(entry[u'borough-no']))
                dest.write(u',\n      "borough": "{}"'.format(entry[u'borough']))
                dest.write(u',\n      "quarter": "{}"'.format(entry[u'quarter']))
                dest.write(u',\n      "track_no": "{}"'.format(entry[u'track-no']))
                dest.write(u',\n      "track_point": "{}"'.format(entry[u'track-point'] or u'0'))
                dest.write(u',\n      "track_subpt": "{}"'.format(entry[u'track-subpt']))
                dest.write(u',\n      "title": "{}"'.format(entry[u'title']))
                dest.write(u',\n      "description": "{}"'.format(entry[u'description']))
                # combine additional info
                text = u''
                if entry[u'wiki'] and entry[u'wiki'][0] <> u'#':
                    lis = entry[u'wiki'].split(u',') or [entry[u'wiki']]
                    for li in lis:
                        l = li.split(u'[') or li
                        l.append(u']')
                        text += u'<li><a target=\\"_blank\\" href=\\"https://de.wikipedia.org/wiki/{}\\">Wikipedia {}</a></li>'.format(l[0], l[1][:-1]);
                if entry[u'monument-no'] and entry[u'monument-no'][0] <> u'#':
                    lis = entry[u'monument-no'].split(u',') or [entry[u'monument-no']]
                    for li in lis:
                        l = li.split(u'[') or li
                        l.append(u']')
                        text += u'<li><a target=\\"_blank\\" href=\\"http://www.bilderbuch-koeln.de/Denkmale/{}\\">Denkmalliste {}</a></li>'.format(l[0], l[1][:-1]);
                
                if entry[u'additional-info']:
                    text += entry[u'additional-info']
                if text:
                    dest.write(u',\n      "additional_info": "{}"'.format(text))
                if entry[u'notes']:
                    dest.write(u',\n      "notes": "{}"'.format(entry[u'notes']))
                if entry[u'internal-notes']:
                    dest.write(u',\n      "internal_notes": "{}"'.format(entry[u'internal-notes']))
                if entry[u'active'] == u'T':
                    dest.write(u',\n      "color": "{}"'.format(u'#3300ff'))
                elif entry[u'active'] == u'S':
                    dest.write(u',\n      "color": "{}"'.format(u'#ffffff'))
                else:
                    dest.write(u',\n      "color": "{}"'.format(entry[u'color']))
                dest.write(u',\n      "successor": "{}"'.format(entry[u'successor']))
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

