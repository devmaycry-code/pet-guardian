# Software Requirements Specification (SRS)

## System: Pet Guardian

------------------------------------------------------------------------

# 1. Introduction

## 1.1 Purpose

This document describes the functional and non-functional requirements of the **Pet Guardian** system, a digital platform for virtual and real pet adoption, health tracking, donations, and gamification.

------------------------------------------------------------------------

## 1.2 System Scope

Pet Guardian connects sponsors, guardians, NGOs, and foster homes to promote adoption and monitor the pet's life.

Main features:
- Pet registration  
- Virtual and real adoption  
- Pet health wallet  
- Donation and gift records  
- Charts and reports  
- Gamification (Pet Life Score)

------------------------------------------------------------------------

## 1.3 Definitions and Acronyms

| Term | Description |
|------|-------------|
| PLS  | Pet Life Score |
| NGO  | Non-Governmental Organization |
| Guardian | Legal pet owner |
| Sponsor | Virtual supporter |
| MVP | Minimum Viable Product |

------------------------------------------------------------------------

# 2. System Overview

## 2.1 Modules

- Authentication and Identity  
- Pet Management  
- Virtual Adoption  
- Real Adoption  
- Health and History  
- Donations  
- Gamification (PLS)  
- Reports  
- Administration  

------------------------------------------------------------------------

## 2.2 User Profiles

### Sponsor

- View pets  
- Sponsor pets  
- Make donations  
- Track health  

### Guardian

- Manage pet profile  
- Record health data  
- Publish updates  

### NGO / Foster Home

- Register pets  
- Update adoption status  

### Administrator

- Moderate users and pets  
- Access global reports  

------------------------------------------------------------------------

# 3. Functional Requirements

## 3.1 Registration and Authentication

- FR-01: User registration  
- FR-02: Secure login (JWT)  
- FR-03: Access profiles  

## 3.2 Pet Management

- FR-04: Pet registration  
- FR-05: Edit and remove pets  
- FR-06: Public pet profile  
- FR-07: Pet origin (NGO, Foster Home, Guardian)  

## 3.3 Virtual Adoption

- FR-08: Sponsor a pet  
- FR-09: Cancel sponsorship  
- FR-10: List active sponsors  

## 3.4 Real Adoption

- FR-11: Register real adoption  
- FR-12: Define guardian  
- FR-13: Upload contract  

## 3.5 Health Wallet

- FR-14: Biometric metrics record  
- FR-15: Vaccine records  
- FR-16: Clinical events record  
- FR-17: Immutable history  

## 3.6 Donations and Gifts

- FR-18: Donation records  
- FR-19: Gift records  
- FR-20: Financial history  

## 3.7 Pet Life Score (PLS)

- FR-21: Automatic calculation  
- FR-22: Health, care, and community components  
- FR-23: Historical snapshots  
- FR-24: Achievements and levels  

## 3.8 Reports

- FR-25: Weight chart  
- FR-26: Donation chart  
- FR-27: PDF export  

## 3.9 Social Timeline

- FR-28: Pet posts  
- FR-29: Comments and reactions  

------------------------------------------------------------------------

# 4. Non-Functional Requirements

## 4.1 Performance

- NFR-01: Support 10,000 concurrent users  
- NFR-02: Response time < 500ms  

## 4.2 Security

- NFR-03: HTTPS required  
- NFR-04: Sensitive data encryption  
- NFR-05: To be defined (e.g., RBAC)  

## 4.3 Privacy (LGPD)

- NFR-06: Data consent  
- NFR-07: Anonymization  
- NFR-08: Audit logs  

## 4.4 Usability

- NFR-09: Responsive interface  
- NFR-10: Gamified UX  

## 4.5 Scalability

- NFR-11: Modular architecture  
- NFR-12: Asynchronous processing  

------------------------------------------------------------------------

# 5. Data Model (Summary)

Main entities:
- User  
- Pet  
- Sponsorship  
- RealAdoption  
- PetMetric  
- PetVaccine  
- PetHealthEvent  
- PetDonation  
- PetGift  
- PetScoreSnapshot  

------------------------------------------------------------------------

# 6. Constraints

- Backend: Laravel  
- Frontend: Blade  
- Database: MySQL  
- Storage: Local / S3 compatible  

------------------------------------------------------------------------

# 7. Use Cases

## UC-01: Register Pet

Actor: NGO/Guardian  

## UC-02: Sponsor Pet

Actor: Sponsor  

## UC-03: Record Health

Actor: Guardian  

## UC-04: Calculate PLS

Actor: System  

------------------------------------------------------------------------

# 8. Roadmap

## Phase 1

- Pet registration  
- Virtual adoption  
- Timeline  

## Phase 2

- Health wallet  
- Recurring donations  

## Phase 3

- Full PLS  
- AI and gamification  

------------------------------------------------------------------------

# 9. PLS Formula

```
PLS = (HealthScore * 0.5) + (CareScore * 0.3) + (CommunityScore * 0.2)
```

------------------------------------------------------------------------

# 10. Technologies

- Laravel, Blade, MySQL, Redis, Docker, S3
