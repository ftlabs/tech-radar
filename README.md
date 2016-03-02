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

There are four parameters :

1. sheet - sheet name (mandatory)
2. id - spreadsheet id (mandatory)
3. sortcol - column to sort by and to graph, defaults to 'phase'
4. showcol - a comma seperated list of other columns to reveal in the table

The mandatory parameters point to a specific Google spreadsheet (that has been published to JSON via Bertha). 

Open the spreadsheet you want to display and copy the UID of the document. This will be the value for the `id` parameter.
The `sheet` parameter is the name of the sheet in the spreadsheet document that contains the information you wish to display.

`sortcol` - It will try to sort the column numerically and will do so if any of the items start with a number. Failing to find any numbers it will sort it alphabetically. The groups will be drawn on the graph.

`showcol` - Other columns to show as headers in the table, all other information can be revealed with a click.

Example URL:

```

Example URL: http://local.ft.com:8080/?sheet=my-information-sheet&id=12345678-ABCDEFG_ABCDEFGHIJKLMNMLKJIHGFEDCBA&sortcol=important-row&showcol=revelant-row,another-relevant-row```

Demo URL: http://ftlabs.github.io/tech-radar/?id=14-BOCeYDFXQyGB4H7NRx5Vej6q9Fuh7gH93AsxEtl00&sheet=Data1&sortcol=do-able&showcol=heft

```

## Constructing the spreadsheet

You can create a new google spreadsheet quite easily, shared to be viewable by all in the FT, paying attention to the UUID in the url and the name of the sheet.

The latest contents of the spreadsheet are exported to Bertha, via a similar url constructed from the spreadsheet's UUID and sheet name.

* https://bertha.ig.ft.com/republish/publish/gss/UUID/SheetName

Bertha then exposes a JSON feed of the spreadsheet's contents, accessible via a slightly different URL.

* https://bertha.ig.ft.com/view/publish/gss/UUID/SheetName

The first row of the spreadsheet needs to name the following columns as a minimum:

* *name* : values can be any text, but the shorter the better to minimise overlaps in the display.
* *do-able* : values need to integers in the range 1-10 (for now).

All other named columns with be available for filtering in the radar view and can take pretty much any values.

You can then create a Tech radar view of that spreadsheet by constructing a URL as descriobed in the previous section

* http://whereveryourserveris/?sheet=SheetName&id=UUID
