<h1 align="center" style="color: #1E90FF;">📊 Welcome to Kaizer-DB 📊</h1>

<p align="center">
  <img src="https://github.com/DarkMortal/Kaizer-DB/assets/67017303/cc9882fe-6980-4fcd-b211-bcdb5ea8d034" alt="Kaizer-DB Logo" width="200" />
</p>

<p align="center">
  <a href="https://www.buymeacoffee.com/darkmortal" target="_blank">
    <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px; width: 174px;">
  </a>
</p>
<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Arial&size=24&pause=1000&duration=4000&color=4682B4&center=true&vCenter=true&width=1000&lines=Kaizer-DB;Lightweight+and+minimal+CSV+database+package+with+SQL-like+Syntax!" alt="Typing SVG" />
</p>

---

<h2 style="color: #1E90FF;">🚀 Features 🚀</h2>

<ul>
    <li><strong>SQL-like Syntax</strong>: Easily write `SELECT`, `INSERT`, `UPDATE`, and `DELETE` queries.</li>
    <li><strong>CSV Integration</strong>: Directly interact with CSV files as lightweight databases.</li>
    <li><strong>CRUD Support</strong>: Perform essential Create, Read, Update, and Delete operations.</li>
    <li><strong>Minimal Overhead</strong>: Ideal for prototyping and small-scale projects.</li>
</ul>

---

<h2 style="color: #1E90FF;">⚠️ Limitations ⚠️</h2>
<ul>
    <li>No type checking.</li>
    <li>Supports only one query execution at a time.</li>
    <li>Does not handle data with spaces.</li>
</ul>

---

<h2 style="color: #1E90FF;">🔧 Tech Stack 🔧</h2>

<p>
  <img src="https://img.icons8.com/color/48/000000/javascript.png" alt="JavaScript" />
  <img src="https://img.icons8.com/color/48/000000/nodejs.png" alt="Node.js" />
</p>

---

<h2 style="color: #1E90FF;">🎓 Installation & Setup 🎓</h2>

### 1. Clone the Repository
```bash
git clone https://github.com/DarkMortal/Kaizer-DB.git
cd Kaizer-DB
```

### 2. Install dependencies
```bash
yarn install # or npm install
```

### 3. Start the CLI
```bash
yarn start # or npm start
```

### **Global Installation**

Install the package globally using npm:

```bash
npm install -g kaizer-db
```

Run the CLI from anywhere:

```bash
kaizer-db
```

---

<h2 style="color: #1E90FF;">💡 How It Works 💡</h2>

### Query Examples

#### **Creating and Using a Database**

```bash
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

```bash
Show Tables;
```

```bash
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

```bash
Insert into Warriors (Name, Attack, Defense, PowerLevel) values (Goku, 5000, 7000, 9001), (Vegeta, 5000, 7000, 9000);
```

Appends records to `Warriors.csv`.

#### **Fetching Data**

```bash
Select * from Warriors;
```

```bash
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

```bash
Select Name from Warriors Where PowerLevel > 9000;
```

```bash
Output:
+--------+
| Name   |
+--------+
| Goku   |
+--------+

1 rows returned
```

#### **Updating Data**

```bash
Update Table Warriors set PowerLevel = 10000, Defense = 8000 Where Name = Goku;
Select * from Warriors;
```

```bash
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

```bash
Delete From Warriors Where PowerLevel < 10000;
Select * from Warriors;
```

```bash
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

```bash
Select * from test_data order by Defense;
```

```bash
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

```bash
Select * from test_data where Attack > 200 order by Defense desc;
```

```bash
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

```bash
Select Name, PowerLevel, Defense from test_data where Attack > 200 Order by Defense;
```

```bash
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

```bash
Select Name, PowerLevel from Warriors Where Attack > 200 Order by Defense;
```

```bash
Output:
Error: Order by field needs to be included in fetch list
```

---

<h2 style="color: #1E90FF;">👥 Contributors 👥</h2> 
<table style="background-color: #E6F7FF; border-radius: 10px; box-shadow: 0 4px 8px rgba(30, 144, 255, 0.2);">
  <tr>
    <td>
      <a href="https://github.com/DarkMortal"> 
        <img src="https://github.com/DarkMortal.png" width="100px;" alt="DarkMortal"/><br /> 
        <sub><b>DarkMortal</b></sub> 
      </a>
    </td>
    <td>
      <a href="https://github.com/dpgaharwal"> 
        <img src="https://github.com/dpgaharwal.png" width="100px;" alt="dpgaharwal"/><br /> 
        <sub><b>dpgaharwal</b></sub> 
      </a> 
    </td>
    <td>
      <a href="https://github.com/adwityac"> 
        <img src="https://github.com/adwityac.png" width="100px;" alt="adwityac"/><br /> 
        <sub><b>adwityac</b></sub> 
      </a> 
    </td>
    <td>
      <a href="https://github.com/aprajitapandeyxcghd"> 
        <img src="https://github.com/aprajitapandeyxcghd.png" width="100px;" alt="aprajitapandeyxcghd"/><br /> 
        <sub><b>aprajitapandeyxcghd</b></sub> 
      </a> 
    </td>
    <td>
      <a href="https://github.com/GauravKarakoti"> 
        <img src="https://github.com/GauravKarakoti.png" width="100px;" alt="GauravKarakoti"/><br /> 
        <sub><b>GauravKarakoti</b></sub> 
      </a> 
    </td>
  </tr>
</table>

<h3>
    We welcome contributions to Kaizer-DB. Follow these steps to get started:
</h3>

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

<h2 style="color: #1E90FF;">📜 License 📜</h2> <p>MIT License © 2025 DarkMortal</p> 
<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Arial&size=24&pause=1000&duration=4000&color=4682B4&center=true&vCenter=true&width=1000&lines=Happy+Querying+with+Kaizer-DB!;We+await+your+return!" alt="Typing SVG" />
</p>