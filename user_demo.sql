INSERT INTO Permission (name, description, createdAt, updatedAt) VALUES
('add-doctor', 'Add Doctor', NOW(), NOW()),
('list-doctor', 'List Doctor', NOW(), NOW()),
('add-patient', 'Add Patient', NOW(), NOW()),
('list-patient', 'List Patient', NOW(), NOW()),
('add-medicine', 'Add Medicine', NOW(), NOW()),
('list-medicine', 'List Medicine', NOW(), NOW()),
('add-treatment', 'Add Treatment', NOW(), NOW()),
('list-treatment', 'List Treatment', NOW(), NOW()),
('todays-appointment', 'Today\'s Appointment', NOW(), NOW()),
('prescription-list', 'Prescription List', NOW(), NOW()),
('create-prescription', 'Create Prescription', NOW(), NOW()),
('prescription-details', 'Prescription Details', NOW(), NOW()),
('prescription-history', 'Prescription History', NOW(), NOW()),
('invoice-list', 'Invoice List', NOW(), NOW()),
('invoice-details', 'Invoice Details', NOW(), NOW()),
('create-invoice', 'Create Invoice', NOW(), NOW()),
('next-appointment', 'Next Appointment', NOW(), NOW()),
('patient-history', 'Patient History', NOW(), NOW());


INSERT INTO Role (name, description, createdAt, updatedAt) VALUES
('Admin', 'Full access to all features', NOW(), NOW()),
('Doctor', 'Access to patients, prescriptions, appointments', NOW(), NOW()),
('Receptionist', 'Manage appointments and invoices', NOW(), NOW());


INSERT INTO RolePermission (roleId, permissionId) 
SELECT r.id, p.id
FROM Role r, Permission p
WHERE r.name = 'Admin';


INSERT INTO RolePermission (roleId, permissionId)
SELECT r.id, p.id
FROM Role r, Permission p
WHERE r.name = 'Doctor'
  AND p.name IN (
    'add-patient',
    'list-patient',
    'add-treatment',
    'list-treatment',
    'todays-appointment',
    'prescription-list',
    'create-prescription',
    'prescription-details',
    'prescription-history'
  );


INSERT INTO RolePermission (roleId, permissionId)
SELECT r.id, p.id
FROM Role r, Permission p
WHERE r.name = 'Receptionist'
  AND p.name IN (
    'todays-appointment',
    'invoice-list',
    'invoice-details',
    'create-invoice',
    'next-appointment',
    'patient-history'
  );
