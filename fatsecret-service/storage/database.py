import pyrebase

from config.ConfigFile import FIREBASE_CONFIG

firebase = pyrebase.initialize_app(FIREBASE_CONFIG)
authe = firebase.auth()
db = firebase.database()
users = db.child("users").get().val()


def is_user_exist(userId):
    if users[userId]:
        user = users[userId]
        return user is not None
    return False


def set_user(userId):
    result = db.child("users").child(userId).set({
        "settings": ""
    })
    print(result)
    return result


def get_user_data(userId):
    if users[userId]:
        user = users[userId]
        return user

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

# def update_user_settings(userId, settings):


def set_user_settings(body):
    result = db.child("users").child(body['id']).child("settings").update(body["settings"])
    return result is not None


