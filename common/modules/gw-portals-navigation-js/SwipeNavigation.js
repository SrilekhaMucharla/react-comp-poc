const MAX_VERTICAL_DISTANCE = 75;
const MIN_HORIZONTAL_DISTANCE = 30;
const MAX_VERTICAL_RATIO = 0.3;

let startPosition;
let isSwipeActive = false;

function isSwipeValid(start, end, direction) {
    if (!start || !end) {
        return false;
    }

    const deltaY = Math.abs(end.y - start.y);
    const deltaX = (end.x - start.x) * direction;
    /*
     *   DeltaY is the length of the vertical swipe
     *   DeltaX is the length of the horizontal swipe (which can be negative if it is a left swipe)
     *   we multiply this by a direction above as valid swipes will only have a positive deltaX.
     *   For a swipe to be valid its vertical distance must less than our vertical threshold, the
     *   deltaX after being multiplied by a direction must be greater than 0, the horizontal length
     *   must be greater than our minimum horizontal threshold and the vertical ratio must be less
     *   than our max vertical ratio.
     */
    return deltaY < MAX_VERTICAL_DISTANCE
        && deltaX > 0
        && deltaX > MIN_HORIZONTAL_DISTANCE
        && deltaY / deltaX < MAX_VERTICAL_RATIO;
}

function getCoordinates(event) {
    const originalEvent = event.originalEvent || event;
    const touches = originalEvent.touches && originalEvent.touches.length
        ? originalEvent.touches : [originalEvent];
    const eventTouch = (originalEvent.changedTouches && originalEvent.changedTouches[0])
        || touches[0];
    return {
        x: eventTouch.clientX,
        y: eventTouch.clientY
    };
}

export function startSwipe(event) {
    startPosition = getCoordinates(event);
    isSwipeActive = true;
}

export function cancelSwipe() {
    // Notifications, calls, etc can cancel a swipe
    isSwipeActive = false;
}

export function endSwipe(event, swipeRightAction, swipeLeftAction) {
    const endPosition = getCoordinates(event);

    // swipe right is 1
    // swipe left is -1
    const direction = startPosition.x < endPosition.x ? 1 : -1;

    if (isSwipeActive && isSwipeValid(startPosition, endPosition, direction)) {
        /*
        *   If a valid swipe occurs we call either swipeRightAction or swipeLeftAction function.
        */
        if (direction === 1 && swipeRightAction) {
            swipeRightAction();
        } else if (direction === -1 && swipeLeftAction) {
            swipeLeftAction();
        }
    }
    isSwipeActive = false;
}

export default {
    onStartSwipe: startSwipe,
    onEndSwipe: endSwipe,
    onCancelSwipe: cancelSwipe
};
