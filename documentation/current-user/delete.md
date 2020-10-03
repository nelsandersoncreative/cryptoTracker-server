[Back to README.md](../../README.md)

# Delete User's Account

Delete the Account and associated coin list of an Authenticated User.

**URL** : `/api/auth/:id`

**URL Parameters** : `id=[integer]` where `id` is the ID of the Account in the database.

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : User is Account Owner

**Data** : `{}`

## Success Response

**Condition** : If the Account exists.

**Code** : `200 OK`

**Content** : `{ "message": "User profile deleted successfully" }`

## Error Responses

**Condition** : If there was no Account available to delete.

**Code** : `404 NOT FOUND`

**Content** : `{}`

### Or

**Condition** : Authorized User is not Owner of Account at URL.

**Code** : `401 UNAUTHORIZED`

**Content** : `{ "message": "Unauthorized request" }`


## Notes

* Will remove user coin list for this account in addition to removing the account.

[Back to README.md](../../README.md)