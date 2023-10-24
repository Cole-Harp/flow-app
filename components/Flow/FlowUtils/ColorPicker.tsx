import { useState } from "react";

interface ColorDropdownProps {
    onColorChange: (color: string) => void;
}

export const ColorDropdown = ({ onColorChange }: ColorDropdownProps) => {
    const colors = ["black", "red", "green", "blue"];
  
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onColorChange(event.target.value);
    };
  
    return (
      <div>
        <select onChange={handleChange}>
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
    );
  };