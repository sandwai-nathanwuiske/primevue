Changes:

- Added disabled prop to Calendar.vue
- Add auto focus to Dropdown.vue onOverlayAfterEnter function
- Stripped down `resolveFieldData` in `ObjectUtils.js` to increase display/sort/search speed.
- Changed global `CONTAINS` filter to use new regex string matching functionality

TODO
- Removed `DomHandler.clearSelection` from `onRowRightClick` in `DataTable.vue` to allow copying data from DataTable fields.
