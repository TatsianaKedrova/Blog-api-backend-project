export const creationVideoDate = new Date().toISOString();
export const publicationVideoDate = new Date(
  new Date().setDate(new Date().getDate() + 1)
).toISOString();
