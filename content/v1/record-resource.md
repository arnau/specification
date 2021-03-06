---
id: v1-record-resource
title: Records
url: /v1/rest-api/records
version: v1
---

***
NOTE: See the [Record](/v1/glossary/record) definition to understand how this
resource fits into the [data model](/v1/data-model).
***

***
NOTE: The reference implementation inlines the [Item](/v1/glossary/item) in the
[Record resource](/v1/rest-api/records) for convenience.
***

## Get a record

***
### Endpoint

```
GET /records/{key}
```

### Parameters

|Name|Type|Description|
|-|-|-|
|`key`| [ID](/v1/glossary/key#id-type)|The record identifier.|
***

Gets a record by key.

The column order is implementation dependent when the data is represented in a
tabular format like [CSV](/v1/rest-api#csv). For tree-like formats like
[JSON](/v1/rest-api#json), the object has to be treated as unordered.

***
**EXAMPLE:**

```http
GET /records/E09000019 HTTP/1.1
Host: local-authority.register.gov.uk
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json
Link: </records/E09000019/entries>; rel="version-history"

{
  "E09000019": {
    "index-entry-number": 72,
    "entry-number": 72,
    "entry-timestamp": "2015-08-20T08:15:30Z",
    "key": "E09000019",
    "item": [
        {
          "local-authority": "E09000019",
          "name": "Islington"
        }
    ]
  }
}
```
***

### HTTP headers

This resource SHOULD provide a [`Link:` header](@rfc8288) with a
`rel="version-history"` [[RFC5829](@rfc5829)] to the corresponding [Record
trail](#list-the-trail-of-change-for-a-record) for this record.


## List records

***
### Endpoint

```
GET /records
```
***

Gets the list of records. [This resource MAY be paginated](/v1/rest-api#collection-pagination).

The order SHOULD be by consistent regardless of new elements being added to
the dataset.

***
**EXAMPLE:**

```http
GET /records HTTP/1.1
Host: https://local-authority-eng.register.gov.uk
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "E09000019": {
    "index-entry-number": 72,
    "entry-number": 72,
    "entry-timestamp": "2015-08-20T08:15:30Z",
    "key": "E09000019",
    "item": [
        {
          "local-authority": "E09000019",
          "name": "Islington"
        }
    ]
  },
  "E09000016": {
    "index-entry-number": 76,
    "entry-number": 76,
    "entry-timestamp": "2015-08-20T08:15:30Z",
    "key": "E09000016",
    "item": [
        {
          "local-authority": "E09000016",
          "name": "Havering"
        }
    ]
  }
}
```
***


## List the trail of change for a record

***
### Endpoint

```
GET /records/{key}/entries
```

### Parameters

|Name|Type|Description|
|-|-|-|
|`key`| [ID](/v1/glossary/key#id-type)|The record identifier.|
***

Get the list of [entries](/v1/glossary/entry) with the record `key`. [This
resource MAY be paginated](/v1/rest-api#collection-pagination).

The order MUST be by ascending entry number.

***
**EXAMPLE:**

```http
GET /records/CI/entries HTTP/1.1
Host: country.register.gov.uk
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "index-entry-number": 90,
    "entry-number": 90,
    "entry-timestamp": "2016-04-05T13:23:05Z",
    "key": "CI",
    "item-hash": [
      "sha-256:7c16257bd45b4716914010b39dd40e5a6b985b8928d7b8bb0fe3005d2f2b0fec"
    ]
  },
  {
    "index-entry-number": 207,
    "entry-number": 207,
    "entry-timestamp": "2017-10-25T09:52:52Z",
    "key": "CI",
    "item-hash": [
      "sha-256:b3ca21b3b3a795ab9cd1d10f3d447947328406984f8a461b43d9b74b58cccfe8"
    ]
  }
]
```
***


## List records by attribute value

***
TODO: This endpoint path clashes with the regular get records. What about
`/facets/{attr-name}/{attr-value}`? It doesn't reflect that it is about
records but it removes any possible clash between `key` and `attribute-name`.

Or, `/records?name={attr-name}&value={attr-value}` to be more honest about it.
After all, this is a filter on the original record list.

Or, `/indexes/{name}/{value}`.
***

***
### Endpoint

```
GET /records/{attribute-name}/{attribute-value}
```

### Parameters

|Name|Type|Description|
|-|-|-|
|`attribute-name`| [Attribute Name](/v1/datatypes/name)|An attribute name part of the data.|
|`attribute-value`| [String](/v1/datatypes/string)|The string representation of a valid value for the `attribute-name`.|
***

Gets the list of records filtered by the exact value of the given attribute name.
[This resource MAY be paginated](/v1/rest-api#collection-pagination).

The order SHOULD be by consistent regardless of new elements being added to
the dataset.

***
**EXAMPLE:**

```http
GET /records/local-authority-type/CC HTTP/1.1
Host: local-authority-eng.register.gov.uk
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "LND": {
    "index-entry-number": 355,
    "entry-number": 355,
    "entry-timestamp": "2016-10-31T12:59:03Z",
    "key": "LND",
    "item": [
      {
        "local-authority-type": "CC",
        "official-name": "City of London Corporation",
        "local-authority-eng": "LND",
        "name": "City of London",
        "start-date": "1905-06-28"
      }
    ]
  }
}
```
***
