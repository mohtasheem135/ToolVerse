// app/components/ColorPalette.js
export default function ColorPalette({ colors }) {
    if (!colors || colors.length === 0) {
      return <div>No colors to display.</div>; // Handle empty colors array
    }
  
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              backgroundColor: color,
              width: '50px',
              height: '50px',
              margin: '5px',
              borderRadius: '5px', // Add rounded corners
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Add subtle shadow
            }}
            title={color} // Add tooltip with hex code
          />
        ))}
      </div>
    );
  }