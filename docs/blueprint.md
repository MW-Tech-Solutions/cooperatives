# **App Name**: CoopNest

## Core Features:

- Secure User Authentication & RBAC: Handle user registration, login, and assign specific roles (Admin/President, Assistant President, Secretary General, Treasurer, Auditor, Member) to control access and permissions across the system.
- Dynamic System Configuration Dashboard: An exclusive module for Admin/President to define global parameters (e.g., contribution amount, loan multiplier, auto-debit date), create custom loan products with distinct interest rates and repayment durations.
- Member & Role Management: Admin functionality to onboard new members, assign and modify their roles, and manage their basic profile information.
- Paystack Payment Tokenization & Auto-Debit Setup: Secure interface for members to link their bank accounts/cards via Paystack for creating recurring auto-debit mandates, managed by the system's configurable collection dates.
- Automated Financial Calculation Engine: Backend services that dynamically compute loan interests, repayment schedules, and member contribution based on the configurable system settings.
- Role-Specific Governance Dashboards: Provide tailored views and relevant data summaries for each user role (e.g., Treasurer sees financial reports, Auditor views transaction logs, Members see personal savings/loan status).

## Style Guidelines:

- Background Color: Deep Professional Navy (#0F172A), providing a sophisticated and stable base for the interface.
- Primary Color: Action Blue (#3B82F6), chosen for interactive elements, calls-to-action, and key information, creating a dynamic contrast against the dark background.
- Accent Color: Success Emerald (#10B981), utilized to signify positive actions, successful transactions, or highlight crucial financial achievements, offering a fresh counterpoint to the primary blue.
- Headlines and prominent text use 'Outfit', a clean sans-serif, for a modern and strong visual presence. Body text and general content utilize 'Inter', another sans-serif, ensuring readability and clarity.
- Note: currently only Google Fonts are supported.
- Icons will be sourced from 'Lucide-React', maintaining a consistent, professional, and clear visual language across the application.
- A well-structured, modular layout emphasizing clean lines, spaciousness, and intuitive navigation for ease of use, particularly within the multi-role dashboards and configuration screens.
- Subtle, non-distracting transitions and micro-interactions for a fluid user experience, enhancing usability without creating visual clutter.