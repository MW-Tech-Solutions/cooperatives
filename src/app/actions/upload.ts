
'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Handles logo file uploads to the local project directory.
 * Note: In a production serverless environment like Vercel, 
 * this would require an external bucket, but for this project 
 * directory request, we use the public/uploads folder.
 */
export async function uploadLogo(formData: FormData) {
  const file = formData.get('logo') as File;
  if (!file || !(file instanceof File)) {
    return { success: false, error: 'Invalid or missing file provided' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the upload directory exists within public/ so it's accessible via URL
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const path = join(uploadDir, fileName);
    
    await writeFile(path, buffer);

    return { 
      success: true, 
      url: `/uploads/${fileName}` 
    };
  } catch (error: any) {
    console.error('Upload action error:', error);
    return { success: false, error: `Upload processing failed: ${error.message}` };
  }
}
