# Kaizer DB

![logo](https://github.com/DarkMortal/Kaizer-DB/assets/67017303/cc9882fe-6980-4fcd-b211-bcdb5ea8d034)<br/>
<a href="https://www.buymeacoffee.com/darkmortal" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;"></a>

## A Lightweight and Minimal CSV Database Package

Kaizer-DB is a simple and efficient tool for interacting with CSV files using SQL-like syntax. Designed to provide CRUD functionalities without the overhead of a full-fledged database, it is ideal for small projects or prototyping.

---

## Features

- **SQL-like Syntax**: Write queries like `SELECT`, `INSERT`, `UPDATE`, and `DELETE` with ease.
- **CSV Integration**: Works directly with CSV files to store and retrieve data.
- **CRUD Support**: Perform essential Create, Read, Update, and Delete operations.

---

## Drawbacks

- No type checking.
- Executes only one query at a time.
- Does not support data with spaces.

---

## Getting Started

### Installation

#### **1. From the GitHub Repository**

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/DarkMortal/Kaizer-DB.git

# Navigate to the project directory
cd Kaizer-DB

# Install dependencies
yarn install # or npm install

# Start the CLI
yarn start # or npm start
```

#### **2. Global Installation**

Install the package globally using npm:

```bash
npm install -g kaizer-db
```

Run the CLI from anywhere:

```bash
kaizer-db
```

---

## Usage

### Query Examples

#### **Creating and Using a Database**

```
Use Database mydb;
Create Database mydb;
```

Creates a folder named `mydb` where tables are stored as `.csv` files.

#### **Creating a Table**

```
Create Table Warriors (Name, Attack, Defense, PowerLevel);
```

Creates a file named `Warriors.csv` with the given headers.

#### **Show Tables**

```
Show Tables;
```

```
Output:
+-------------+
| Tables      |
+-------------+
| test_data   |
| Warriors    |
+-------------+

Total number of Tables: 2
```

Shows list of available csv files in the current directory which is used as the database.

#### **Inserting Data**

```
Insert into Warriors (Name, Attack, Defense, PowerLevel) values (Goku, 5000, 7000, 9001), (Vegeta, 5000, 7000, 9000);
```

Appends records to `Warriors.csv`.

#### **Fetching Data**

```
Select * from Warriors;
```

```
Output:
+--------+--------+---------+------------+
| Name   | Attack | Defense | PowerLevel |
+--------+--------+---------+------------+
| Goku   |  5000  |   8000  |    9001    |
| Vegeta |  5000  |   7000  |    9000    |
+--------+--------+---------+------------+

2 rows returned
```

#### **Using WHERE Clauses**

```
Select Name from Warriors Where PowerLevel > 9000;
```

```
Output:
+--------+
| Name   |
+--------+
| Goku   |
+--------+

1 rows returned
```

#### **Updating Data**

```
Update Table Warriors set PowerLevel = 10000, Defense = 8000 Where Name = Goku;
Select * from Warriors;
```

```
Output:
+--------+--------+---------+------------+
| Name   | Attack | Defense | PowerLevel |
+--------+--------+---------+------------+
| Goku   |  5000  |   8000  |    10000   |
| Vegeta |  5000  |   7000  |    9000    |
+--------+--------+---------+------------+

2 rows returned
```

#### **Deleting Data**

```
Delete From Warriors Where PowerLevel < 10000;
Select * from Warriors;
```

```
Output:
+--------+--------+---------+------------+
| Name   | Attack | Defense | PowerLevel |
+--------+--------+---------+------------+
| Goku   |  5000  |   7000  |    10000   |
+--------+--------+---------+------------+

1 rows returned
```

---

## Order by clause

The default ordering is ascending order (`asc`,`Asc`,`ASC`)<br/>The descending order can be used as (`desc`,`Desc`,`DESC`)

### Examples

```
Select * from test_data order by Defense;
```

```
Output:
+--------------------+---------+---------+-------------+
| Name               | Attack  | Defense | Power Level |
+--------------------+---------+---------+-------------+
| Karin_Uzumaki      | 100     | 92      | 510         |
| Jayden_Uchiha      | 200     | 120     | 5000        |
| Rykon_Hayashi      | 400     | 310     | 8100        |
| Arkon_Hayashi      | 420     | 330     | 8000        |
| Kakarot_Uchiha     | 500     | 340     | 9001        |
| Drago_Uzumaki      | 460     | 350     | 8010        |
+--------------------+---------+---------+-------------+
6 rows returned
```

```
Select * from test_data where Attack > 200 order by Defense desc;
```

```
Output:
+--------------------+---------+---------+-------------+
| Name               | Attack  | Defense | Power Level |
+--------------------+---------+---------+-------------+
| Drago_Uzumaki      | 460     | 350     | 8010        |
| Kakarot_Uchiha     | 500     | 340     | 9001        |
| Arkon_Hayashi      | 420     | 330     | 8000        |
| Rykon_Hayashi      | 400     | 310     | 8100        |
+--------------------+---------+---------+-------------+
4 rows returned
```

```
Select Name, PowerLevel, Defense from test_data where Attack > 200 Order by Defense;
```

```
Output:
+--------------------+-------------+---------+
| Name               | Power Level | Defense |
+--------------------+-------------+---------+
| Rykon_Hayashi      | 8100        | 310     |
| Arkon_Hayashi      | 8000        | 330     |
| Kakarot_Uchiha     | 9001        | 340     |
| Drago_Uzumaki      | 8010        | 350     |
+--------------------+-------------+---------+

4 rows returned
```

---

## Error Handling

Kaizer-DB provides meaningful error messages to guide users:

#### Example

```
Select Name, PowerLevel from Warriors Where Attack > 200 Order by Defense;
```

```
Output:
Error: Order by field needs to be included in fetch list
```

---

## Contribution Guidelines

We welcome contributions to Kaizer-DB. Follow these steps to get started:

1. **Fork the Repository**
   Fork the Repository by using fork button.
2. **Clone the Repository**

```bash
git clone https://github.com/<contributor-user-name>/Kaizer-DB.git
```

3. **Create a New Branch**

```bash
cd Kaizer-DB
git checkout -b feature/your-feature-name
```

4. **Make Your Changes**

- Edit the code as needed.
- Add tests if applicable.

5. **Commit Your Changes**

```bash
git add .
git commit -m "Description of your changes"
```

6. **Push Your Changes**

```bash
git push origin feature/your-feature-name
```

7. **Create a Pull Request (PR)**

- Go to your repository on GitHub.
- Click on **New Pull Request**.
- Provide a detailed description of your changes.
- Submit the PR for review.

---
We look forward to your contributions! Let us know if you need any assistance.
***
