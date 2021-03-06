---
id: v2-link
title: Link
url: /v2/data-model/link
version: v2
---

The mechanism for linking two elements is the [CURIE datatype](/v2/datatypes/curie).
It allows linking between registers defined in the same [catalogue](/v2/glossary/catalogue).

The catalogue serves as the lookup table for prefix mappings. Given a CURIE
prefix, the catalogue should return its base URL such that the user could
perform [the expansion to a URL](/v2/datatypes/curie#expansion-to-url).

***
**EXAMPLE:**

For example, a link to the country of birth could be expressed as:

```elm
[ ("name", "Alan Turing")
, ("born-in", "country:GB")
]
```

Or a link of an allergen to its group which is part of the same dataset:

```elm
[ ("name", "Walnut")
, ("group", "allergen:24")
]
```
***
