# React Fireworks Animation

Create stunning fireworks animations with React!

This project provides a simple yet powerful React component that allows you to create and customize beautiful fireworks animations on a canvas element. It's perfect for adding festive flair to your web applications, celebrating special occasions, or just having fun with animations.

## Features

- Generate fireworks animations with customizable properties such as size, color, explosion duration, and explosion radius.
- Realistic explosion effects with dynamic particle movement and gravity simulation.
- Responsive design to adapt to various screen sizes.
- Easy-to-use API for integrating the fireworks animation into your React applications.

## Installation

To use the React fireworks animation component in your project, follow these steps:

1. Install the package from npm:

    `npm install react-fireworks-animation` or `yarn add react-fireworks-animation`

2. Import the component into your React application:

    `import FireworksAnimation from 'react-fireworks-animation';`

3. Use the component in your JSX:

    `<FireworksAnimation />`

## Usage

Here's an example of how you can customize the fireworks animation:

  ```bash
  <FireworksAnimation
    size={4} // Size of the fireworks
    color="#ff0000" // Color of the fireworks
    explosionDuration={4} // Duration of the explosion animation in seconds
    explosionRadius={40} // Radius of the explosion
  />
  ```

### Props

The `FireworksAnimation` component accepts the following props:

`size`: Size of the fireworks (default: `3`)
`color`: Color of the fireworks (default: `'#ffffff'`)
`explosionDuration`: Duration of the explosion animation in seconds (default: `3`)
`explosionRadius`: Radius of the explosion (default: `30`)

## Contributing

Contributions are welcome! If you have any ideas, bug fixes, or improvements, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.
