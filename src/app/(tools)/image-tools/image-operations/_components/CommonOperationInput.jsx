import React from "react";
import { Slider } from "@/components/ui/slider";

const CommonOperationInput = ({
  operation,
  operationValue,
  setOperationValue,
}) => {

    const handleRotateDegreeChange = (newValue) => {
        setOperationValue(newValue);
      };

  return (
    <div>
      {/* {operation === "rotate" && (
        <div className="py-10 space-y-3">
          <p className="text-gray-500">{operationValue} Degree</p>
          <Slider
            onValueChange={(newValue) => setOperationValue(newValue)}
            defaultValue={[0]}
            max={360}
            step={1}
          />
        </div>
      )}
      {operation === "sharpen" && (
        <div className="py-10 space-y-3">
          <p className="text-gray-500">Sharpness: {operationValue}</p>
          <Slider
            onValueChange={(newValue) => setOperationValue(newValue)}
            defaultValue={[0]}
            max={10000}
            min={0.01}
            step={0.01}
          />
        </div>
      )} */}
      <input
        type="number"
        placeholder={operation === "rotate" ? "Degrees" : "Value"}
        value={operationValue}
        onChange={(e) => setOperationValue(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />
    </div>
  );
};

export default CommonOperationInput;
