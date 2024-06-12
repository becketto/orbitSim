// physics.js
const G = .5; // Custom gravitational constant for visualization

function calculateMass(radius) {
    return (4 / 3) * Math.PI * Math.pow(radius, 3); // Assuming uniform density
}

function calculateGravitationalForce(mass1, mass2, distance) {
    return (G * mass1 * mass2) / (distance * distance);
}

function updatePositions(objects, dt) {
    const numObjects = objects.length;

    for (let i = 0; i < numObjects; i++) {
        const obj1 = objects[i];

        for (let j = i + 1; j < numObjects; j++) {
            const obj2 = objects[j];

            const distance = obj1.position.distanceTo(obj2.position);

            if (distance > 0) {
                const direction = obj2.position.clone().sub(obj1.position).normalize();
                const force = calculateGravitationalForce(obj1.mass, obj2.mass, distance);

                const acceleration1 = direction.clone().multiplyScalar(force / obj1.mass);
                const acceleration2 = direction.clone().multiplyScalar(-force / obj2.mass);

                obj1.velocity.add(acceleration1.clone().multiplyScalar(dt));
                obj2.velocity.add(acceleration2.clone().multiplyScalar(dt));
            }
        }
    }

    for (let i = 0; i < numObjects; i++) {
        const obj = objects[i];
        obj.position.add(obj.velocity.clone().multiplyScalar(dt));
    }
}

export { calculateMass, calculateGravitationalForce, updatePositions };