# frema-intranet
Frema a.s. company intranet solution

!!System is deeply connected to IS KARAT and Estelar attendance system and not working standalone

implemented technologies:
- MVC architecture
- Express backend
- React frontend
- MongoDB
- JWT tokens, silent login
- Redux (thunk)
- CRON job manager (needs more love)
- Ant design system

Version 0.2
- includes company attendance. You can easilly show who is in work right now and who is not (check the real time data from mssql db and filter results)
- includes CRM where you can add companies and crm records and track the progress of comunication. Records have graphical progress bar and you can find and filter results.
- JWT token authentization for user

Version 0.3
- It calculates the price of the order from the data in the information system and compares it with the technological plan
- The price is calculated from the machine costs, the average salary of the employee and the hours worked on the order and the material actually consumed
- BARCODE SYSTEM It now includes a third application that serves as a terminal for reading barcodes and employee RFID cards. Bar codes are used to report operations on orders 

Needs work!
next feature - user roles, alert system, admin menu, and lunch order system for employees

This is my first bigger project after one year of self studiyng JS.

