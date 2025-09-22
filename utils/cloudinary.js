
export function optimizeCloudinaryUrl(url, width = 600, height = 600) {
  if (!url || !url.includes("/upload/")) return url; // Only process Cloudinary images
  return url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},c_limit,q_auto,f_auto,dpr_auto/`
  );
}
