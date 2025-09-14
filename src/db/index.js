"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("../generated/prisma");
var prisma;
if (process.env.NODE_ENV === 'production') {
    prisma = new prisma_1.PrismaClient();
}
else {
    if (!global.__prisma) {
        global.__prisma = new prisma_1.PrismaClient();
    }
    prisma = global.__prisma;
}
exports.default = prisma;
