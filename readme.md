- Schema introspection: ./docs/__schema.json
```
query {
  __schema {
    types {
      name
    }
  }
}
```

- Query introspection: ./docs/__query.json
```
query {
  __schema {
    queryType {
      name
    }
  }
}
```

- Type introspection: ./docs/__type.json
```
query {
  __type(name: "Query") {
    name
    fields {
      name
      type {
        name
        kind
      }
    }
  }
}
```