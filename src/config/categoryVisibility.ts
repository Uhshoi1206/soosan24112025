/**
 * Category Visibility Config
 *
 * TỰ ĐỘNG load từ CMS (src/content/categories/*.json)
 * Không cần hard-code categories nữa!
 *
 * Khi thêm category mới qua CMS:
 * 1. Tạo file JSON trong CMS → Auto commit to GitHub
 * 2. npm run cms:sync → Update CMS config dropdown
 * 3. Rebuild site → Category tự động xuất hiện
 *
 * NO MANUAL CONFIG NEEDED!
 */

import type { VehicleType, Truck } from '@/models/TruckTypes';

export type CategoryKey = VehicleType;

export interface CategoryConfig {
  key: CategoryKey;
  name: string;
  slug?: string;
  enabled: boolean;
  keywords?: string[];
  description?: string;
  order?: number;
}

// For client-side: categories are passed as props from .astro files
// No need to import astro:content here!
