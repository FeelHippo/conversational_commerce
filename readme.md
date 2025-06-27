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

- Example POST call:
```curl
curl --location 'localhost:8080/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "messages": ["where is my order?", "if I remember well, the order number is R156998803", "my email is mobile.developer+22@on-running.com"]
}'
```