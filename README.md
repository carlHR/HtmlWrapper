------
# HTML Wrapper

This python script has one goal: to build an HTML file.

What it does is simple: it iterates over 4 types of folders with those exact names (they're case sensitive depending on the OS): `textures`, `scripts`, `styles` and `data`; and writes each of those file's contents inside the HTML page as specified below.

Folders:
- textures: must contain PNG files. I was too lazy to support other img formats. It writes image data using base64 encoding.
- data: writes data using base64 encoding script tags with text/plaintext format.
- scripts: writes data using script tags with text/javascript format.
- styles: writes data using style tags with text/css format.

In contrast with HTML files handled by a server, these files are meant to be offline. 

There's no need anymore to host textures, scripts, styles and data elsewhere, if the file can carry all of those from the time it's created.

------
# Base64 support

I've placed a single script inside the scripts folder: data.js; This script loads a Base64 class used to handle base64 encoding. The reason is because I once attempted to use base64 with builtin support from JS, and it was a mess. This one ensures it translates data correctly from python's base64 module, and back.

Furthermore, you can use two functions from the code: `plaintext` and `binary`, which are used to load data from script tags, which were wrapped from files from the data folder.

------
# Include support

Inside each JS file, you can place comments using `//` to insert includes. The syntax is close to C: `// #include "relative-filename"`. Filenames are relative to the scripts folder. This tells the wrapper the include order of each file within the script.

For example, if you have your scripts folder as follows:
- A.js
- B.js
- C.js
- data.js

And each custom script has its own content defined as:

A.js:
```
// #include "B.js"
// #include "C.js"

[...]
```

B.js:
```
// #include "data.js"
// #include "C.js"

[...]
```

C.js:
```
// #include "data.js"

[...]
```

HtmlWrapper will produce the following html file:

```
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
</head>
<body>
	<script id="@data">[...]</script>
	<script id="@C.js"></script>
	<script id="@B.js"></script>
	<script id="@A.js"></script>
</body>
</html>
```

>>> I didn't test it for placing those includes inside functions, nor at any other given scope. I didn't tested recursive includes. I doubt they'll work or crash the app. In case of trouble, you're on your own. Those includes will just fine tune the order at which each script is wrapped inside the body, they have no other reason or goal.
