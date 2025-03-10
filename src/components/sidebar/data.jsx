import { CalendarClock, Image, Landmark, NotebookPen, PencilRuler } from "lucide-react";

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
    title: "Unit Converters",
    icon: PencilRuler,
    subItems: [
      { title: "Length", link: "/unit-converter/length" },
      { title: "Weight", link: "/unit-converter/weight" },
      {
        title: "Temperature",
        link: "/unit-converter/temperature",
      },
      { title: "Area ", link: "/unit-converter/area" },
      { title: "Volume ", link: "/unit-converter/volume" },
    ],
  },
  {
    title: "Date/Time",
    icon: CalendarClock,
    subItems: [
      {
        title: "Time Zone Converter",
        link: "/date-time/time-zone-converter",
      },
      {
        title: "Day of the week Finder",
        link: "/date-time/day-of-the-week-finder",
      },
      {
        title: "Work Days Calculator ",
        link: "/date-time/work-days-calculator",
      },
      {
        title: "Birthday/Age Calculator ",
        link: "/date-time/birthday-calculator",
      },
      {
        title: "Universal Calendar Viewer ",
        link: "/date-time/universal-calendar-viewer",
      },
      {
        title: "Multi Stopwatch ",
        link: "/date-time/multi-stopwatch",
      },
    ],
  },
  {
    title: "Image Tools",
    icon: Image,
    subItems: [
      { title: "Image Converter", link: "/image-tools/image-converter" },
      {
        title: "Gaussian Noise Generator",
        link: "/image-tools/gaussian-noise-generator",
      },
      // work in progress
      // {
      //   title: "Text to Image Generator",
      //   link: "/image-tools/text-to-image-generator",
      // },
      {
        title: "Image Stat Extractor",
        link: "/image-tools/image-stat-extractor",
      },
      {
        title: "Image Composite",
        link: "/image-tools/image-composite",
      },
      {
        title: "Image Operations",
        link: "/image-tools/image-operations",
      },
      {
        title: "Image Color Manipulation",
        link: "/image-tools/color-manipulation",
      },
    ],
  },
  {
    title: "Finace Tools",
    icon: Landmark,
    subItems: [
      {
        title: "Inflation Calculator",
        link: "/finance-tools/inflation-calculator",
      },
      {
        title: "Compound Interest Calculator",
        link: "/finance-tools/compound-interest-calculator",
      },
      {
        title: "Amortization Calculator",
        link: "/finance-tools/amortization-calculator",
      },
      {
        title: "Tax Calculator",
        link: "/finance-tools/tax-calculator",
      },
      {
        title: "Retirement Savings Calculator",
        link: "/finance-tools/retirement-savings-calculator",
      },
    ],
  },
  {
    title: "Content Writing Tools",
    icon: NotebookPen,
    subItems: [
      {
        title: "Keyword Density Checker",
        link: "/content-writing-tools/keyword-density-checker",
      },
      {
        title: "Citation Generator",
        link: "/content-writing-tools/citation-generator",
      },
      
    ],
  },

  // {
  //   title: "Converter",
  //   icon: PencilRuler,
  //   subItems: [
  //     {
  //       title: "Unit Converters",
  //       subItems: [
  //         { title: "Length", link: "/converter/unit-converter/length" },
  //         { title: "Weight", link: "/converter/unit-converter/weight" },
  //         {
  //           title: "Temperature",
  //           link: "/converter/unit-converter/temperature",
  //         },
  //         { title: "Area ", link: "/converter/unit-converter/area" },
  //         { title: "Volume ", link: "/converter/unit-converter/volume" },
  //       ],
  //     },
  //     // { title: "Currency Converter", link: "/converter/currency-converter" },
  // {
  //   title: "Date/Time Converter",
  //   subItems: [
  //     {
  //       title: "Time Zone Converter",
  //       link: "/converter/date-time-converter/time-zone-converter",
  //     },
  //     {
  //       title: "Day of the week Finder",
  //       link: "/converter/date-time-converter/day-of-the-week-finder",
  //     },
  //     {
  //       title: "Work Days Calculator ",
  //       link: "/converter/date-time-converter/work-days-calculator",
  //     },
  //     {
  //       title: "Birthday/Age Calculator ",
  //       link: "/converter/date-time-converter/birthday-calculator",
  //     },
  //     {
  //       title: "Universal Calendar Viewer ",
  //       link: "/converter/date-time-converter/universal-calendar-viewer",
  //     },
  //   ],
  // },
  //     { title: "Base Converters", link: "/converter/base-converter" },
  //     // { title: "Area ", link: "/Converter/area" },
  //     // { title: "Volume ", link: "/Converter/volume" },
  //   ],
  // },

  // {
  //   title: "Calculators",
  //   icon: Calculator,
  //   subItems: [
  //     { title: "Basic Calculator", link: "/calculators/basic" },
  //     { title: "Scientific Calculator", link: "/calculators/scientific" },
  //     // More sub-items here...
  //   ],
  // },

  // {
  //   title: "Text & Writing Tools",
  //   icon: NotebookPen,
  //   subItems: [
  //     {
  //       title: "Character Counter",
  //       link: "/text-writing-tools/character-counter",
  //     },
  //     { title: "Text to Speech", link: "/text-writing-tools/text-to-speech" },
  //     // More sub-items here...
  //   ],
  // },
  // More items and subItems can be added here.
];
