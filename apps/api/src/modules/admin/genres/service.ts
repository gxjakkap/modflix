/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { db } from "@modflix/db";
import { count, eq, ilike, or } from "@modflix/db/orm";
import { genre } from "@modflix/db/schema";

export const getGenres = async (
  offset: number,
  limit: number,
  search?: string,
) => {
  const where = search
    ? or(ilike(genre.name, `%${search}%`), ilike(genre.slug, `%${search}%`))
    : undefined;

  const [totalCount, rows] = await Promise.all([
    db
      .select({ count: count(genre.id) })
      .from(genre)
      .where(where),
    db.select().from(genre).where(where).limit(limit).offset(offset),
  ]);

  return {
    rows,
    total: totalCount[0]?.count ?? 0,
  };
};

export const getGenreById = async (id: string) => {
  const [row] = await db.select().from(genre).where(eq(genre.id, id));
  return row;
};

export const createGenre = async (data: { name: string; slug: string }) => {
  try {
    await db.insert(genre).values(data);
    return { status: 200 };
  } catch (e: any) {
    console.error("Failed to create genre:", e);
    if (e.code === "23505" && e.constraint === "genre_slug_unique") {
      return {
        status: 400,
        message: "Slug is already taken. Please try another.",
      };
    }
    return { status: 500, message: "Internal server error" };
  }
};

export const updateGenre = async (
  id: string,
  data: { name: string; slug: string },
) => {
  try {
    const existing = await getGenreById(id);
    if (!existing) {
      return { status: 404, message: "Genre not found" };
    }

    await db.update(genre).set(data).where(eq(genre.id, id));
    return { status: 200 };
  } catch (e: any) {
    console.error("Failed to update genre:", e);
    if (e.code === "23505" && e.constraint === "genre_slug_unique") {
      return {
        status: 400,
        message: "Slug is already taken. Please try another.",
      };
    }
    return { status: 500, message: "Internal server error" };
  }
};

export const deleteGenre = async (id: string) => {
  try {
    const existing = await getGenreById(id);
    if (!existing) {
      return { status: 404, message: "Genre not found" };
    }
    await db.delete(genre).where(eq(genre.id, id));
    return { status: 200 };
  } catch (e: any) {
    console.error("Failed to delete genre:", e);
    return { status: 500, message: "Internal server error" };
  }
};
