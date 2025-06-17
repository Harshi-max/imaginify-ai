export async function saveImageToDB(imageData: any) {
  const res = await fetch("/api/save-image", {
    method: "POST",
    body: JSON.stringify(imageData),
  });

  if (!res.ok) {
    throw new Error("Image not saved");
  }

  return res.json();
}
