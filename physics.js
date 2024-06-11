// physics.js
const G = 0.5; // Custom gravitational constant for visualization

function calculateMass(radius) {
    return (4 / 3) * Math.PI * Math.pow(radius, 3); // Assuming uniform density
}

function calculateGravitationalForce(mass1, mass2, distance) {
    return (G * mass1 * mass2) / (distance * distance);
}

function updatePositions(obj1, obj2, dt) {
    // const distance = obj1.position.distanceTo(obj2.position); //this doesn't work!!
    const distance = obj1.position.clone().sub(obj2.position).length();
    console.log(obj1.position);



    if (distance > 0) {
        const direction = obj1.position.clone().sub(obj2.position).normalize();

        const force = calculateGravitationalForce(obj1.mass, obj2.mass, distance);
        const acceleration1 = force / obj1.mass;
        const acceleration2 = force / obj2.mass;

        obj1.velocity.addScaledVector(direction, acceleration1 * dt);
        obj1.position.addScaledVector(obj1.velocity, dt);

        const oppositeDirection = direction.clone().negate();
        obj2.velocity.addScaledVector(oppositeDirection, acceleration2 * dt);
        obj2.position.addScaledVector(obj2.velocity, dt);
    }

    return {
        obj1Position: obj1.position,
        obj2Position: obj2.position,
    };
}

export { calculateMass, calculateGravitationalForce, updatePositions };