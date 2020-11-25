import numpy as np


def check_type(**parameter_dict):
    parameter = parameter_dict.keys()
    if len(parameter) != 1:
        raise ValueError("This function can only receive one keyword-argument.")
    else:
        parameter = list(parameter)[0]

    value = parameter_dict[parameter]
    if len(value) != 3:
        raise ValueError("The value of the keyword-argument provided must be a list-like object containing three "
                         "items.")
    else:
        value, description, expected_types = value

    if expected_types == np.ndarray:
        if not isinstance(value, expected_types):
            if isinstance(value, (list, tuple)):
                return np.array(value)
            else:
                raise TypeError(f"The {parameter} {description} must receive a {np.ndarray} object or an object that "
                                f"can be converted to one.")
        else:
            return value

    if not isinstance(value, expected_types):
        raise TypeError(f"The {parameter} {description} must receive an object that is one of the following classes: "
                        f"{expected_types}.")


def check_ndim(**parameters):
    for parameter in parameters.keys():
        value = parameters[parameter]
        if len(value) != 3:
            raise ValueError("The value of the keyword-arguments provided must be list-like objects containing three "
                             "items.")
        else:
            value, description, expected_ndim = value

        if value.ndim != expected_ndim:
            raise ValueError(f"The ndim attribute of the {parameter} {description} must be equal to {expected_ndim}.")


def check_length(**parameters):
    for parameter in parameters.keys():
        value = parameters[parameter]
        if len(value) != 3:
            raise ValueError("The value of the keyword-arguments provided must be list-like objects containing three "
                             "items.")
        else:
            value, description, expected_length = value

        if len(value) != expected_length:
            raise ValueError(f"The {parameter} {description} length must be equal to {expected_length}.")


def check_point_order(point_one, point_two):
    return point_two, point_one if point_one[0] > point_two[0] else point_one, point_two
