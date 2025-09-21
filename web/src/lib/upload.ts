export type UploadResult = { ok: boolean; message?: string; [k: string]: any };

export function uploadFileXHR(
  endpoint: string,
  fieldName: string,
  file: File,
  formExtras?: Record<string, string>,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append(fieldName, file);
    if (formExtras) for (const [k, v] of Object.entries(formExtras)) fd.append(k, v);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);
    xhr.withCredentials = true; // include cookies if backend uses them

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable && onProgress) onProgress(Math.round((evt.loaded / evt.total) * 100));
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      const text = xhr.responseText || '';
      let json: any = {};
      try { json = JSON.parse(text); } catch {}
      if (xhr.status >= 200 && xhr.status < 300) resolve(json.ok ? json : { ok: true, ...json });
      else reject(new Error(json?.error?.message || json?.message || `${xhr.status} ${xhr.statusText}`));
    };

    xhr.send(fd);
  });
}
