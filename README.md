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

## Constructing the URL

There are two parameters :

1. sheet
2. id

These parameters point to a specific Google spreadsheet (that has been published to JSON via Bertha). 

Open the spreadsheet you want to display and copy the UID of the document. This will be the value for the `id` parameter.
The `sheet` parameter is the name of the sheet in the spreadsheet document that contains the information you wish to display.

Example URL:

```http://local.ft.com:8080/?sheet=my information sheet&id=12345678-ABCDEFG_ABCDEFGHIJKLMNMLKJIHGFEDCBA```

## Constructing the spreadsheet

You can create a new google spreadsheet quite easily, shared to be viewable by all in the FT, paying attention to the UUID in the url and the name of the sheet.

The latest contents of the spreadsheet are exported to Bertha, via a similar url constructed from the spreadsheet's UUID and sheet name.

* http://bertha.ig.ft.com/republish/publish/gss/UUID/SheetName

Bertha then exposes a JSON feed of the spreadsheet's contents, accessible via a slightly different URL.

* http://bertha.ig.ft.com/view/publish/gss/UUID/SheetName

The first row of the spreadsheet needs to name the following columns as a minimum:

* name
* do-able

All other named columns with be available for filtering on the radar view.

You can then create a Tech radar view of that spreadsheet by constructing a URL as descriobed in the previous section

* http://whereveryourserveris/?sheet=SheetName&id=UUID
