# Screen Wireframes & User Flows (WIREFRAMES)

## Project Name: Blood Donation Network (BDN)
**Document Version:** 1.0.0  

---

## 1. User Journey 1: Hospital Creates Emergency Blood Request

```
[ Hospital Dashboard ] 
        |
        | Click "+ New Request"
        v
[ Screen 1.1: Request Modal ] ---> (Fill Blood Group, Urgency, Units) ---> Click "Broadcast Alert"
                                                                                 |
                                                                                 v
[ Screen 1.2: Active Request Live Tracker ] <--- (WebSocket update: Matched Donors Acceptance)
```

### Screen 1.1: Hospital Create Request Modal Wireframe
```
+-------------------------------------------------------------------------+
| [X] Create Emergency Blood Request                                      |
+-------------------------------------------------------------------------+
| Required Blood Group:                 Urgency Level:                    |
| [ (O-) O-Negative          v ]        ( ) Routine  ( ) Urgent  (*) CRITICAL |
|                                                                         |
| Component Type:                       Units Needed (450ml bags):        |
| [ Packed Red Blood Cells   v ]        [ 3                     ]         |
|                                                                         |
| Required By Date/Time:                Collection Room / Emergency Desk: |
| [ 2026-07-30  18:00        ]        [ Emergency OR Room 3 - 2nd Floor] |
|                                                                         |
| Clinical Emergency Notes:                                               |
| +---------------------------------------------------------------------+ |
| | Acute trauma patient in surgery. Immediate O- negative required.    | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| [ Cancel ]                                   [ BROADCAST EMERGENCY ALERT ]|
+-------------------------------------------------------------------------+
```

---

### Screen 1.2: Hospital Live Request Tracker Wireframe
```
+-------------------------------------------------------------------------+
| ST. JUDE EMERGENCY CENTER                    [ + Create Request ] [ User v] |
+-------------------------------------------------------------------------+
| ACTIVE EMERGENCY REQUESTS (1)                                           |
| +---------------------------------------------------------------------+ |
| | REQUEST #REQ-9812 | O-Negative | CRITICAL | 3 Units Needed           | |
| | Status: SEARCHING NEARBY DONORS (Radius: 50 km)                      | |
| | Created: 4 mins ago | Required By: Today 18:00                       | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| MATCHED DONOR RESPONSES (2 Accepted / 14 Notified)                      |
| +---------------------------------------------------------------------+ |
| | DONOR ID    | DISTANCE | ETA      | STATUS    | ACTION               | |
| |-------------+----------+----------+-----------+----------------------| |
| | Donor #8812 | 4.2 km   | ~12 mins | ACCEPTED  | [ Confirm Receipt ]  | |
| | Donor #4109 | 8.7 km   | ~20 mins | ACCEPTED  | [ Confirm Receipt ]  | |
| | Donor #9912 | 14.1 km  | --       | NOTIFIED  | (Waiting response...) | |
| +---------------------------------------------------------------------+ |
+-------------------------------------------------------------------------+
```

---

## 2. User Journey 2: Donor Receives & Accepts Emergency Alert

```
[ Mobile Push / SMS Alert ] 
        |
        | Click Notification Link
        v
[ Screen 2.1: Donor Alert Screen ] ---> Click "ACCEPT DONATION"
                                                 |
                                                 v
[ Screen 2.2: Active Mission Directions ] (Google Maps GPS Routing)
```

### Screen 2.1: Donor Alert Screen Wireframe (Mobile View)
```
+------------------------------------+
|  [!] CRITICAL BLOOD ALERT NEEDED   |
+------------------------------------+
|  Blood Type Needed: O-NEGATIVE     |
|  Hospital: St. Jude Emergency Ctr  |
|  Distance: 4.2 km (~12 min drive)  |
|                                    |
|  Emergency Note:                   |
|  "Acute trauma surgery patient."   |
|                                    |
|  Can you donate today?             |
|                                    |
|  +------------------------------+  |
|  |    [ ACCEPT DONATION ]       |  |
|  +------------------------------+  |
|  |    [ Decline / Unavailable ] |  |
|  +------------------------------+  |
|                                    |
|  * Your identity remains hidden    |
|    until you accept this match.    |
+------------------------------------+
```

### Screen 2.2: Active Mission Directions Wireframe
```
+------------------------------------+
|  [<-] MISSION EN ROUTE             |
+------------------------------------+
|  DESTINATION:                      |
|  St. Jude Emergency Center         |
|  750 Mission St, San Francisco     |
|                                    |
|  Contact Emergency Desk:           |
|  +1 (415) 555-0199                 |
|                                    |
|  [ OPEN GOOGLE MAPS NAVIGATION ]   |
|                                    |
|  Instructions upon arrival:        |
|  1. Park in Emergency Visitor Bay. |
|  2. Check-in at 2nd Floor Desk.    |
|  3. Show code: #MATCH-8812.        |
|                                    |
|  [ I Have Arrived at Hospital ]    |
+------------------------------------+
```

---

## 3. User Journey 3: System Admin Verifies Hospital Credentials

### Screen 3.1: Admin Accreditation Dashboard Wireframe
```
+-------------------------------------------------------------------------+
| BDN SYSTEM ADMIN PANEL                          [ Audit Logs ] [ Admin v]|
+-------------------------------------------------------------------------+
| PENDING HOSPITAL ACCREDITATION APPLICATIONS (1)                         |
| +---------------------------------------------------------------------+ |
| | HOSPITAL NAME  | LICENSE NO   | SUBMITTED | DOCS   | ACTIONS        | |
| |----------------+--------------+-----------+--------+----------------| |
| | Mercy Clinic   | CA-MED-99410 | 2 hrs ago | [PDF]  | [APPROVE] [REJ]| |
| +---------------------------------------------------------------------+ |
|                                                                         |
| VERIFIED HOSPITALS DIRECTORY (24 Active)                                |
| +---------------------------------------------------------------------+ |
| | St. Jude Emergency Center | License: CA-MED-88912 | Status: VERIFIED  | |
| | City General Hospital     | License: CA-MED-11029 | Status: VERIFIED  | |
| +---------------------------------------------------------------------+ |
+-------------------------------------------------------------------------+
```
