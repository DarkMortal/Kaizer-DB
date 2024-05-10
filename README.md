# Kaizer DB
![logo](https://github.com/DarkMortal/Kaizer-DB/assets/67017303/cc9882fe-6980-4fcd-b211-bcdb5ea8d034)
### A lightweight and minimal csv database package
# Features
- SQL like syntax
- Works directly with CSV
- Supports all CRUD functionalities like INSERT, DELETE etc
# Drawbacks
- Only one query at a time
- Doesn't support data with spaces
- Doesn't support complex queries
# Usage
- Creating or using a database
  ```
    Use Database dbname;
  ```
  ```
    Create Database dbname;
  ```
  Both these commands create a new folder named ```dbname``` where the tables are stored as ```csv``` files.
- Creating a table
  ```
   Create Table Warriors (Name,Attack,Defense,PowerLevel);
  ```
  Creates a file named ```Warriors.csv``` in the current folder ```dbname``` with the given headers.
- Inserting data in a table
  ```
    Insert into Warriors (Name,Attack,Defense,PowerLevel) values (Goku,5000,7000,9001), (Vegeta,5000,7000,9000);
  ```
  Appends 2 records to the file named ```Warriors.csv```
- Getting records from a table
  ```
    Select * from Warriors;
  ```
  ![select1](https://github.com/DarkMortal/Kaizer-DB/assets/67017303/b3d27689-1abb-48b9-8f0a-ccd0cf3bb07c)
  ```
    Select Name, PowerLevel from Warriors;
  ```
  ![select2](https://github.com/DarkMortal/Kaizer-DB/assets/67017303/6b1c4dc2-2fb0-4255-86ae-333c859ab894)
- Getting records from a table using ```WHERE``` clause
  ```
    Select Name from Warriors Where PowerLevel > 9000;
  ```
  ![select3](https://github.com/DarkMortal/Kaizer-DB/assets/67017303/5c2061c0-22c5-4a62-945f-cd8005db062d)

***
