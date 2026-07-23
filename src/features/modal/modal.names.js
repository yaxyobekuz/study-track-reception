/**
 * Registry of every modal name in the reception panel.
 *
 * A `<ResponsiveModal name="...">` and every `openModal("...")` call must use a
 * name from this list. Adding a new modal? Register its name here first — in dev,
 * opening an unregistered name logs a warning so typos surface immediately.
 */
export const MODAL_NAMES = [
  "bugReport",
  "downloadApp",
  "excuseRequest",

  // Lead
  "leadStatus",

  // Lead Source
  "leadSourceForm",
  "leadSourceDelete",

  // Lead Direction
  "leadDirectionForm",
  "leadDirectionDelete",

  // Lead Category
  "leadCategoryForm",
  "leadCategoryDelete",
];
