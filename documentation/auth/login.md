[Back to README.md](../../README.md)

# Login

Used to collect a Token for a registered User.

**URL** : `/api/auth/login`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "user_email": "[valid email address]",
    "user_password": "[password in plain text]"
}
```

**Data example**

```json
{
    "user_email": "iloveauth@example.com",
    "user_password": "abcd1234"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "authToken": "jadskflkjdfaasdfadsf",
    "user": {
        "id": 1,
        "user_name": "iloveauth",
        "user_email": "iloveauth@example.com"
    }
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "message": "Try again. Wrong username, email or password."
}
```


[Back to README.md](../../README.md)