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
        tracks = {}
        entries = read_entries(source_filename)
        for entry in entries:
            if entry[u'buildings'] \
              and entry[u'active'] in aktiv:
                track_id = u'{}.{}'.format(entry[u'borough-no'], entry[u'track-no'])
                if not track_id in tracks.keys():
                    tracks[track_id] = {}
                if not entry[u'color'] in tracks[track_id].keys():
                    tracks[track_id][entry[u'color']] = []
                tracks[track_id][entry[u'color']].append(entry[u'buildings'])
                                          
        for track in tracks:
            for color in tracks[track]:
                if first_entry:
                    first_entry = False
                else:
                    dest.write(u',')
                dest.write(u'\n  {\n')
                dest.write(u'    "type": "Feature",\n')
                dest.write(u'    "properties": {\n')
                dest.write(u'      "color": "{}",\n'.format(color))
                dest.write(u'      "comment": "{}"\n'.format(track))
                dest.write(u'    },\n')
                dest.write(u'    "geometry": {"type": "MultiLineString","coordinates": [')
                first_building = True
                for building in tracks[track][color]:
                    if first_building:
                        first_building = False
                    else:
                        dest.write(u',')
                    dest.write(u'\n      {}'.format(building))
                dest.write(u'\n    ]}\n')
                dest.write(u'  }')
        dest.write(u'\n]\n')
        dest.write(u'}\n')
    
    return 0

if __name__ == '__main__':
	main()
