from functools import cmp_to_key
import traceback
import base64
import sys
import os
import re

# Creates an .html file, wrapping <style> <img> <script> tags inside it, based on each folder.
# 
# folders:
# ./data
#   writes data using base64 encoding into script plain text tags.
#   id is set to relative filename.
#
# ./styles
#   writes data using style tags inside header block
#   id is set to relative filename.
#
# ./scripts
#   writes data using script javascript tags, based on include order.
#   in order to include other script files, use `// #include "filename"` as a comment inside the script file
#   this line is always removed after wrapping code
#
# ./textures
#   writes texture data inside img tags, using base64 encoding.
#   id is set to relative filename.

# This is the HTML template that will generate the file.
# It's currently empty. Feel free to edit it.
html = '''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%s</title>
%s
</head>
<body>
%s
</body>
</html>
'''

def main(title, output):
	head = ''
	body = ''

	try:
		# Wrap all styles
		for i, fn in enumerate(os.listdir('styles')):
			with open(os.path.join('styles', fn), 'rb') as fp:
				data = fp.read().decode('utf-8')
				head += ('<style>' + data + '</style>\n')

		# Wrap all textures
		body += '<div style="display: none" id="@textures">\n'
		for i, fn in enumerate(os.listdir('textures')):
			with open(os.path.join('textures', fn), 'rb') as fp:
				data = fp.read()
				body += ('<img id="@%s" src="data:image/png;base64, %s">\n' % (fn, base64.b64encode(data).decode('utf-8')))
		body += "</div>\n"

		# Wrap all data
		for i, fn in enumerate(os.listdir('data')):
			with open(os.path.join('data', fn), 'rb') as fp:
				data = fp.read()
				body += ('<script id="@' + fn + '" type="text/plaintext">' + base64.b64encode(data).decode('utf-8') + '</script>\n')

		# Wrap all scripts
		includes = {}
		for i, fn in enumerate(os.listdir('scripts')):
			with open(os.path.join('scripts', fn), 'rb') as fp:
				data = fp.read().decode('utf-8')

				tmp = []
				matches = re.finditer('//[ \t]+#include[ \t]+"(.+)"', data)
				for m in matches:
					tmp.append(m.group(1))
				includes[fn] = tmp

		changed = True
		while (changed):
			changed = False
			for i, (k, v) in enumerate(includes.items()):
				for j, fnA in enumerate(v):
					for k, fnB in enumerate(includes[fnA]):
						if (fnB not in v):
							v.append(fnB)
							changed = True
							break
					if (changed):
						break
				if (changed):
					break

		def cmp_incs(a, b):
			if (a[0] in b[1]):
				return -1
			elif (b[0] in a[1]):
				return 1
			else:
				return 0

		includes = list(includes.items())
		includes.sort(key=cmp_to_key(cmp_incs))

		for i, fn in enumerate(includes):
			with open(os.path.join('scripts', fn[0]), 'rb') as fp:
				data = fp.read().decode('utf-8')
				body += ('<script id="@%s" type="text/javascript">%s</script>\n' % (fn[0], data))

	except FileNotFoundError as err:
		print(err)
		print(traceback.format_exc())
		return False
	except Exception as err:
		print(err)
		print(traceback.format_exc())
		return False
	else:
		text = html % (title, head, body)

		try:
			fp = open(output, 'wb')
		except:
			return False
		else:
			fp.write(text.encode('utf-8'))
			fp.close()
			return True

if __name__ == '__main__':
	# Accepts two arguments:
	# - Title, which will appear on HTML page
	# - Output, which is the filename that this app will create
	if (main(sys.argv[1], sys.argv[2])):
		print('Success!')
