[Back to README.md](../../README.md)

# Add/Remove Coin To User Coin List

Allow the Authenticated User to add/remove a coin to/from their user coin list.

**URL** : `/api/user-coins/add-coins/`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : None

**Data constraints**

```json
{
    "id": "[integer]",
    "coins": [
        "coin-1"
    ]
}
```

**Data examples**

Partial data is not allowed.

## Success Responses

**Condition** : Data provided is valid and User is Authenticated.

**Code** : `200 OK`

**Content example** : Response will reflect back the updated information. A
User with `id` of `1` adds a coin with coin code `BTC` to their coin list. 

```json
{
    "id": 1,
    "coins": [
        "BTC"
    ],
    "user_id": 1,
    "created_at": "2020-09-21T20:15:45.921Z",
    "updated_at": "2020-09-21T20:15:45.921Z"
}
```

## Notes

* The user has no control over the endpoints/requests made here, they all happen within the app so the error handling is minimal and will respond with "500 internal server error" if an error were to happen.

[Back to README.md](../../README.md)