# Tech Radar

## Building

Requires origami build tools setup.

```
npm install
npm run build
```

## Running

Tech-radar has no server compenent, all of the resources are static. To view them locally, you can spin up a simple server to deliver the files, using something like `python -m SimpleHTTPServer 3010`.

## Displaying information

If you head to `http://localhost:3010/` you'll be presented with a rainbow, but no information will be visible. This is because you need to pass two URL parameters for tech radar to generate a chart.

There are two parameters :

1. sheet
2. id

These parameters point to a specific Google spreadsheet (that has been published to JSON via Bertha). 

Open the spreadsheet you want to display and copy the UID of the document. This will be the value for the `id` parameter.
The `sheet` parameter is the name of the sheet in the spreadsheet document that contains the information you wish to display.

Example URL:

```http://local.ft.com:8080/?sheet=my information sheet&id=12345678-ABCDEFG_ABCDEFGHIJKLMNMLKJIHGFEDCBA```
