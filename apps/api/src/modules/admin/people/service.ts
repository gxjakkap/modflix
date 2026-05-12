/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import { db } from "@modflix/db";
import { count, eq, ilike, or } from "@modflix/db/orm";
import { people } from "@modflix/db/schema";

export const getPeople = async (
  offset: number,
  limit: number,
  search?: string,
) => {
  const where = search
    ? or(ilike(people.name, `%${search}%`), ilike(people.slug, `%${search}%`))
    : undefined;

  const [totalCount, rows] = await Promise.all([
    db
      .select({ count: count(people.id) })
      .from(people)
      .where(where),
    db.select().from(people).where(where).limit(limit).offset(offset),
  ]);

  return {
    rows,
    total: totalCount[0]?.count ?? 0,
  };
};

export const getPersonById = async (id: string) => {
  const [row] = await db.select().from(people).where(eq(people.id, id));
  return row;
};

export const createPerson = async (data: {
  name: string;
  slug: string;
  description?: string;
  imageId?: string;
}) => {
  try {
    await db.insert(people).values(data);
    return { status: 200 };
  } catch (e: any) {
    console.error("Failed to create person:", e);
    if (e.code === "23505" && e.constraint === "people_slug_unique") {
      return {
        status: 400,
        message: "Slug is already taken. Please try another.",
      };
    }
    return { status: 500, message: "Internal server error" };
  }
};

export const updatePerson = async (
  id: string,
  data: { name: string; slug: string; description?: string; imageId?: string },
) => {
  try {
    const existing = await getPersonById(id);
    if (!existing) {
      return { status: 404, message: "Person not found" };
    }

    await db.update(people).set(data).where(eq(people.id, id));
    return { status: 200 };
  } catch (e: any) {
    console.error("Failed to update person:", e);
    if (e.code === "23505" && e.constraint === "people_slug_unique") {
      return {
        status: 400,
        message: "Slug is already taken. Please try another.",
      };
    }
    return { status: 500, message: "Internal server error" };
  }
};

export const deletePerson = async (id: string) => {
  try {
    const existing = await getPersonById(id);
    if (!existing) {
      return { status: 404, message: "Person not found" };
    }
    await db.delete(people).where(eq(people.id, id));
    return { status: 200 };
  } catch (e: any) {
    console.error("Failed to delete person:", e);
    return { status: 500, message: "Internal server error" };
  }
};
