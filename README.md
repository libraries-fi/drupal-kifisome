# Kifi Some
Track what content visitors share to social media. The module embeds simple share buttons on pages similar to AddThis and other services, except that the users won't be spied on.

## Features
- No middleman – users are not tracked until they share something.
- Lightweight design
- Simple statistics

## Installation
The module has no dependencies.

The web server will need to be configured to pass the Access-Control-Allow-Origin header in order to allow the SVG icon pack to be loaded using an AJAX query.

## Use on a webpage
Share buttons are enabled with a single javascript tag. It is possible to pass some configuration to the script by adding data variables to the script tag.

- **data-target**: Define an existing element to use as the container.
- **data-class**: Custom CSS classes to be added.
- **data-icons**: Override SVG icons file.
- **data-style**: Override CSS file.

```html
<script src="/road/to/nowhere/kifisome.js" data-target="#my-some-buttons"></script>
```
