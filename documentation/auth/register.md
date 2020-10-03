[Back to README.md](../../README.md)

# Register/Create User's Account

Register For A User Account

**URL** : `/api/users/register`

**Method** : `POST`

**Auth required** : NO

**Permissions required** : None

**Data constraints**

Provide name of Account to be created.

```json
{
    "user_name": "[unicode 64 chars max]",
    "user_email": "[valid email address]",
    "user_password": "[password in plain text]"
}
```

**Data example** All fields must be sent.

```json
{
    "user_name": "iloveauth",
    "user_email": "iloveauth@gmail.com",
    "user_password": "abcd1234"
}
```

## Success Response

**Condition** : If everything is OK and an Account didn't exist for this User.

**Code** : `201 CREATED`

**Content example**

```json
{
    "id": 6,
    "user_name": "iloveauth",
    "user_email": "iloveauth@gmail.com",
    "created_at": "2020-09-26T19:56:55.077Z",
    "updated_at": "2020-09-26T19:56:55.077Z",
    "authToken": "aassddffgghhhjjj"
}
```

## Error Responses

**Condition** : If Account already exists for User.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "message": "Email is already in use"
}
```

### Or

**Condition** : If fields are missing upon submission.

**Code** : `400 BAD REQUEST`

**Content example**

```json
{
    "message": "<field name> is required"
}
```

[Back to README.md](../../README.md)