import { t } from "elysia";

export const getPeopleModel = {
  query: t.Object({
    page: t.Numeric({ default: 1, minimum: 1 }),
    limit: t.Numeric({ default: 20, minimum: 1, maximum: 1000 }),
    search: t.Optional(t.String()),
  }),
  response: t.Object({
    data: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
        slug: t.String(),
        description: t.Nullable(t.String()),
        imageId: t.Nullable(t.String()),
      }),
    ),
    pagination: t.Object({
      page: t.Number(),
      limit: t.Number(),
      total: t.Number(),
      totalPages: t.Number(),
      hasNext: t.Boolean(),
      hasPrev: t.Boolean(),
    }),
  }),
};

export const getPersonByIdModel = {
  query: t.Object({
    id: t.String(),
  }),
  response: t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    description: t.Nullable(t.String()),
    imageId: t.Nullable(t.String()),
  }),
};

export const createPersonModel = {
  body: t.Object({
    name: t.String(),
    slug: t.String(),
    description: t.Optional(t.String()),
    imageId: t.Optional(t.String()),
  }),
  response: t.Object({
    message: t.String(),
  }),
};

export const updatePersonModel = {
  body: t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    description: t.Optional(t.String()),
    imageId: t.Optional(t.String()),
  }),
  response: t.Object({
    message: t.String(),
  }),
};

export const deletePersonModel = {
  body: t.Object({
    id: t.String(),
  }),
  response: t.Object({
    message: t.String(),
  }),
};
