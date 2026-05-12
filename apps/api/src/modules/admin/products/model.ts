import { t } from "elysia";

export const getProductsModel = {
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
        type: t.String(),
        price: t.Nullable(t.String()),
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

export const getProductByIdModel = {
  query: t.Object({
    id: t.String(),
  }),
  response: t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    type: t.String(),
    releaseDate: t.String(),
    price: t.Optional(t.Nullable(t.String())),
    posterFileId: t.Optional(t.Nullable(t.String())),
    bannerFileId: t.Optional(t.Nullable(t.String())),
    mediaFileId: t.Optional(t.Nullable(t.String())),
    genres: t.Optional(t.Array(t.String())),
    cast: t.Optional(
      t.Array(
        t.Object({
          peopleId: t.String(),
          role: t.String(),
        }),
      ),
    ),
    seasons: t.Optional(
      t.Array(
        t.Object({
          seasonNum: t.Number(),
          releaseDate: t.String(),
          episodes: t.Optional(
            t.Array(
              t.Object({
                episodeNum: t.Number(),
                name: t.String(),
                description: t.Optional(t.String()),
                releaseDate: t.String(),
                movieFileId: t.String(),
              }),
            ),
          ),
        }),
      ),
    ),
    previewUrls: t.Optional(t.Record(t.String(), t.String())),
  }),
};

export const createProductModel = {
  body: t.Object({
    name: t.String(),
    slug: t.String(),
    releaseDate: t.String(),
    type: t.Union([t.Literal("MOVIE"), t.Literal("SERIES")]),
    price: t.Optional(t.String()),
    posterFileId: t.Optional(t.String()),
    bannerFileId: t.Optional(t.String()),
    movieFileId: t.Optional(t.String()),
    seasons: t.Optional(
      t.Array(
        t.Object({
          seasonNum: t.Number(),
          releaseDate: t.String(),
          episodes: t.Optional(
            t.Array(
              t.Object({
                episodeNum: t.Number(),
                name: t.String(),
                description: t.Optional(t.String()),
                releaseDate: t.String(),
                movieFileId: t.String(),
              }),
            ),
          ),
        }),
      ),
    ),
    genres: t.Optional(t.Array(t.String())),
    cast: t.Optional(
      t.Array(
        t.Object({
          peopleId: t.String(),
          role: t.String(),
        }),
      ),
    ),
  }),
  response: t.Object({
    message: t.String(),
  }),
};

export const uploadProductFileModel = {
  body: t.Object({
    file: t.File(),
    resourceType: t.String(),
  }),
  response: t.Object({
    id: t.String(),
    fileKey: t.String(),
    fileName: t.String(),
    resourceType: t.String(),
  }),
};

export const updateProductModel = {
  body: t.Object({
    name: t.String(),
    slug: t.String(),
    type: t.Union([t.Literal("MOVIE"), t.Literal("SERIES")]),
    releaseDate: t.String(),
    price: t.Optional(t.String()),
    posterFileId: t.Optional(t.String()),
    bannerFileId: t.Optional(t.String()),
    movieFileId: t.Optional(t.String()),
    genres: t.Optional(t.Array(t.String())),
    cast: t.Optional(
      t.Array(
        t.Object({
          peopleId: t.String(),
          role: t.String(),
        }),
      ),
    ),
    seasons: t.Optional(
      t.Array(
        t.Object({
          id: t.Optional(t.String()),
          seasonNum: t.Number(),
          releaseDate: t.String(),
          episodes: t.Optional(
            t.Array(
              t.Object({
                id: t.Optional(t.String()),
                episodeNum: t.Number(),
                name: t.String(),
                description: t.Optional(t.String()),
                releaseDate: t.String(),
                movieFileId: t.String(),
              }),
            ),
          ),
        }),
      ),
    ),
  }),
  response: t.Object({
    message: t.String(),
  }),
};

export const deleteProductModel = {
  body: t.Object({
    id: t.String(),
  }),
  response: t.Object({
    message: t.String(),
  }),
};
