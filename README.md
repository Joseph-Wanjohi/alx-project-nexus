# alx-project-nexus
# POLLY: Online Poll System (Web, Mobile, or PWA) - ProDev FE

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  [![Built with React](https://img.shields.io/badge/Built%20with-React-blue.svg)](https://reactjs.org/)  [![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)

---

## Table of Contents

* [Project Name](#project-name)
* [Real-World Application](#real-world-application)
* [Overview](#overview)
* [Project Goals](#project-goals)
* [Technologies Used](#technologies-used)
* [Key Features](#key-features)
* [Pages & Navigation](#pages--navigation)
* [Implementation Process](#implementation-process)
* [Installation & Setup](#installation--setup)
* [Deployment](#deployment)
* [Evaluation Criteria](#evaluation-criteria)
* [Colors](#colors)

---

## Project Name

**POLLY**

---

## Real-World Application

Simulates a real-world scenario where developers build an interactive polling platform that balances functionality, performance, and user experience.

**Learning Outcomes:**

* Develop real-time applications with live data updates
* Manage complex state using Redux
* Enhance user engagement with dynamic visualizations

---

## Overview

POLLY is an online polling web application designed to help users make decisions by creating, sharing, and voting on polls. Features include:

* **Live Polling Stats:** View which choice is leading in real time.
* **Category Filtering:** Filter polls by category (e.g., Technology, Lifestyle, Politics).
* **Poll History:** Browse past completed polls with final results.

POLLY delivers instant data visualizations and a user-friendly interface.

---

## Project Goals

1. **API Integration:** Fetch and display poll questions and real-time results from a backend API.
2. **State Management:** Use Redux to efficiently manage complex state.
3. **Dynamic Visualizations:** Implement responsive charts to display live poll results.

---

## Technologies Used

* **React / React Native**: Component-based UI for web and mobile
* **Redux**: Centralized state management
* **TypeScript**: Static typing for robust code
* **Charting Library**: Dynamic, animated visualizations (e.g., Recharts, Chart.js)

---

## Key Features

1. **Poll Creation & Voting**

   * Create polls with up to 4 options
   * Set poll category
   * Share polls via unique links

2. **Real-Time Results**

   * Live updates on vote submission
   * Charts auto-refresh without page reload

3. **Filtering & History**

   * Filter active polls by category
   * View history of completed polls

4. **Form Validation**

   * Enforce required fields
   * User-friendly error messages

---

## Pages & Navigation

### Sign Up & Sign In

Authentication pages for user registration and login.

### Homepage

* **Dynamic Welcome Text:** Personalized greeting based on username.
* **Active Polls Carousel:** Scrollable cards showing brief poll titles and current status.
* **Bottom Navigation Bar:** Quick access to Explore, Create New Poll, History, and Profile.

### Explore

Browse all available polls with filter buttons at the top. Example categories:

* Technology
* Lifestyle
* Entertainment
* Politics
* Sports

### Create New Poll (➕)

Form to define:

* **Poll Heading:** A clear, single-sentence question.
* **Choices:** Up to 4 options.
* **Category:** Select from predefined categories.

### History

List of polls the user has created, displayed similarly to the homepage carousel but static.

### Profile

Manage account settings:

* **Email**
* **Password**
* **Profile Picture**

---

## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/polly.git
   cd polly
   ```
2. **Install dependencies**:

   ```bash
   npm install
   ```
3. **Configure environment**:

   * Create a `.env` file with API endpoints and keys
4. **Start the application**:

   ```bash
   npm start
   ```

---

## Colors

```css
--mimi-pink:     #eccbd9ff;
--alice-blue:    #e1eff6ff;
--light-sky-blue:#97d2fbff;
--jordy-blue:    #83bcffff;
```

---
