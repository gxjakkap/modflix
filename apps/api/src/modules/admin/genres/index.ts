import Elysia from "elysia";
import { ErrorModel } from "@/schemas/error";
import {
  createGenreModel,
  deleteGenreModel,
  getGenreByIdModel,
  getGenresModel,
  updateGenreModel,
} from "./model";
import {
  createGenre,
  deleteGenre,
  getGenreById,
  getGenres,
  updateGenre,
} from "./service";

export const genresModules = new Elysia({ prefix: "/genres" })
  .get(
    "/list",
    async ({ query }) => {
      const { page, limit, search } = query;
      const offset = (page - 1) * limit;

      const { rows, total } = await getGenres(offset, limit, search);

      return {
        data: rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    },
    {
      query: getGenresModel.query,
      response: {
        200: getGenresModel.response,
        400: ErrorModel,
        500: ErrorModel,
      },
    },
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const { id } = params;

      const genre = await getGenreById(id);

      if (!genre) {
        set.status = 404;
        return {
          code: 404,
          message: "Not Found",
        };
      }

      return {
        id: genre.id,
        name: genre.name,
        slug: genre.slug,
      };
    },
    {
      params: getGenreByIdModel.query,
      response: {
        200: getGenreByIdModel.response,
        400: ErrorModel,
        404: ErrorModel,
        500: ErrorModel,
      },
    },
  )
  .post(
    "/create",
    async ({ body, set }) => {
      const result = await createGenre(body);

      if (result.status !== 200) {
        set.status = result.status;
        return {
          code: result.status,
          message: result.message || "An error occurred",
        };
      }

      return { message: "Success" };
    },
    {
      body: createGenreModel.body,
      response: {
        200: createGenreModel.response,
        400: ErrorModel,
        500: ErrorModel,
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, set }) => {
      const { id } = params;
      const result = await updateGenre(id, body);

      if (result.status !== 200) {
        set.status = result.status;
        return {
          code: result.status,
          message: result.message || "An error occurred",
        };
      }

      return { message: "Success" };
    },
    {
      params: getGenreByIdModel.query,
      body: updateGenreModel.body,
      response: {
        200: updateGenreModel.response,
        400: ErrorModel,
        404: ErrorModel,
        500: ErrorModel,
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, set }) => {
      const { id } = params;
      const result = await deleteGenre(id);

      if (result.status !== 200) {
        set.status = result.status;
        return {
          code: result.status,
          message: result.message || "An error occurred",
        };
      }

      return { message: "Success" };
    },
    {
      params: deleteGenreModel.body,
      response: {
        200: deleteGenreModel.response,
        400: ErrorModel,
        404: ErrorModel,
        500: ErrorModel,
      },
    },
  );
