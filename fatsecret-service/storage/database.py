import pyrebase
from config.ConfigFile import FIREBASE_CONFIG

firebase = pyrebase.initialize_app(FIREBASE_CONFIG)
auth = firebase.auth()


def create_token():
    uid = "some-uid"
    return firebase.auth().create_custom_token(uid)


def is_user_exist(userId, token):
    db = firebase.database()
    users = db.child("users").get(token=token).val()

    keys = users.keys()
    if userId in keys:
        user = users[userId]
        return user is not None
    return False


def set_user(userId, token):
    db = firebase.database()

    result = (
        db.child("users")
        .child(userId)
        .set(
            {
                "settings": {
                    "diabetesType": 1,
                    "insulin": {
                        "actingTime": "04:30",
                        "offsetTime": "01:00",
                    },
                    "insulinCorrection": 40,
                    "targetRange": {"from": 80, "to": 120},
                    "units": [0.1] * 24,
                },
                "libreAPI": "",
            },
            token=token,
        )
    )
    return result


def get_user_data(userId, token):
    db = firebase.database()
    users = db.child("users").get(token=token).val()

    if is_user_exist(userId, token):
        user = users[userId]
        return user

    return None


def get_user_target_range(userId, token):
    user = get_user_data(userId, token)
    if user:
        targetRange = user["settings"]["targetRange"]
        return targetRange
    return None


def get_user_insulin_correction(userId, token):
    user = get_user_data(userId, token)
    if user:
        unit = user["settings"]["insulinCorrection"]
        return unit
    return None


def get_user_units(userId, hour, token):
    user = get_user_data(userId, token)
    if user:
        units = user["settings"]["units"][int(hour)]
        return units
    return None


def get_user_diabetes_type(userId, token):
    user = get_user_data(userId, token)
    if user:
        type = user["settings"]["diabetesType"]
        return type
    return None


def get_user_all_units(userId, token):
    user = get_user_data(userId, token)
    if user:
        units = user["settings"]["units"]
        return units
    return None


def get_user_insulin(userId, token):
    user = get_user_data(userId, token)
    if user:
        result = user["settings"]["insulin"]
        return {"actingTime": result["actingTime"], "offsetTime": result["offsetTime"]}
    return {"actingTime": None, "offsetTime": None}


def set_user_settings(body):
    db = firebase.database()
    if is_user_exist(body["id"], body["token"]):
        result = (
            db.child("users")
            .child(body["id"])
            .child("settings")
            .update(body["settings"], token=body["token"])
        )
        return result is not None
    return False


def get_user_libre_api(userId, token):
    user = get_user_data(userId, token)
    if user:
        result = user["libreAPI"]
        return result
    return None


def set_user_libre_api(body):
    db = firebase.database()

    if is_user_exist(body["id"], body["token"]):
        result = (
            db.child("users")
            .child(body["id"])
            .update({"libreAPI": body["libreAPI"]}, token=body["token"])
        )
        return result is not None
    return False
