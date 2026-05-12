import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let cachedClient: S3Client | null = null;

const getS3Client = () => {
  const accountId = process.env.R2_ACCOUNT_ID;
  if (!accountId) throw new Error("R2_ACCOUNT_ID is required");

  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY are required");
  }

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cachedClient;
};

export const uploadToS3 = async (data: { file: File; fileKey: string }) => {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) {
    throw new Error("R2_BUCKET is required");
  }

  const client = getS3Client();
  const body = Buffer.from(await data.file.arrayBuffer());
  const contentType = data.file.type || "application/octet-stream";

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: data.fileKey,
      Body: body,
      ContentType: contentType,
    }),
  );
};

export const getPresignedUrl = async (fileKey: string) => {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) throw new Error("R2_BUCKET is required");

  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: fileKey,
  });

  return getSignedUrl(client, command, { expiresIn: 3600 });
};
