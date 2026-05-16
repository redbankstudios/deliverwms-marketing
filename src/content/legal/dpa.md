---
title: "Data Processing Agreement"
shortTitle: "DPA"
description: "How Deliver WMS LLC processes personal information on behalf of customers — security, sub-processors, breach notification, and Data Subject rights."
summary: "The Data Processing Agreement that governs how Deliver WMS LLC processes personal information on behalf of Customer. Incorporated into the MSA and Terms of Service."
effectiveDate: 2026-05-12
lastUpdated: 2026-05-12
version: "1.0"
order: 4
---

This Data Processing Agreement (this "**DPA**") is entered into by Deliver WMS LLC, a Delaware limited liability company ("**Deliver WMS**" or "**Processor**"), and the customer that has accepted Deliver WMS's Terms of Service or executed a Master Services Agreement with Deliver WMS ("**Customer**" or "**Controller**"). It forms part of, and is incorporated by reference into, the [Master Services Agreement](/legal/msa) and the [Terms of Service](/legal/terms) (collectively, the "**Agreement**").

This DPA applies to Deliver WMS's processing of Personal Information on behalf of Customer in connection with the Service.

## 1. Definitions

Capitalized terms not otherwise defined here have the meanings set out in the Agreement.

- "**Applicable Privacy Law**" means all laws and regulations applicable to the processing of Personal Information under this DPA, including the California Consumer Privacy Act as amended by the California Privacy Rights Act ("**CCPA**"), and other US state privacy laws as they come into effect.
- "**Controller**," "**Processor**," "**Data Subject**," "**Personal Information**" (or "**Personal Data**"), "**Processing**," and "**Sub-processor**" have the meanings given to them under Applicable Privacy Law. Under the CCPA, "Controller" is analogous to "**Business**" and "Processor" is analogous to "**Service Provider**."
- "**Customer Personal Information**" means Personal Information included in Customer Data that Deliver WMS processes on behalf of Customer in connection with the Service.
- "**Personal Data Breach**" means a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, Customer Personal Information.
- "**Security Incident**" has the same meaning as Personal Data Breach.

## 2. Roles of the parties

The Parties acknowledge that, with respect to the Processing of Customer Personal Information under this DPA:

- **Customer is the Controller** (or in CCPA terms, the Business) of Customer Personal Information.
- **Deliver WMS is the Processor** (or in CCPA terms, the Service Provider) acting on behalf of Customer.

Where Customer is itself acting as a processor on behalf of a third-party controller (for example, a 3PL customer processing personal information belonging to its warehouse clients' end customers), Deliver WMS acts as a sub-processor and the Parties' obligations under this DPA will be interpreted accordingly.

## 3. Scope and subject matter of processing

### 3.1 Subject matter

Deliver WMS Processes Customer Personal Information solely to provide, secure, and improve the Service in accordance with the Agreement and Customer's documented instructions.

### 3.2 Duration

Processing continues for the duration of the Agreement, plus any post-termination period during which Deliver WMS retains Customer Personal Information for export or as required by law.

### 3.3 Nature and purpose

The nature and purpose of Processing are the provision of warehouse management, last-mile delivery, billing, reporting, and related Services as described in the Agreement and Documentation.

### 3.4 Categories of Data Subjects

Customer Personal Information may relate to: (a) Customer's personnel and authorized users; (b) personnel of Customer's warehouse clients and their end customers; (c) drivers and delivery recipients; and (d) other individuals whose information Customer chooses to upload to the Service.

### 3.5 Categories of Personal Information

Customer Personal Information may include: names, email addresses, phone numbers, business addresses, delivery addresses, IP addresses, device identifiers, transaction and order details, signatures, proof-of-delivery photographs and metadata, and any other Personal Information Customer chooses to upload. Deliver WMS does not require the upload of special-category data (such as health, biometric, or precise geolocation data), and Customer should avoid uploading such data unless strictly necessary for the Service.

## 4. Customer's instructions

Deliver WMS will Process Customer Personal Information only on Customer's documented instructions, including as set out in this DPA, the Agreement, and any Customer configuration of the Service. Customer's use of the Service constitutes Customer's instruction to Process Customer Personal Information consistent with the documented functionality of the Service. Deliver WMS will notify Customer if, in its opinion, an instruction would violate Applicable Privacy Law.

## 5. Customer responsibilities

Customer represents and warrants that:

- It has provided all required notices and obtained all necessary consents from Data Subjects to enable Deliver WMS to Process Customer Personal Information as contemplated by this DPA and the Agreement
- It has the lawful basis to upload Customer Personal Information to the Service
- Its instructions, including its configuration of the Service, comply with Applicable Privacy Law

Customer is responsible for honoring Data Subject rights requests submitted directly to it. Deliver WMS will assist as set out in Section 9.

## 6. Confidentiality

Deliver WMS will ensure that personnel authorized to Process Customer Personal Information are under appropriate confidentiality obligations (whether contractual or statutory).

## 7. Security measures

### 7.1 Technical and organizational measures

Deliver WMS will implement and maintain appropriate technical and organizational measures designed to protect Customer Personal Information against accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, including:

- **Encryption.** Encryption of Customer Personal Information in transit (TLS 1.2 or higher) and at rest.
- **Access controls.** Role-based access controls, least-privilege provisioning, mandatory multi-factor authentication for administrative access, and periodic access reviews.
- **Multi-tenant isolation.** Database-level row-level security policies enforcing strict tenant isolation; Customer Personal Information is logically segregated from other customers' data at the database layer.
- **Network and infrastructure security.** Web application firewalls, intrusion detection, and DDoS mitigation provided by Deliver WMS's hosting and CDN sub-processor.
- **Vulnerability management.** Routine vulnerability scanning, dependency monitoring, and timely patching of identified vulnerabilities.
- **Logging and monitoring.** Audit logging of access to and changes affecting Customer Personal Information, with logs retained for security and compliance review.
- **Backups and disaster recovery.** Regular, encrypted backups of production data with documented restore procedures.
- **Personnel.** Background checks (where lawfully permitted), confidentiality obligations, and security awareness training for personnel with access to Customer Personal Information.
- **Incident response.** A documented Security Incident response process aligned with Section 10.
- **Change management.** Code review, automated testing, and controlled deployment of changes to production.

### 7.2 Updates

Deliver WMS may update its security measures from time to time, provided that updates do not materially reduce the overall level of protection.

### 7.3 Customer-controlled measures

Certain security measures are within Customer's control (for example, enforcing strong passwords for end users it provisions, configuring role-based permissions appropriately, and managing access for departing personnel). Customer is responsible for using these controls in a manner consistent with its own security and compliance obligations.

## 8. Sub-processors

### 8.1 Authorization

Customer authorizes Deliver WMS to engage Sub-processors to Process Customer Personal Information, subject to the requirements of this Section 8.

### 8.2 Current Sub-processors

The current list of Sub-processors used by Deliver WMS is:

| Sub-processor | Purpose | Location of Processing |
| --- | --- | --- |
| Vercel Inc. | Web hosting, CDN, edge functions, cookieless web analytics, Core Web Vitals (Speed Insights) | United States |
| Supabase (or successor PostgreSQL provider) | Application database, authentication | United States |
| Stripe, Inc. | Payment processing | United States |
| Postmark (or successor email service) | Transactional and account email delivery | United States |
| Tawk.to | Live chat widget and ticketing on the marketing site | United States / Cyprus |

This list is maintained on this DPA page and may be updated by Deliver WMS from time to time. Customer may subscribe to notifications of changes by emailing `privacy@deliverwms.com`.

### 8.3 New or replacement Sub-processors

Deliver WMS will give Customer at least thirty (30) days advance notice before engaging a new Sub-processor that will Process Customer Personal Information. During the notice period, Customer may object to the new Sub-processor on reasonable grounds related to data protection. If the Parties cannot resolve the objection in good faith, Customer's sole remedy is to terminate the affected Order Form without refund of pre-paid, unused fees.

### 8.4 Sub-processor obligations

Deliver WMS will: (a) impose data protection obligations on each Sub-processor that are no less protective than those in this DPA; and (b) remain liable to Customer for the acts and omissions of its Sub-processors.

## 9. Data Subject rights

To the extent Customer is unable to access, correct, delete, or restrict the use of Customer Personal Information through self-service features of the Service, Deliver WMS will provide reasonable assistance to enable Customer to respond to Data Subject rights requests, taking into account the nature of the Processing.

If Deliver WMS receives a Data Subject rights request directed at Customer Personal Information, Deliver WMS will (unless prohibited by law) promptly forward the request to Customer and not respond to the Data Subject directly, except to acknowledge receipt and direct the Data Subject to Customer.

## 10. Personal Data Breach notification

### 10.1 Notification

Deliver WMS will notify Customer without undue delay after becoming aware of a Personal Data Breach affecting Customer Personal Information, and in any event within seventy-two (72) hours where reasonably feasible. The notice will include, to the extent then known:

- A description of the nature of the Personal Data Breach, including categories and approximate numbers of Data Subjects and records affected
- The likely consequences of the breach
- Measures taken or proposed to address the breach and mitigate its effects

If complete information is not available within seventy-two hours, Deliver WMS will provide it in phases as it becomes known.

### 10.2 Cooperation

Deliver WMS will reasonably cooperate with Customer's investigation of and response to a Personal Data Breach, including providing relevant information and access to logs where appropriate.

### 10.3 Customer-side notifications

Customer is responsible for notifying its end users, Data Subjects, regulators, and any other parties as required by Applicable Privacy Law. Deliver WMS will not make any public statement about a Personal Data Breach affecting Customer Personal Information without Customer's prior written consent, except as required by law.

## 11. Data protection impact assessments

To the extent required by Applicable Privacy Law, Deliver WMS will reasonably assist Customer in carrying out data protection impact assessments and consultations with supervisory authorities regarding the Processing of Customer Personal Information, taking into account the information available to Deliver WMS.

## 12. International transfers

The Service is currently provided from the United States, and Customer Personal Information is Processed in the United States. This DPA does not currently include the specific provisions required for transfers of personal data out of the European Economic Area, the United Kingdom, or other jurisdictions with cross-border transfer restrictions. If Customer requires GDPR or UK GDPR Standard Contractual Clauses or other cross-border transfer mechanisms, Customer should contact `privacy@deliverwms.com` before uploading any such personal data to the Service.

## 13. CCPA-specific provisions

For Customer Personal Information subject to the CCPA:

- Deliver WMS acts as a "Service Provider" and Processes Personal Information solely on Customer's behalf for the limited and specified purposes described in the Agreement.
- Deliver WMS will not: (a) sell or share Customer Personal Information; (b) retain, use, or disclose Customer Personal Information outside the direct business relationship between Customer and Deliver WMS, except as permitted by the CCPA; (c) combine Customer Personal Information with personal information received from or on behalf of another customer or collected through Deliver WMS's own interactions with consumers, except as permitted by the CCPA; or (d) use Customer Personal Information for purposes other than the business purposes specified in the Agreement.
- Deliver WMS certifies that it understands and will comply with the restrictions in this Section 13.

## 14. Audit rights

### 14.1 Information

Upon reasonable written request not more than once per twelve (12) month period, Deliver WMS will make available to Customer summary information necessary to demonstrate compliance with this DPA, including the most recent third-party security assessment report (such as a SOC 2 Type II report, when available) under appropriate confidentiality obligations.

### 14.2 On-site audit

If Customer has a legitimate reason to believe Deliver WMS is not complying with this DPA that cannot be addressed through the information provided under Section 14.1, Customer may, upon at least thirty (30) days written notice and during business hours, conduct or appoint a qualified independent third-party auditor to conduct an on-site audit. Audits must be reasonable in scope, must not interfere unreasonably with Deliver WMS's operations, and must protect the confidentiality of Deliver WMS's other customers' information. Customer bears all costs of the audit, except where the audit reveals a material breach of this DPA, in which case Deliver WMS bears reasonable costs.

## 15. Return and deletion

Upon termination or expiration of the Agreement, the data export and deletion provisions of the MSA or Terms of Service apply. In addition, upon Customer's written request received within thirty (30) days after termination, Deliver WMS will delete or anonymize Customer Personal Information, except where retention is required by law.

## 16. Liability

The liability provisions of the Agreement apply to claims arising under this DPA. Without limiting those provisions, each Party's aggregate liability under this DPA forms part of, and is subject to, the aggregate liability cap set forth in the Agreement.

## 17. General

### 17.1 Order of precedence

In the event of a conflict between this DPA and the Agreement regarding the Processing of Customer Personal Information, this DPA controls.

### 17.2 Changes

Deliver WMS may update this DPA from time to time to reflect changes in law, the Service, or its Sub-processor list. Material changes will be communicated to Customer at least thirty (30) days in advance.

### 17.3 Governing law

This DPA is governed by the same law specified in the Agreement (New Jersey law unless otherwise specified in an applicable Order Form).

### 17.4 Severability

If any provision of this DPA is held invalid or unenforceable, that provision will be enforced to the maximum extent permissible, and the remaining provisions will remain in full force and effect.

### 17.5 Counterparts

This DPA may be executed in counterparts and accepted electronically.

### 17.6 Contact

Privacy and data protection inquiries: `privacy@deliverwms.com`.
