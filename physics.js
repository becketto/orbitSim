// physics.js
const G = 0.5; // Custom gravitational constant for visualization

function calculateMass(radius) {
    return (4 / 3) * Math.PI * Math.pow(radius, 3); // Assuming uniform density
}

function calculateGravitationalForce(mass1, mass2, distance) {
    return (G * mass1 * mass2) / (distance * distance);
}

function updatePositions(obj1, obj2, dt) {
    const distance = obj1.position.distanceTo(obj2.position);

    if (distance > 0) {
        const direction = obj1.position.clone().sub(obj2.position).normalize();
        const oppositeDirection = direction.clone().negate();

        const force = calculateGravitationalForce(obj1.mass, obj2.mass, distance);

        const acceleration1 = direction.clone().multiplyScalar(force / obj1.mass);
        const acceleration2 = oppositeDirection.clone().multiplyScalar(force / obj2.mass);

        obj1.velocity.add(acceleration1.multiplyScalar(dt));
        obj2.velocity.add(acceleration2.multiplyScalar(dt));

        obj1.position.add(obj1.velocity.clone().multiplyScalar(dt));
        obj2.position.add(obj2.velocity.clone().multiplyScalar(dt));
    }

    return {
        obj1Position: obj1.position,
        obj2Position: obj2.position,
    };
}

export { calculateMass, calculateGravitationalForce, updatePositions };