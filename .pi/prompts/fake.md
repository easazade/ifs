# Fake IFS objects

Create or edit fake IFS entity objects in `prototype-puppeteer/src/fake/ifs/`. These objects are seed data that may be reinserted after the database is erased, so follow these rules:

- Use the generated prototype-client **create DTO** types for every object; these are database-create payloads, not persisted/read models.
- Every ID must be unique and follow the schema’s IFS ID format: `<entity-type>/<id>`. IDs are references too, so use consistent IDs wherever an object is referenced.
- Resolve every foreign ID that refers to a class or another object. Ensure the referenced class/object is defined in the fake data. If it is missing, stop and ask where and how the user wants it created; do not invent a dangling reference or proceed with dependent data.
- Use realistic, meaningful data and real Iranian names for people, places, hospitals, organizations, and other relevant entities. Do not copy generated/example values from `ifs-standards` entity examples; they are not suitable seed data.
- Check the relevant schemas and existing fake data for required fields, relationships, ID conventions, and consistency. Keep changes scoped to the requested fake objects.
