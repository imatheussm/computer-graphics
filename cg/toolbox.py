def get_angular_coefficient(point_one, point_two):
    if point_one[0] < point_two[0]:
        point_one, point_two = point_two, point_one

    difference = point_two - point_one

    return difference[1] / difference[0]


def get_linear_coefficient(point_one, point_two, angular_coefficient=None):
    if point_one[0] < point_two[0]:
        point_one, point_two = point_two, point_one

    if angular_coefficient is None:
        angular_coefficient = get_angular_coefficient(point_one, point_two)

    return point_one[1] - angular_coefficient * point_one[0]
