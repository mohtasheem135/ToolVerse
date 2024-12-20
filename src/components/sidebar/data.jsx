import { Calculator, NotebookPen, PencilRuler } from "lucide-react";

export const sidebarData = [
  // This is the sample way of Adding Data You can add Items, SubItems and Nested SubItems
  // {
  //   title: "Converters",
  //   icon: PencilRuler,
  //   subItems: [
  //     { title: "Unit Converters", link: "/converters/unit" },
  //     {
  //       title: "Length",
  //       subItems: [
  //         {
  //           title: "Meters to Feet",
  //           link: "/converters/length/meters-to-feet",
  //         },
  //         {
  //           title: "Kilometers to Miles",
  //           link: "/converters/length/kilometers-to-miles",
  //         },
  //       ],
  //     },
  //     { title: "Weight", link: "/converters/weight" },
  //     { title: "Temperature", link: "/converters/temperature" },
  //     // More sub-items here...
  //   ],
  // },
  {
    title: "Converter",
    icon: PencilRuler,
    subItems: [
      {
        title: "Unit Converters",
        subItems: [
          { title: "Length", link: "/converter/unit-converter/length" },
          { title: "Weight", link: "/converter/unit-converter/weight" },
          {
            title: "Temperature",
            link: "/converter/unit-converter/temperature",
          },
          { title: "Area ", link: "/converter/unit-converter/area" },
          { title: "Volume ", link: "/converter/unit-converter/volume" },
        ],
      },
      // { title: "Currency Converter", link: "/converter/currency-converter" },
      {
        title: "Date/Time Converter",
        subItems: [
          {
            title: "Time Zone Converter",
            link: "/converter/date-time-converter/time-zone-converter",
          },
          {
            title: "Day of the week Finder",
            link: "/converter/date-time-converter/day-of-the-week-finder",
          },
          {
            title: "Date Range Picker",
            link: "/converter/date-time-converter/date-range-picker",
          },
          {
            title: "Days Calculator ",
            link: "/converter/date-time-converter/business-days-calculator",
          },
          {
            title: "Custom Event Scheduler ",
            link: "/converter/date-time-converter/custom-event-scheduler",
          },
          {
            title: "Birthday Timer",
            link: "/converter/date-time-converter/birthday-timer",
          },
          {
            title: "Event Planner",
            link: "/converter/date-time-converter/event-planner",
          },
        ],
      },
      { title: "Base Converters", link: "/Converter/base-converter" },
      // { title: "Area ", link: "/Converter/area" },
      // { title: "Volume ", link: "/Converter/volume" },
    ],
  },
  {
    title: "Calculators",
    icon: Calculator,
    subItems: [
      { title: "Basic Calculator", link: "/calculators/basic" },
      { title: "Scientific Calculator", link: "/calculators/scientific" },
      // More sub-items here...
    ],
  },
  {
    title: "Text & Writing Tools",
    icon: NotebookPen,
    subItems: [
      {
        title: "Character Counter",
        link: "/text-writing-tools/character-counter",
      },
      { title: "Text to Speech", link: "/text-writing-tools/text-to-speech" },
      // More sub-items here...
    ],
  },
  // More items and subItems can be added here.
];
