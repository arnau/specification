---
id: v1-log-def
title: Log
url: /v1/glossary/log
version: v1
---

A **log** of changes is a sequence of entries identified by
their numerical order, the [entry number](/v1/glossary/entry#number).
It is the backbone data structure that enables [snapshots](/v1/glossary/snapshot),
[records](/v1/glossary/record) and [audit](/v1/data-model#audit).

```elm
type Log =
  List Entry
```

![A picture of a log with A, B a Z entries](./data-model/data-model-log.svg)

The first entry number MUST always be `1`. The range corresponds to the
**positive numbers** and they MUST be assigned in strict incremental
succession (e.g. `{1, 2, 3, ...}`).


## Operations

_This section is non-normative._

Conceptually, a log has a few operations to help interact with it and with the
rest of the [data model](/v1/data-model).


A log is a list of immutable [entries](/v1/glossary/entry) so in order to evolve
the log the main operation is to `append` a new entry to it.

```elm
append : Entry -> Log -> Log
```

The log needs to be consumed at different sizes to support functionality like
[snapshots](/v1/glossary/snapshots).

```elm
take : Integer -> Log -> Log
```

And finally, obtaining discrete entries from the log is as important and
supported by the [REST API](/v1/rest-api).

```elm
get : ID -> Log -> Maybe Entry
```
