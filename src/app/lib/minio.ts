import * as Minio from "minio";

export type MakeBucketArgs = {
  usePublicAccessPolicy?: boolean | null | undefined;
  region?: string | null | undefined;
};

/**
 * Return s3 access policy string that allows public reads.
 */
const publicAccessPolicy = (bucketName: string) => `
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:GetBucketLocation",
        "s3:ListBucket"
      ],
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "*"
        ]
      },
      "Resource": [
        "arn:aws:s3:::${bucketName}"
      ],
      "Sid": ""
    },
    {
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "*"
        ]
      },
      "Resource": [
        "arn:aws:s3:::${bucketName}/*"
      ],
      "Sid": ""
    }
  ]
}`;

/**
 * Helper class for interfacing with Minio.
 */
export class MinioHelper {
  private readonly defaultRegion: string;
  private readonly client: Minio.Client;

  constructor(defaultRegion: string | null = null) {
    this.defaultRegion = defaultRegion || process.env.MINIO_SITE_REGION!;
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_HOST!,
      port: parseInt(process.env.MINIO_PORT!),
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
      useSSL: false,
    });
  }

  async setPublicReadAccessPolicy(bucketName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.setBucketPolicy(
        bucketName,
        publicAccessPolicy(bucketName),
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });
  }

  async makeBucket(
    bucketName: string,
    args: MakeBucketArgs = {
      usePublicAccessPolicy: true,
      region: null,
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.bucketExists(bucketName, (err, exists) => {
        if (!exists) {
          const region = args.region || this.defaultRegion;
          this.client.makeBucket(bucketName, region, (err) => {
            if (err) {
              return reject(err);
            } else {
              // set access policy
              if (args.usePublicAccessPolicy) {
                this.setPublicReadAccessPolicy(bucketName).then(() =>
                  resolve()
                );
              } else {
                resolve();
              }
            }
          });
        } else if (err) {
          return reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async putObject(
    bucket: string,
    name: string,
    data: string | Buffer,
    metadata: any = {}
  ): Promise<Minio.UploadedObjectInfo> {
    // set default content-type
    return new Promise((resolve, reject) => {
      this.client.putObject(
        bucket,
        name,
        data,
        metadata,
        (err: Error | null, objInfo: Minio.UploadedObjectInfo) => {
          if (err) {
            return reject(err);
          } else {
            resolve(objInfo);
          }
        }
      );
    });
  }
  async putPng(
    bucket: string,
    name: string,
    data: string | Buffer,
    metadata: any = {
      "Content-Type": "image/png",
    }
  ): Promise<{ name: string; info: Minio.UploadedObjectInfo }> {
    if (!name.match(/.+\.png/i)) {
      name += ".png";
    }
    const info = await this.putObject(bucket, name, data, metadata);
    return { name, info };
  }
}

// global singleton
export default new MinioHelper();
