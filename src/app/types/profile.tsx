/**
 * Profile Type Definition
 * 
 * This file defines the TypeScript interface for business card profiles.
 * It includes all the fields that can be stored for each business card.
 * 
 * Purpose: Type safety and documentation for profile data structure
 * Dependencies: TypeScript
 */

export interface Profile {
    id: string;
    customerId?: string;
    name?: string;
    title?: string;
    companyName?: string;
    phone1?: string;
    phone2?: string;
    email?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
    description?: string;
  }
  