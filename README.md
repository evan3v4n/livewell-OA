# Patient-Doctor Messaging App for Livewell OA

This repository contains a Next.js application that facilitates messaging between patients and doctors. It allows patients to find doctors based on common interests or reasons for consultation, such as "Acne" or "Weight Loss", and initiate a private chat.

## Features

- **User Authentication**: Separate login portals for patients and doctors.
- **Dynamic Matching**: Patients can view and start conversations with doctors who specialize in areas relevant to their health concerns.
- **Real-time Messaging**: Support for text and image messages.
- **Responsive Design**: Optimized for both desktop and mobile viewing.

## Technologies Used

- **Next.js**: The React framework for production.
- **Firebase**:
  - **Firestore**: Used for storing user data and chat messages.
  - **Firebase Authentication**: Manages user authentication and session management.
  - **Firebase Storage**: Used for image message functionality.
- **Tailwind CSS**: For styling the application.

## Project Structure

- `pages/`: Contains all the Next.js pages (React components) for navigation.
- `components/`: Reusable React components used throughout the application.
- `firebase/`: Firebase configuration and utility functions for interacting with Firebase services.
- `styles/`: Contains all Tailwind CSS stylesheets.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Firebase project
