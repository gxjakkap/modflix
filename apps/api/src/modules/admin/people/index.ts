import Elysia from "elysia";
import { ErrorModel } from "@/schemas/error";
import {
  createPersonModel,
  deletePersonModel,
  getPeopleModel,
  getPersonByIdModel,
  updatePersonModel,
} from "./model";
import {
  createPerson,
  deletePerson,
  getPeople,
  getPersonById,
  updatePerson,
} from "./service";

export const peopleModule = new Elysia({ prefix: "/people" })
  .get(
    "/list",
    async ({ query }) => {
      const { page, limit, search } = query;
      const offset = (page - 1) * limit;

      const { rows, total } = await getPeople(offset, limit, search);

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
      query: getPeopleModel.query,
      response: {
        200: getPeopleModel.response,
        400: ErrorModel,
        500: ErrorModel,
      },
    },
  )
  .get(
    "/:id",
    async ({ params, set }) => {
      const { id } = params;

      const person = await getPersonById(id);

      if (!person) {
        set.status = 404;
        return {
          code: 404,
          message: "Not Found",
        };
      }

      return {
        id: person.id,
        name: person.name,
        slug: person.slug,
        description: person.description,
        imageId: person.imageId,
      };
    },
    {
      params: getPersonByIdModel.query,
      response: {
        200: getPersonByIdModel.response,
        400: ErrorModel,
        404: ErrorModel,
        500: ErrorModel,
      },
    },
  )
  .post(
    "/create",
    async ({ body, set }) => {
      const result = await createPerson(body);

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
      body: createPersonModel.body,
      response: {
        200: createPersonModel.response,
        400: ErrorModel,
        500: ErrorModel,
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, set }) => {
      const { id } = params;
      const result = await updatePerson(id, body);

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
      params: getPersonByIdModel.query,
      body: updatePersonModel.body,
      response: {
        200: updatePersonModel.response,
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
      const result = await deletePerson(id);

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
      params: deletePersonModel.body,
      response: {
        200: deletePersonModel.response,
        400: ErrorModel,
        404: ErrorModel,
        500: ErrorModel,
      },
    },
  );
