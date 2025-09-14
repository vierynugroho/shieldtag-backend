"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var password_1 = require("./../../src/utils/password");
var db_1 = require("../../src/db");
var fs_1 = require("fs");
var path_1 = require("path");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var rolesPath, rolesData, permissionSet, _i, _a, role, _b, _c, perm, perms, _d, perms_1, p, _e, _f, role, dbRole, _g, _h, permName, perm, superRole, user, _j, _k;
        var _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    rolesPath = path_1.default.resolve(__dirname, '../../src/config/roles.json');
                    rolesData = JSON.parse(fs_1.default.readFileSync(rolesPath, 'utf-8'));
                    permissionSet = new Set();
                    for (_i = 0, _a = rolesData.roles; _i < _a.length; _i++) {
                        role = _a[_i];
                        for (_b = 0, _c = role.permissions; _b < _c.length; _b++) {
                            perm = _c[_b];
                            permissionSet.add(perm);
                        }
                    }
                    perms = Array.from(permissionSet).map(function (name) { return ({
                        name: name,
                        description: name.replace(/:/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }),
                    }); });
                    _d = 0, perms_1 = perms;
                    _o.label = 1;
                case 1:
                    if (!(_d < perms_1.length)) return [3 /*break*/, 4];
                    p = perms_1[_d];
                    return [4 /*yield*/, db_1.default.permission.upsert({
                            where: { name: p.name },
                            update: {},
                            create: p,
                        })];
                case 2:
                    _o.sent();
                    _o.label = 3;
                case 3:
                    _d++;
                    return [3 /*break*/, 1];
                case 4:
                    _e = 0, _f = rolesData.roles;
                    _o.label = 5;
                case 5:
                    if (!(_e < _f.length)) return [3 /*break*/, 12];
                    role = _f[_e];
                    return [4 /*yield*/, db_1.default.role.upsert({
                            where: { name: role.name },
                            update: {},
                            create: {
                                name: role.name,
                                description: "".concat(role.name.charAt(0).toUpperCase() + role.name.slice(1), " role"),
                            },
                        })];
                case 6:
                    dbRole = _o.sent();
                    _g = 0, _h = role.permissions;
                    _o.label = 7;
                case 7:
                    if (!(_g < _h.length)) return [3 /*break*/, 11];
                    permName = _h[_g];
                    return [4 /*yield*/, db_1.default.permission.findUnique({ where: { name: permName } })];
                case 8:
                    perm = _o.sent();
                    if (!perm) return [3 /*break*/, 10];
                    return [4 /*yield*/, db_1.default.rolePermission.upsert({
                            where: { roleId_permissionId: { roleId: dbRole.id, permissionId: perm.id } },
                            update: {},
                            create: { roleId: dbRole.id, permissionId: perm.id },
                        })];
                case 9:
                    _o.sent();
                    _o.label = 10;
                case 10:
                    _g++;
                    return [3 /*break*/, 7];
                case 11:
                    _e++;
                    return [3 /*break*/, 5];
                case 12: return [4 /*yield*/, db_1.default.role.findUnique({ where: { name: 'superadmin' } })];
                case 13:
                    superRole = _o.sent();
                    if (!superRole) return [3 /*break*/, 17];
                    _k = (_j = db_1.default.user).upsert;
                    _l = {
                        where: { email: 'superadmin@mail.com' },
                        update: {}
                    };
                    _m = {
                        email: 'superadmin@main.com'
                    };
                    return [4 /*yield*/, password_1.PasswordUtils.hash('password')];
                case 14: return [4 /*yield*/, _k.apply(_j, [(_l.create = (_m.password = _o.sent(),
                            _m.name = 'Super Admin',
                            _m),
                            _l)])];
                case 15:
                    user = _o.sent();
                    return [4 /*yield*/, db_1.default.userRole.upsert({
                            where: { userId_roleId: { userId: user.id, roleId: superRole.id } },
                            update: {},
                            create: { userId: user.id, roleId: superRole.id },
                        })];
                case 16:
                    _o.sent();
                    _o.label = 17;
                case 17:
                    console.log('Seed selesai');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return db_1.default.$disconnect(); });
