````markdown
# 🐾 PetGuardian API

PetGuardian is an open-source platform to manage **pet adoption, sponsorship, and pet health records**.

This repository contains the **Laravel backend (API)** of the PetGuardian project.

---

## 🚀 Requirements

- PHP 8.2+
- Composer
- Docker (optional, recommended)
- MySQL

---

## 🧑‍💻 Installation

### 1️⃣ Clone the project
```bash
git clone https://github.com/your-org/petguardian-api.git
cd petguardian-api
````

### 2️⃣ Install dependencies

```bash
composer install
```

### 3️⃣ Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and configure your database.

---

### 4️⃣ Run migrations

```bash
php artisan migrate --seed
```

---

### 5️⃣ Run the server

```bash
php artisan serve
```

API will be available at:

```
http://127.0.0.1:8000
```

---

## 🐶 Project Goal

PetGuardian aims to provide a free and open platform for:

* Pet registration (NGOs, foster homes, individuals)
* Virtual sponsorship (padrinhos)
* Real adoption workflows
* Pet health records and history
* Gamified Pet Life Score (PLS)

---

## 🧱 Tech Stack

* Laravel 11+
* MySQL
* Redis (future)
* Docker (development)

---

## 📂 Basic Structure

```
Request → Controller → UseCase → Service → Eloquent Model
```

---

## 🧪 Tests

```bash
php artisan test
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## ⚖️ License

This project is licensed under the **AGPL-3.0 License**.

---

## 🐕 About PetGuardian

PetGuardian is an open-source initiative to help animals through technology.

If you like this project, consider giving it a ⭐ on GitHub.

```
```
