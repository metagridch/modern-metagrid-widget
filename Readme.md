# Metagrid widget 2.0

This is a more modern, vanilla metagrid widget. It can replace the older [jquery implementation](https://github.com/metagridch/metagrid-jquery-widget). 

* You don't want to use jquery anymore
* You don't want to use jsonp because of security considerations
* You want to use the metagrid-api client in a framework like vue/svelte or similar

## Modern browsers only

This widget supports modern browsers only. So you may thin twice before using it. [Around 95%+](https://caniuse.com/es6-module-dynamic-import) of all internet users can display the widget, but maybe your local government agency still relays on IE11.

**Supported browsers:**
* No IE11
* Chrome >=87
* Firefox >=78
* Safari >=13
* Edge >=88

You could work around those limitation, but it's faster to just use the jquery plugin or build it out by yourself.

## install

```bash
nmp install @metagrid/modern-metagrid-widget
```

## Features

* Easy to use js-widget to interact with metagrid API and to display a list of links from metagrid.
* Includes an api-client usable in a framework like vue/svelte or angular
* No styles and no invasive js

## Usage

Install the lib over `npm install modern-metagrid-widget` or download the latest release.

### Terminology

* **Provider slug**: The reference we use in metagrid to identify your project. You can find a list of all providers on the wiki.

  _Example: For dodis.ch the provider slug is dodis_
* **Identifier**: The part of the url, that identifies a single person in your project. Often this is a database id, the name of the person or an uid. Metagrid uses the identifier as a reference for the person.

  _Example: In https://dodis.ch/P5 we use 5 as an identifier_


### Basic example

Include the `/dist/metagrid-widget.es.js` file as **type module** into your html. Then call `widget(el: HtmlElement, projectSlug: string, identifier: string, language?: string, includeDescription?: boolean);` This will mount the widget on the element el and shows the list of links.

In this example we load the widget for the provider `dodis` and identifier `5`. These are the links for the person [Max Petitpiere ](https://dodis.ch/P5) on dodis.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>This is a metagrid example</title>
</head>
<body>
<div id="metagrid-widget"></div>
<script type="module">
    import { widget } from "./dist/metagrid-widget.es.js";
    widget(document.getElementById('metagrid-widget'), 'dodis', '5');
</script>
</body>
</html>
```

### Extended example

Most often the identifier of a resource is present in the url. In this example we will extract the identifier from the url and then call to the widget. In this example we change the `language` to french and set the `includeDescription` parameter to true. This will load a description for each provider from the server and display it as a title on the link. This can give the user more insights about the link 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>This is a metagrid example</title>
</head>
<body>
<div id="metagrid-widget"></div>
<script type="module">
    import {widget} from "./dist/metagrid-widget.es.js";
    const matches = window.location.href.match(/(\d+)$/);
    if(matches !== null) {
        const id = matches[1];
        widget(document.getElementById('metagrid-widget'), 'dodis', id, 'fr', true);
    }
</script>
</body>
</html>
```


## Filter providers

Often you just want to display selected providers and not all of them. This should be done in the metagrid api and not with javascript. Then the api will just deliver the selected providers. For support please contact us or send us a pr [source.dodis.ch/metagrid-go/metagrid-go](https://source.dodis.ch/metagrid-go/metagrid-go/-/tree/master/pkg/provider)

## Development

If you find bugs you an open an issue or send us a pull request. We welcome contributions!

This is a vite project with a customized rollup config. To develop you can run `yarn dev`. To build the project run `yarn build && yarn build:types`. 
