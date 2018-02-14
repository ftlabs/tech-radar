# Tech Radar

## Constructing the URL

Here is a working demo: https://labs.ft.com/tech-radar/?json=https%3A%2F%2Flabs.ft.com%2Ftech-radar%2Fdemo.json

### mandatory data source

Either
1. json=*URL*, e.g. https://labs.ft.com/tech-radar/demo.json
2. sheet=*GOOGLE_SPREADSHEET_SHEET_NAME*&id=*GOOGLE_SPREADSHEET_ID* (see Bertha Documentation below)

### assorted configuration parameters

An empty value (e.g. `&sortcol=&dashboard=&ringcolor=`) just falls back to the default value.

Arrays are comma separated values e.g. `param=item1,item2,item3`

Strings are just single values e.g. `param=myString`

Booleans are the value `false` or any other value, e.g. `&bool=false` is false; `&bool=true` is true,

Numbers are any positive real number. E.g. `&number=0.1`, `&number=50`

Parameters
* filter (String) - Filter the data using Regular Expressions.
* sortcol (String) - It will try to sort the column numerically and will do so if any of the items start with a number. Failing to find any numbers it will sort it alphabetically. The groups will be drawn on the graph.
* showcol (Array) - Other columns to show as headers in the table, all other information can be revealed with a click.
* dashboard (Boolean) - whether to hide the options and settings
* showtable (Boolean) - whether to show the table of data
* sortcolorder (Array) - a sorted array of names to sort the sortcol by, e.g. `group1, group2, group10`
* segment (String) - break the data into segments based on a group of a different column than sortcol e.g. `sortcolorder=date`
* ringcolor (String) - A url encoded CSS colour for the base colour for the string e.g.
..* named: 'red', 'fuchsia', 'peru', 'tomato'
..* hexadecimal: '%23FFFFFF', '%23FACADE', '%23BADA55', '%23C0FFEE'
..* hsl: 'hsl(200%2C50%25%2C50%25)'
..* **special case: 'rainbow'**
* gradient (Number between -1 and 1) - whether the gradient should get lighter or darker from the ringcolor
* proportionalrings (Boolean) - Whether to make the rings with more elements have more room.
* sorttype (String) - 'alphabetical' or 'numerical', if sorted numerically items not beginning with a number will have a value of zero.
* title (String) - Title on the Display
* crystallisation (String) - Ring to highlight
* noderepulsion (Number) - How strongly the nodes repel each other (default, 3)
* nodeattraction (Number) - How strongly the nodes are pulled to the center of the segment (default, 3)
* linewrap (Boolean) - whether to wrap the labels onto a new line per word.
* tightlabels - Whether the labels should be allowed to position freely to avoid overlapping
* quadrant (String, 'bottom right', 'bottom left', 'top left', 'top right') - what corner should the quarter circle sit in?
* css (String) - An advanced property but you can use this to override existing styles.

CSS Example - ugly but changes almost everything:

```
body, svg .mask {
  background-color: #f6e9d8 !important;
  fill: #f6e9d8 !important;
}

svg .d3-label {
  font-size: 1.5em;
  font-family: sans;
  fill: green;
}

svg .d3-label.segment-label {
  fill: yellow;
}

svg .d3-label.ring-label {
  fill: red;
}

svg .d3-label.bg {
  stroke-width: 0px !important;
}

svg circle.node {
  transform: scale(1.5);
  stroke: green;
  stroke-width: 4px;
  fill: white !important;
}
```

Any of the above parameters (including 'css') can also be entered as rows in the JSON data (or spreadsheet) with fields 'name' (for the name of the config param) and 'configvalue'. Normal data items will have a blank (or no) 'configvalue' field.

-----

# Developing

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

-----

# In-house Usage: Bertha Documentation
Bertha is an in-house Interactive Graphics application which exposes an API to turn a Google Spreadsheet into a JSON object.
Documentation for Bertha can be found in the project's wiki - https://github.com/ft-interactive/bertha/wiki/Tutorial

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

You can specify default values for the config params in the spreadsheet, e.g.

| Name          | configvalue   | date        | phase       | cost        |
| ------------- |:-------------:| -----------:| -----------:| -----------:|
| sortcol       | date          |             |             |             |
| color         | rainbow       |             |             |             |
| showcol       | phase, cost   |             |             |             |
| Data Item 1   |               | 04031982    | development | 99.95       |

Example URL:

```

Example URL: http://local.ft.com:8080/?sheet=my-information-sheet&id=12345678-ABCDEFG_ABCDEFGHIJKLMNMLKJIHGFEDCBA&sortcol=important-row&showcol=revelant-row,another-relevant-row

Demo URL: http://ftlabs.github.io/tech-radar/?id=14-BOCeYDFXQyGB4H7NRx5Vej6q9Fuh7gH93AsxEtl00&sheet=Data1&sortcol=do-able&showcol=heft

```
