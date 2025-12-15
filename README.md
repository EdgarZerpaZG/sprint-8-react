# IT Academy – Sprint N°8: React with Database

## 🌐 Dashboard App

This project is a **React (Vite) application** focused on learning how to connect a frontend to different **databases and cloud APIs**.

It includes:

- A **User admin panel (CRUD)** connected to **Supabase**.
- A **booking calendar** powered by **FullCalendar** with data stored and validated in **Supabase**.
- Integration with **Google Maps JavaScript API** (from Google Cloud) to display location data.
- Several **charts with Chart.js** to visualise data from the app.

---

## ✨ Purpose

The main goals of this sprint are:

- Understand how to use **different data sources** (Supabase, Google Maps API) in a React app.
- Gain hands-on experience with a **modern frontend stack** and **real databases**.
- Learn how to handle **dynamic data**, maps, and user sessions in a single dashboard.
- Practice **automated testing** of components and main flows with Vitest + React Testing Library.

---

## 🧠 Key Features

### 👤 User Management

- **User CRUD** (Create, Read, Update, Delete) using **Supabase**.
- `UserTable` component:
  - Displays all users from Supabase.
  - Buttons to **Edit**, **Delete** and **Active** users.

### 📅 Bookings Calendar (Supabase + FullCalendar)

- Booking system built with **FullCalendar React component**.
- Each booking is linked to:
  - `user_id` (Supabase Auth user)
  - `resource` (e.g. `consultorio-A`)
  - `start_time` / `end_time`
- Data storage and realtime notifications managed by **Supabase** (Postgres + Realtime).  
- A PostgreSQL function `is_available` checks if a time slot is free before creating or updating a booking.
- **Booking modal**:
  - Create, edit, delete and move bookings.
  - Shows clear error messages when the time slot is already taken or the user is not logged in.

### 🗺️ Google Maps Integration (Google Cloud)

- Integration with **Google Maps JavaScript API** to display maps and locations.
- The API key is created and managed from **Google Cloud Console**, where the Maps JavaScript API is enabled for the project.
- The key is loaded using environment variables and should be **restricted** in Google Cloud (HTTP referrers, quotas, etc).

### 📊 Charts & Data Visualisation (Chart.js)

- Visualisation of key metrics using **Chart.js** from users status. 

### 🔐 Authentication & Storage (Supabase)

- User registration and login handled with **Supabase Auth**.  
- Bookings are linked to the authenticated user via `user_id`.
- Supabase Storage can be used to store and serve user images or other files.  

---

## 🏗️ Technologies Used

- ⚛️ **React** (Vite)
- 🧩 **TypeScript**
- 💅 **Tailwind CSS** for styling
- 💾 **Supabase**
  - Auth
  - Database (PostgreSQL)
  - Realtime (bookings)
  - Storage
- 📅 **FullCalendar** + **Luxon** for calendar UI and date/time handling
- 🗺️ **Google Maps JavaScript API** (Google Cloud)
- 📊 **Chart.js** (and React bindings) for charts
- 🧪 **Vitest & React Testing Library** for testing

---

## 📦 Installation & Setup

1. Clone this repository:
```
git clone https://github.com/EdgarZerpaZG/sprint-8-react.git
```

2. Navigate to the project directory:
```
cd sprint-8-react
```

3. Run in the terminal:
```
npm install
npm run dev
```

4. Open the localhost url:
- Example: http://localhost:5173/

5. Additional feature with Testing(Vitest and React Testing), open the terminal and run:
```
sprint-8-react/ npm run test
```