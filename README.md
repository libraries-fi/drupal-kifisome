# Kifi Some
Track what content visitors share to social media. The module embeds simple share buttons on pages similar to AddThis and other services, except that the users won't be spied on. This module is made for Drupal 8.

## Features
- No middleman – users are not tracked until they share something.
- Lightweight design
- Simple statistics

## Installation
The module has no dependencies.

The web server will need to be configured to pass the Access-Control-Allow-Origin header in order to allow the SVG icon pack to be loaded using an AJAX query.

## Use on a webpage
Share buttons are enabled with a single javascript tag. It is possible to pass some configuration to the script by adding data variables to the script tag.

- **data-buttons**: Define the set of enabled share buttons.
- **data-target**: Define an existing element to use as the container.
- **data-id**: Define an ID for the wrapping element.
- **data-class**: Custom CSS classes to be added.
- **data-icons**: Override SVG icons file.
- **data-style**: Override CSS file.
- **data-home**: Override URL used for tracking shares.
- **date-title**: Display text before the buttons.

```html
<script src="/road/to/nowhere/kifisome.js" data-target="#my-some-buttons"></script>
```
