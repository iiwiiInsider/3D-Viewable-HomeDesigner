# 3D Floor Plan Designer

A React + TypeScript + Vite application for designing 3D floor plans with an interactive 3D viewer.

## Features

- 🏗️ Interactive 3D floor plan visualization
- 🎨 Real-time 3D rendering using Three.js and React Three Fiber
- 🖱️ Intuitive camera controls (rotate, zoom, pan)
- 📐 Grid system for precise measurements
- 🧱 Wall creation and management
- 🌓 Dark mode UI

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/iiwiiInsider/3D-floor-designer.git
cd 3D-floor-designer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Usage

### Controls

- **Left Mouse Button** - Rotate the view
- **Right Mouse Button** - Pan the view
- **Mouse Wheel** - Zoom in/out
- **Load Sample Room** - Load a pre-configured sample floor plan
- **Clear All** - Remove all walls from the scene

### Creating Floor Plans

The application comes with a sample room demonstrating the wall creation system. You can:
1. Click "Load Sample Room" to see an example floor plan
2. Use "Clear All" to start fresh
3. Explore the 3D view using mouse controls

## Project Structure

```
src/
├── components/
│   ├── FloorPlanDesigner.tsx    # Main designer component
│   ├── FloorPlanDesigner.css    # Designer styles
│   ├── Floor.tsx                # 3D floor component
│   └── Wall.tsx                 # 3D wall component
├── App.tsx                      # Main app component
├── App.css                      # App styles
├── main.tsx                     # Entry point
└── index.css                    # Global styles
```

## Future Enhancements

- Interactive wall drawing by clicking on the 3D floor
- Door and window placement
- Room labeling and measurements
- Multiple floor support
- Furniture placement
- Export floor plans
- Import/export to common formats (JSON, DXF, etc.)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
