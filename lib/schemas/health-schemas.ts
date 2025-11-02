/**
 * Health Data Schemas
 * 
 * TypeScript schemas for health data based on FHIR (Fast Healthcare Interoperability Resources)
 * and Medplum patterns. These schemas ensure data consistency and type safety across the application.
 * 
 * References:
 * - FHIR R4: https://www.hl7.org/fhir/
 * - Medplum: https://github.com/medplum/medplum
 */

import { z } from 'zod';

// ==================================
// 👤 PATIENT SCHEMA
// ==================================

/**
 * Contact information schema
 */
export const contactSchema = z.object({
  relationship: z.enum(['emergency', 'family', 'friend', 'partner', 'other']),
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido'),
  email: z.string().email('Email inválido').optional(),
});

/**
 * Address schema
 */
export const addressSchema = z.object({
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  country: z.string().default('BR'),
});

/**
 * Patient schema based on FHIR Patient resource
 */
export const patientSchema = z.object({
  id: z.string().uuid().optional(),
  // Demographics
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  gender: z.enum(['female', 'male', 'other', 'unknown']),
  
  // Contact information
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  address: addressSchema,
  emergencyContact: contactSchema,
  
  // Identifiers
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').optional(),
  healthcareId: z.string().optional(), // SUS card number or health insurance
  
  // Clinical
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']).optional(),
  allergies: z.array(z.string()).default([]),
  chronicConditions: z.array(z.string()).default([]),
  
  // Pregnancy specific
  isPregnant: z.boolean().default(false),
  estimatedDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gestationalAge: z.number().int().min(0).max(42).optional(), // weeks
  numberOfPregnancies: z.number().int().min(0).optional(),
  numberOfBirths: z.number().int().min(0).optional(),
  
  // Metadata
  active: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Patient = z.infer<typeof patientSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Address = z.infer<typeof addressSchema>;

// ==================================
// 🏥 APPOINTMENT SCHEMA
// ==================================

/**
 * Appointment schema based on FHIR Appointment resource
 */
export const appointmentSchema = z.object({
  id: z.string().uuid().optional(),
  
  // Scheduling
  status: z.enum(['proposed', 'pending', 'booked', 'arrived', 'fulfilled', 'cancelled', 'noshow']),
  appointmentType: z.enum([
    'prenatal',       // Pré-natal
    'postnatal',      // Pós-parto
    'ultrasound',     // Ultrassom
    'consultation',   // Consulta geral
    'emergency',      // Emergência
    'followup',       // Retorno
    'routine',        // Rotina
  ]),
  
  // Date and time
  startDateTime: z.string().datetime('Data e hora de início inválidas'),
  endDateTime: z.string().datetime('Data e hora de término inválidas'),
  duration: z.number().int().positive('Duração deve ser positiva'), // minutes
  
  // Participants
  patientId: z.string().uuid('ID do paciente inválido'),
  practitionerId: z.string().uuid('ID do profissional inválido').optional(),
  
  // Details
  specialty: z.string().optional(),
  reason: z.string().min(1, 'Motivo é obrigatório'),
  notes: z.string().optional(),
  
  // Location
  locationId: z.string().uuid().optional(),
  locationName: z.string().optional(),
  
  // Metadata
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  cancelledAt: z.string().datetime().optional(),
  cancellationReason: z.string().optional(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

// ==================================
// 🔬 OBSERVATION SCHEMA
// ==================================

/**
 * Observation schema based on FHIR Observation resource
 * Used for vital signs, lab results, and other measurements
 */
export const observationSchema = z.object({
  id: z.string().uuid().optional(),
  
  // Status
  status: z.enum(['registered', 'preliminary', 'final', 'amended', 'cancelled']),
  
  // What was observed
  code: z.string().min(1, 'Código é obrigatório'), // e.g., 'blood-pressure', 'weight', 'glucose'
  display: z.string().min(1, 'Nome do exame é obrigatório'),
  category: z.enum([
    'vital-signs',    // Sinais vitais
    'laboratory',     // Laboratorial
    'imaging',        // Imagem
    'procedure',      // Procedimento
    'survey',         // Questionário
    'exam',           // Exame físico
  ]),
  
  // Value
  valueQuantity: z.object({
    value: z.number(),
    unit: z.string(),
    system: z.string().optional(), // e.g., 'http://unitsofmeasure.org'
  }).optional(),
  valueString: z.string().optional(),
  valueBoolean: z.boolean().optional(),
  
  // Reference ranges
  referenceRange: z.object({
    low: z.number().optional(),
    high: z.number().optional(),
    unit: z.string(),
  }).optional(),
  
  // Interpretation
  interpretation: z.enum(['normal', 'high', 'low', 'critical']).optional(),
  notes: z.string().optional(),
  
  // Context
  patientId: z.string().uuid('ID do paciente inválido'),
  encounterId: z.string().uuid().optional(), // Related appointment/visit
  performerId: z.string().uuid().optional(), // Who performed the observation
  
  // Timing
  effectiveDateTime: z.string().datetime('Data e hora inválidas'),
  issuedAt: z.string().datetime().optional(),
  
  // Metadata
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Observation = z.infer<typeof observationSchema>;

// ==================================
// 💊 MEDICATION SCHEMA
// ==================================

/**
 * Medication and prescription schema based on FHIR MedicationRequest
 */
export const medicationSchema = z.object({
  id: z.string().uuid().optional(),
  
  // Status
  status: z.enum(['active', 'on-hold', 'cancelled', 'completed', 'stopped']),
  intent: z.enum(['proposal', 'plan', 'order', 'instance-order']),
  
  // Medication
  medicationName: z.string().min(1, 'Nome do medicamento é obrigatório'),
  medicationCode: z.string().optional(), // Standard code (e.g., RxNorm)
  
  // Dosage
  dosageInstruction: z.object({
    text: z.string().min(1, 'Instruções de dosagem são obrigatórias'),
    route: z.enum(['oral', 'topical', 'injection', 'inhalation', 'other']).optional(),
    frequency: z.string(), // e.g., '1x/day', '2x/day', 'every 8 hours'
    doseQuantity: z.object({
      value: z.number().positive(),
      unit: z.string(), // e.g., 'mg', 'ml', 'tablet'
    }),
    timing: z.string().optional(), // e.g., 'before meals', 'at bedtime'
  }),
  
  // Period
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  
  // Context
  patientId: z.string().uuid('ID do paciente inválido'),
  prescriberId: z.string().uuid('ID do prescritor inválido'),
  
  // Additional information
  reason: z.string().optional(),
  notes: z.string().optional(),
  
  // Metadata
  prescribedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Medication = z.infer<typeof medicationSchema>;

// ==================================
// 📋 MEDICAL HISTORY SCHEMA
// ==================================

/**
 * Medical history schema based on FHIR Condition resource
 */
export const medicalHistorySchema = z.object({
  id: z.string().uuid().optional(),
  
  // Clinical status
  clinicalStatus: z.enum(['active', 'recurrence', 'relapse', 'inactive', 'remission', 'resolved']),
  verificationStatus: z.enum(['unconfirmed', 'provisional', 'differential', 'confirmed', 'refuted']),
  
  // Condition
  category: z.enum([
    'problem-list-item',
    'encounter-diagnosis',
    'health-concern',
    'pregnancy-complication',
  ]),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  
  // What
  code: z.string().min(1, 'Código da condição é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  
  // When
  onsetDateTime: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
  abatementDateTime: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  
  // Context
  patientId: z.string().uuid('ID do paciente inválido'),
  encounterId: z.string().uuid().optional(),
  asserterId: z.string().uuid().optional(), // Who recorded this
  
  // Additional information
  notes: z.string().optional(),
  
  // Metadata
  recordedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type MedicalHistory = z.infer<typeof medicalHistorySchema>;

// ==================================
// 🤰 PREGNANCY TRACKING SCHEMA
// ==================================

/**
 * Pregnancy-specific tracking schema
 */
export const pregnancyTrackingSchema = z.object({
  id: z.string().uuid().optional(),
  
  // Basic information
  patientId: z.string().uuid('ID da paciente inválido'),
  status: z.enum(['active', 'completed', 'terminated']),
  
  // Dates
  lastMenstrualPeriod: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  estimatedDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  
  // Pregnancy details
  gestationalAge: z.number().int().min(0).max(42), // weeks
  numberOfFetuses: z.number().int().min(1).default(1),
  
  // History
  pregnancyNumber: z.number().int().positive('Número de gravidez deve ser positivo'),
  previousPregnanciesCount: z.number().int().min(0),
  previousBirthsCount: z.number().int().min(0),
  previousMiscarriagesCount: z.number().int().min(0).optional(),
  
  // Risk factors
  riskLevel: z.enum(['low', 'medium', 'high']),
  riskFactors: z.array(z.string()).default([]),
  complications: z.array(z.string()).default([]),
  
  // Monitoring
  weight: z.object({
    prePregnancy: z.number().positive().optional(),
    current: z.number().positive().optional(),
    gain: z.number().optional(),
    unit: z.string().default('kg'),
  }).optional(),
  
  bloodPressure: z.object({
    systolic: z.number().int().min(60).max(200),
    diastolic: z.number().int().min(40).max(150),
    date: z.string().datetime(),
  }).optional(),
  
  // Notes
  notes: z.string().optional(),
  
  // Metadata
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type PregnancyTracking = z.infer<typeof pregnancyTrackingSchema>;

// ==================================
// 📝 UTILITY TYPES AND VALIDATORS
// ==================================

/**
 * Common date validator for Brazilian format (DD/MM/YYYY)
 */
export const brazilianDateValidator = z.string().refine(
  (date) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(date)) return false;
    const [, day, month, year] = date.match(regex)!;
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return d.getDate() === parseInt(day) && 
           d.getMonth() === parseInt(month) - 1 && 
           d.getFullYear() === parseInt(year);
  },
  { message: 'Data inválida. Use o formato DD/MM/YYYY' }
);

/**
 * CPF validator
 */
export const cpfValidator = z.string().refine(
  (cpf) => {
    // Remove formatting
    const cleanCpf = cpf.replace(/[^\d]/g, '');
    if (cleanCpf.length !== 11) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    
    // Validate check digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (parseInt(cleanCpf.charAt(9)) !== digit) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (parseInt(cleanCpf.charAt(10)) !== digit) return false;
    
    return true;
  },
  { message: 'CPF inválido' }
);

/**
 * Phone number validator (Brazilian format)
 */
export const brazilianPhoneValidator = z.string().refine(
  (phone) => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  },
  { message: 'Telefone inválido. Use formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX' }
);
