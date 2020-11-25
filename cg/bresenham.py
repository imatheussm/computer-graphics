import numpy as np

from . import checks
from . import toolbox


def get_line_pixel_coordinates(initial_point, final_point):
    """Bresenham."""
    initial_point = checks.check_type(initial_point=(initial_point, "parameter", np.ndarray))
    final_point = checks.check_type(final_point=(final_point, "parameter", np.ndarray))

    checks.check_length(initial_point=(initial_point, "parameter", 2), final_point=(final_point, "parameter", 2))

    initial_point, final_point, changes_made = ensure_adequate_octant(initial_point, final_point)
    angular_coefficient = toolbox.get_angular_coefficient(initial_point, final_point)

    decision_coefficient = angular_coefficient - .5
    points = initial_point.reshape(1, -1)

    print(changes_made)
    print(f"initial_point: {initial_point} | final_point: {final_point}")

    while points[-1, 0] != final_point[0]:
        point = points[-1].copy()

        if decision_coefficient >= 0:
            point[1] += 1
            decision_coefficient -= 1

        point[0] += 1
        decision_coefficient += angular_coefficient

        points = np.concatenate((points, point.reshape(1, -1)))

    points = revert_changes(points, changes_made)

    return points


def ensure_adequate_octant(initial_point, final_point, angular_coefficient=None):
    changes_made = np.zeros(3, dtype=np.bool_)

    if angular_coefficient is None:
        angular_coefficient = toolbox.get_angular_coefficient(initial_point, final_point)

    if angular_coefficient < -1 or angular_coefficient > 1:
        initial_point, final_point = initial_point[[1, 0]], final_point[[1, 0]]
        changes_made[0] = True

    if initial_point[0] > final_point[0]:
        initial_point[0], final_point[0] = -initial_point[0], -final_point[0]
        changes_made[1] = True

    if initial_point[1] > final_point[1]:
        initial_point[1], final_point[1] = -initial_point[1], -final_point[1]
        changes_made[2] = True

    return initial_point, final_point, changes_made


def revert_changes(points, changes_made):
    checks.check_ndim(points=(points, "parameter", 2))
    checks.check_length(changes_made=(changes_made, "parameter", 3))

    if changes_made[2] is np.True_:
        points[:, 1] = -points[:, 1]

    if changes_made[1] is np.True_:
        points[:, 0] = -points[:, 0]

    if changes_made[0] is np.True_:
        points = points[:, [1, 0]]

    return points
