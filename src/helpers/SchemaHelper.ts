import { ZodObject, ZodType } from "zod";

export class SchemaHelper {
    private schema: ZodObject<any, any>;

    constructor(schema: ZodObject<any, any>) {
        this.schema = schema;
    }

    private deepPick(schema: ZodObject<any, any>, propertyPath: string): any {
        const properties = propertyPath.split('.');
      
        if (properties.length === 0) {
          return schema;
        }
      
        const currentProperty = properties[0];
        if (properties.length === 1) {
          return schema.pick({ [currentProperty]: true });
        }
      
        const nextPropertyPath = properties.slice(1, properties.length).join('.');
        const nextSchema = schema.shape[currentProperty];
        if (!nextSchema) return schema;
      
        return this.deepPick(nextSchema, nextPropertyPath);
    }

    isValidSchema(data: any, field?: string, value?: any): any {
        try {
            if (field) {
                if (field.includes(".")) {
                    const lastField = field.split(".").at(-1) ?? ""
                    this.deepPick(this.schema, field).parse({ [lastField]: value ?? data[lastField] });
                } else this.deepPick(this.schema, field).parse({ [field]: value ?? data[field] });
            }
            else this.schema.parse(data);
            return true;
        } catch (error) {
            return false;
        }
    };
}