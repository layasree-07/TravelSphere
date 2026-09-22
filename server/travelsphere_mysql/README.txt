TRAVELSPHERE MYSQL AUTH DATABASE

1. Open MySQL Workbench.
2. Open schema.sql and execute it.
3. In your TravelSphere project root, create/update .env with:

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=Ls@16052007
MYSQL_DATABASE=travelsphere_auth

Do NOT commit .env to GitHub.

The existing data/destinations.json database is NOT changed by this folder.

Files:
- server/mysql/db.ts       MySQL connection pool
- server/mysql/usersDb.ts  User lookup/create functions
- schema.sql               Users database/table creation
