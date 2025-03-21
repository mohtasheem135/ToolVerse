export const weightConversionRates = {
    kilograms: {
      grams: 1000,
      milligrams: 1000000,
      micrograms: 1000000000,
      pounds: 2.20462,
      ounces: 35.274,
      stones: 0.157473,
      metricTons: 0.001,
      longTons: 0.000984207,
      shortTons: 0.00110231,
      carats: 5000,
      grains: 15432.3584,
      quintals: 0.01,
    },
    grams: {
      kilograms: 0.001,
      milligrams: 1000,
      micrograms: 1000000,
      pounds: 0.00220462,
      ounces: 0.035274,
      stones: 0.000157473,
      metricTons: 1e-6,
      longTons: 9.84207e-7,
      shortTons: 1.10231e-6,
      carats: 5,
      grains: 15.4323584,
      quintals: 1e-5,
    },
    milligrams: {
      kilograms: 1e-6,
      grams: 0.001,
      micrograms: 1000,
      pounds: 2.20462e-6,
      ounces: 3.5274e-5,
      stones: 1.57473e-7,
      metricTons: 1e-9,
      longTons: 9.84207e-10,
      shortTons: 1.10231e-9,
      carats: 0.005,
      grains: 0.0154323584,
      quintals: 1e-8,
    },
    micrograms: {
      kilograms: 1e-9,
      grams: 1e-6,
      milligrams: 0.001,
      pounds: 2.20462e-9,
      ounces: 3.5274e-8,
      stones: 1.57473e-10,
      metricTons: 1e-12,
      longTons: 9.84207e-13,
      shortTons: 1.10231e-12,
      carats: 0.000005,
      grains: 0.0000154324,
      quintals: 1e-11,
    },
    pounds: {
      kilograms: 0.453592,
      grams: 453.592,
      milligrams: 453592,
      micrograms: 453592000,
      ounces: 16,
      stones: 0.0714286,
      metricTons: 0.000453592,
      longTons: 0.000446429,
      shortTons: 0.0005,
      carats: 2267.96,
      grains: 7000,
      quintals: 0.000453592,
    },
    ounces: {
      kilograms: 0.0283495,
      grams: 28.3495,
      milligrams: 28349.5,
      micrograms: 28349500,
      pounds: 0.0625,
      stones: 0.00446429,
      metricTons: 2.83495e-5,
      longTons: 2.80465e-5,
      shortTons: 3.125e-5,
      carats: 141.748,
      grains: 437.5,
      quintals: 2.83495e-5,
    },
    stones: {
      kilograms: 6.35029,
      grams: 6350.29,
      milligrams: 6350290,
      micrograms: 6350290000,
      pounds: 14,
      ounces: 224,
      metricTons: 0.00635029,
      longTons: 0.00625,
      shortTons: 0.007,
      carats: 317514.5,
      grains: 100480,
      quintals: 0.00635029,
    },
    metricTons: {
      kilograms: 1000,
      grams: 1000000,
      milligrams: 1000000000,
      micrograms: 1000000000000,
      pounds: 2204.62,
      ounces: 35274,
      stones: 157.473,
      longTons: 0.984207,
      shortTons: 1.10231,
      carats: 5000000,
      grains: 154323.584,
      quintals: 10,
    },
    longTons: {
      kilograms: 1016.05,
      grams: 1016050,
      milligrams: 1016050000,
      micrograms: 1016050000000,
      pounds: 2240,
      ounces: 35840,
      stones: 160,
      metricTons: 1.01605,
      shortTons: 1.12,
      carats: 8080250,
      grains: 246944.803,
      quintals: 10.16,
    },
    shortTons: {
      kilograms: 907.185,
      grams: 907185,
      milligrams: 907185000,
      micrograms: 907185000000,
      pounds: 2000,
      ounces: 32000,
      stones: 142.857,
      metricTons: 0.907185,
      longTons: 0.892857,
      carats: 4535925,
      grains: 140000,
      quintals: 9.07185,
    },
    carats: {
      kilograms: 0.0002,
      grams: 0.2,
      milligrams: 200,
      micrograms: 200000,
      pounds: 0.000440924,
      ounces: 0.00705479,
      stones: 0.000031747,
      metricTons: 2e-7,
      longTons: 1.968e-7,
      shortTons: 2.2046e-7,
      grains: 3.086,
      quintals: 2e-5,
    },
    grains: {
      kilograms: 6.48e-5,
      grams: 0.0647989,
      milligrams: 64.7989,
      micrograms: 64798.9,
      pounds: 0.000142857,
      ounces: 0.00228571,
      stones: 0.000009143,
      metricTons: 6.48e-8,
      longTons: 6.3623e-8,
      shortTons: 7.1429e-8,
      carats: 0.3248,
      quintals: 6.48e-6,
    },
    quintals: {
      kilograms: 100,
      grams: 100000,
      milligrams: 100000000,
      micrograms: 100000000000,
      pounds: 220.462,
      ounces: 3527.4,
      stones: 15.7473,
      metricTons: 0.1,
      longTons: 0.0984207,
      shortTons: 0.110231,
      carats: 500000,
      grains: 15432.3584,
    },
  };
  
  export const weightUnits = [
    { name: "kilograms", key: "kilograms", symbol: "kg" },
    { name: "Grams", key: "grams", symbol: "g" },
    { name: "Milligrams", key: "milligrams", symbol: "mg" },
    { name: "Micrograms", key: "micrograms", symbol: "µg" },
    { name: "Pounds", key: "pounds", symbol: "lb" },
    { name: "Ounces", key: "ounces", symbol: "oz" },
    { name: "Stones", key: "stones", symbol: "st" },
    { name: "Metric Tons", key: "metricTons", symbol: "t" },
    { name: "Long Tons", key: "longTons", symbol: "lt" },
    { name: "Short Tons", key: "shortTons", symbol: "st" },
    { name: "Carats", key: "carats", symbol: "ct" },
    { name: "Grains", key: "grains", symbol: "gr" },
    { name: "Quintals", key: "quintals", symbol: "q" },
  ];
  