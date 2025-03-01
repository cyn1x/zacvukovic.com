/* 
 * Resets animation property for elements which require multiple animations with the 
 * same string value.
 */
function animate(element, animation) {
    if (element.style.animation) {
        element.style.animation = "";
        return;
    }
    element.style.animation = `${animation}`; 
}

function waitForAnimation(node) {
    return Promise.all(node.getAnimations().map((animation) => animation.finished));
}

export { animate, waitForAnimation };
