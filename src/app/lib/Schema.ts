import Ajv from "ajv";
import { merge } from "lodash";
import * as C from "./constants";

type ValidationResult = {
  data?: any;
  errors?: any;
};

/**
 * JSONSchema-based schema class. For use in processing request bodies (among
 * other things).
 */
export default class Schema {
  protected static readonly ajv = new Ajv();
  readonly jsonSchema: any;

  constructor(jsonSchema: any, definitions: any | null = null) {
    this.jsonSchema = jsonSchema;

    if (definitions !== null) {
      Schema.ajv.addSchema(definitions);
    }

    if (jsonSchema.$id) {
      Schema.ajv.addSchema(jsonSchema);
    }
  }

  static buildSchemaIdUrl(schemaName: string): string {
    return `http://${C.PROJECT_DOMAIN.trimEnd("/")}/schemas/${schemaName}.json`;
  }

  static fromJsonSchema(jsonSchema: any): Schema {
    return new Schema(jsonSchema);
  }

  validate(data: any): ValidationResult {
    const validate = Schema.ajv.compile(this.jsonSchema);
    const valid = validate(data);
    if (!valid) {
      return { data, errors: validate.errors };
    }
    return { data, errors: null };
  }

  extend(jsonSchema: any): Schema {
    return Schema.fromJsonSchema(merge(this.jsonSchema, jsonSchema));
  }
}
