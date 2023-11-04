import pyrebase

from config.ConfigFile import FIREBASE_CONFIG

firebase = pyrebase.initialize_app(FIREBASE_CONFIG)
authe = firebase.auth()


def is_user_exist(userId):
    db = firebase.database()
    users = db.child("users").get().val()

    keys = users.keys()
    if userId in keys:
        user = users[userId]
        return user is not None
    return False


def set_user(userId):
    db = firebase.database()

    result = db.child("users").child(userId).set({
        "settings": {
            "diabetesType": 0,
            "insulin": {
                "actingTime": 0,
                "offsetTime": 0,
            },
            "insulinCorrection": 0,
            "targetRange": {
                "from": 80,
                "to": 120
            },
            "units": [0] * 24
        },
        "libreAPI": ""
    })
    return result


def get_user_data(userId):
    db = firebase.database()
    users = db.child("users").get().val()

    if is_user_exist(userId):
        user = users[userId]
        return user

    return None


def get_user_target_range(userId):
    user = get_user_data(userId)
    if user:
        targetRange = user['settings']['targetRange']
        return targetRange
    return None


def get_user_insulin_correction(userId):
    user = get_user_data(userId)
    if user:
        unit = user['settings']['insulinCorrection']
        return unit
    return None


def get_user_units(userId, hour):
    user = get_user_data(userId)
    if user:
        units = user['settings']['units'][int(hour)]
        return units
    return None


def get_user_diabetes_type(userId):
    user = get_user_data(userId)
    if user:
        type = user['settings']['diabetesType']
        return type
    return None


def get_user_all_units(userId):
    user = get_user_data(userId)
    if user:
        units = user['settings']['units']
        return units
    return None


def get_user_insulin(userId):
    user = get_user_data(userId)
    if user:
        result = user['settings']['insulin']
        return {"actingTime": result['actingTime'], "offsetTime": result['offsetTime']}
    return {"actingTime": None, "offsetTime": None}


def set_user_settings(body):
    db = firebase.database()

    if is_user_exist(body['id']):
        result = db.child("users").child(body['id']).child("settings").update(body["settings"])
        return result is not None
    return False


def get_user_libre_api(userId):
    user = get_user_data(userId)
    if user:
        result = user['libreAPI']
        return {"libreAPI": result}
    return {"libreAPI": None}


def set_user_libre_api(body):
    db = firebase.database()

    if is_user_exist(body['id']):
        result = db.child("users").child(body['id']).update({"libreAPI": body["libreAPI"]})
        return result is not None
    return False
