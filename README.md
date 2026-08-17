# FreshKeep

FreshKeep is a lightweight food inventory app that helps individuals keep track of what they have, spot expiry dates, and use ingredients before they become waste.

## Problem

Food is often forgotten in the fridge, freezer, or pantry until it expires. FreshKeep makes expiry urgency visible without adding the complexity of a full meal-planning platform.

## Features

- Add, edit, and remove food items
- Dynamic expired, expiring soon, and fresh statuses
- Search, location filters, status filters, and sorting
- Dashboard statistics calculated from the current inventory
- Optional demo inventory
- Gemini-powered meal suggestions based on actual inventory
- Multilingual interface: English, French, and Arabic
- RTL support for Arabic
- Persistent inventory using browser localStorage
- Responsive and accessible interface
- Light and dark themes

## AI Feature

FreshKeep uses the Google Gemini API to generate practical meal suggestions from the user's current inventory.

The application sends only the necessary inventory fields to a Next.js server route. The route asks Gemini for 1–3 structured meal suggestions, prioritizing ingredients that expire soon.

The response is requested as structured JSON and validated on the server before being returned to the client.

FreshKeep does not train a machine learning model; Gemini is used as an external LLM API service.

## Tech Stack

- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Browser localStorage
- Google Gemini API
- Vercel

## Architecture

The client stores and filters inventory locally and sends meal suggestion requests to:

`POST /api/suggest-meal`

The server-side route:

1. Validates the incoming inventory
2. Reads the Gemini API key from the server environment
3. Sends the relevant inventory data to Gemini
4. Requests a structured JSON response
5. Validates the generated suggestions
6. Returns the validated suggestions to the client

The Gemini API key is never exposed to the browser.

## Data Storage

localStorage is appropriate for this intentionally small, single-user portfolio project because it requires no account or database setup and keeps the application simple and easy to understand.

A production multi-device version could move inventory data to a cloud database with user authentication and synchronization.

## Internationalization

FreshKeep supports:

- 🇬🇧 English
- 🇫🇷 French
- 🇩🇿 Arabic

The selected language is persisted locally, and Arabic automatically switches the interface to RTL layout.

Meal suggestions are also generated in the selected language.

## Getting Started

```bash
npm install
npm run dev
