const User = require("../models/User")
const findNextAvailableNode = async (parentNode) => {
    let queue = [parentNode];

    while (queue.length > 0) {
        let current = queue.shift();

        // Check left position first
        if (!current.leftChild) return { parent: current, nodeType: "leftChild" };
        if (!current.rightChild) return { parent: current, nodeType: "rightChild" };

        // Fetch children for level-order traversal
        const leftChild = await User.findById(current.leftChild);
        const rightChild = await User.findById(current.rightChild);

        if (leftChild) queue.push(leftChild);
        if (rightChild) queue.push(rightChild);
    }
    return null; 
};

module.exports = { findNextAvailableNode };