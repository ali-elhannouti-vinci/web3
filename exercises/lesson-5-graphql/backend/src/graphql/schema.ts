//schema.ts
import builder from "./builder";
import augmentExpenseSchema from "../api/expense/augmentGraphqlSchema";
import augmentUserSchema from "../api/user/augmentGraphqlSchema";

// 2. INITIALISATION DES RACINES
// Tu dois dire à Pothos "La Query et la Mutation existent", même si elles sont vides ici.
builder.queryType({});
builder.mutationType({});

augmentExpenseSchema(builder);
augmentUserSchema(builder);

const schema = builder.toSchema();
export default schema;
