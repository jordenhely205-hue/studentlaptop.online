import { z } from "zod";
import { sanitizeCnic, isValidCnic } from "./psid";

export const degreeLevelEnum = z.enum([
  "Matric",
  "Intermediate",
  "Undergraduate",
  "Postgraduate",
]);

export const applicationStatusEnum = z.enum([
  "SUBMITTED",
  "PAYMENT_PENDING",
  "PAYMENT_VERIFIED",
  "UNDER_REVIEW",
  "MERIT_APPROVED",
  "MERIT_WAITLISTED",
  "REJECTED",
]);

export const submitApplicationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name cannot exceed 100 characters"),
    fatherName: z
      .string()
      .trim()
      .min(2, "Father's name must be at least 2 characters")
      .max(100, "Father's name cannot exceed 100 characters"),
    cnic: z
      .string()
      .transform(sanitizeCnic)
      .refine(isValidCnic, {
        message: "CNIC must be strictly 13 numerical digits",
      }),
    dateOfBirth: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date of birth format",
      }),
    gender: z.string().min(1, "Please select gender"),
    mobileNo: z
      .string()
      .trim()
      .regex(/^03\d{9}$/, "Mobile number must be a valid 11-digit Pakistani number (e.g., 03001234567)"),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .optional()
      .or(z.literal("")),
    province: z.string().min(2, "Province is required"),
    district: z.string().min(2, "District is required"),
    tehsil: z.string().min(2, "Tehsil is required"),
    currentAddress: z
      .string()
      .trim()
      .min(5, "Address must be at least 5 characters"),

    // Academic Details
    degreeLevel: degreeLevelEnum,
    instituteName: z
      .string()
      .trim()
      .min(2, "Institute name is required"),
    boardUniversity: z
      .string()
      .trim()
      .min(2, "Board or University name is required"),
    rollNumber: z
      .string()
      .trim()
      .min(1, "Roll number is required"),
    passingYear: z.coerce
      .number()
      .int()
      .min(1990, "Passing year must be 1990 or later")
      .max(2027, "Passing year cannot be in future"),
    totalMarks: z.coerce
      .number()
      .positive("Total marks must be greater than 0"),
    obtainedMarks: z.coerce
      .number()
      .nonnegative("Obtained marks cannot be negative"),
  })
  .refine((data) => data.obtainedMarks <= data.totalMarks, {
    message: "Obtained marks cannot exceed total marks",
    path: ["obtainedMarks"],
  });

export const verifyPaymentSchema = z.object({
  psid: z
    .string()
    .trim()
    .regex(/^9926\d{6}$/, "PSID must be a 10-digit code starting with 9926"),
  transactionId: z
    .string()
    .trim()
    .min(4, "Transaction ID must be at least 4 characters")
    .max(50, "Transaction ID is too long"),
  receiptUrl: z
    .string()
    .trim()
    .min(1, "Receipt image is required"),
});

export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
