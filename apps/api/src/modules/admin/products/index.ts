import Elysia from "elysia"
import { ErrorModel } from "@/schemas/error"
import { authMacro } from "../../auth"
import {
	createProductModel,
	deleteProductModel,
	getProductByIdModel,
	getProductsModel,
	updateProductModel,
	uploadProductFileModel,
} from "./model"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, uploadProductFile } from "./service"

export const productsModule = new Elysia({ prefix: "/products" })
	.use(authMacro)
	.post(
		"/upload",
		async ({ body, set, user }) => {
			const { file, resourceType } = body

			try {
				const record = await uploadProductFile({
					file,
					resourceType,
					addedBy: user.id,
				})

				return record
			} catch (error) {
				console.error("Failed to upload file:", error)
				set.status = 500
				return { code: 500, message: "Internal server error" }
			}
		},
		{
			auth: true,
			body: uploadProductFileModel.body,
			response: {
				200: uploadProductFileModel.response,
				400: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.get(
		"/list",
		async ({ query }) => {
			const { page, limit, search } = query
			const offset = (page - 1) * limit

			const { rows, total } = await getProducts(offset, limit, search)

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
			}
		},
		{
			query: getProductsModel.query,
			response: {
				200: getProductsModel.response,
				400: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.get(
		"/:id",
		async ({ params, set }) => {
			const { id } = params

			const product = await getProductById(id)

			if (!product) {
				set.status = 404
				return {
					code: 404,
					message: "Not Found",
				}
			}

			return {
				...product,
				price: product.price ?? undefined,
			}
		},
		{
			params: getProductByIdModel.query,
			response: {
				200: getProductByIdModel.response,
				400: ErrorModel,
				404: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.post(
		"/create",
		async ({ body, set, user }) => {
			const result = await createProduct(body, user.id)

			if (result.status !== 200) {
				set.status = result.status
				return {
					code: result.status,
					message: result.message || "An error occurred",
				}
			}

			return { message: "Success" }
		},
		{
			auth: true,
			body: createProductModel.body,
			response: {
				200: createProductModel.response,
				400: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.put(
		"/:id",
		async ({ params, body, set, user }) => {
			const { id } = params
			const result = await updateProduct(id, body, user.id)

			if (result.status !== 200) {
				set.status = result.status
				return {
					code: result.status,
					message: result.message || "An error occurred",
				}
			}

			return { message: "Success" }
		},
		{
			auth: true,
			params: getProductByIdModel.query,
			body: updateProductModel.body,
			response: {
				200: updateProductModel.response,
				400: ErrorModel,
				404: ErrorModel,
				500: ErrorModel,
			},
		},
	)
	.delete(
		"/:id",
		async ({ params, set }) => {
			const { id } = params
			const result = await deleteProduct(id)

			if (result.status !== 200) {
				set.status = result.status
				return {
					code: result.status,
					message: result.message || "An error occurred",
				}
			}

			return { message: "Success" }
		},
		{
			params: deleteProductModel.body,
			response: {
				200: deleteProductModel.response,
				400: ErrorModel,
				404: ErrorModel,
				500: ErrorModel,
			},
		},
	)
