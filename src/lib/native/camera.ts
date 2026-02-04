import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { isNative } from '../platform';

export async function takePhoto(): Promise<string | null> {
  if (!isNative()) return null;
  
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
    return photo.base64String || null;
  } catch {
    return null;
  }
}

export async function pickPhoto(): Promise<string | null> {
  if (!isNative()) return null;
  
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    return photo.base64String || null;
  } catch {
    return null;
  }
}
