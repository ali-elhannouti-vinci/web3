//builder.ts
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaTypes from '@pothos/plugin-prisma/generated';
import { DateResolver } from 'graphql-scalars'; // N'oubliez pas l'import
import { PrismaClient, Prisma } from "../../generated/prisma";

const prisma = new PrismaClient();

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  // 2. Déclarer le type ici pour que TypeScript le reconnaisse
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    dmmf: Prisma.dmmf,
  },
  
});

// 2. L'implémentation du Scalaire (INDISPENSABLE)
// Sans cette ligne, TypeScript est content, mais votre API plantera au démarrage.
builder.addScalarType('Date', DateResolver, {});

export default builder;