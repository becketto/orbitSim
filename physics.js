// physics.js
const G = .5; // Custom gravitational constant for visualization

function calculateMass(radius) {
    return (4 / 3) * Math.PI * Math.pow(radius, 3); // Assuming uniform density
}

function calculateGravitationalForce(mass1, mass2, distance) {
    return (G * mass1 * mass2) / (distance * distance);
}

export { calculateMass, calculateGravitationalForce };