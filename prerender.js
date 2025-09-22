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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var _this = this;
var fs = require('fs');
var path = require('path');
var _a = process.argv.slice(2), indexFile = _a[0], serverBundlePath = _a[1], browserOutputPath = _a[2], routes = _a.slice(3);
/**
 * Handles importing the server bundle.
 */
function getServerBundle(bundlePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, AppServerModule, AppServerModuleNgFactory, renderModule, renderModuleFactory;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require(bundlePath); })];
                case 1:
                    _a = _b.sent(), AppServerModule = _a.AppServerModule, AppServerModuleNgFactory = _a.AppServerModuleNgFactory, renderModule = _a.renderModule, renderModuleFactory = _a.renderModuleFactory;
                    if (renderModuleFactory && AppServerModuleNgFactory) {
                        // Happens when in ViewEngine mode.
                        return [2 /*return*/, {
                                renderModuleFn: renderModuleFactory,
                                AppServerModuleDef: AppServerModuleNgFactory
                            }];
                    }
                    if (renderModule && AppServerModule) {
                        // Happens when in Ivy mode.
                        return [2 /*return*/, {
                                renderModuleFn: renderModule,
                                AppServerModuleDef: AppServerModule
                            }];
                    }
                    throw new Error("renderModule method and/or AppServerModule were not exported from: " + serverBundlePath + ".");
            }
        });
    });
}
/**
 * Renders each route in routes and writes them to <outputPath>/<route>/index.html.
 */
(function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, renderModuleFn, AppServerModuleDef, browserIndexOutputPath, indexHtml, _i, routes_1, route, renderOpts, html, outputFolderPath, outputIndexPath, browserIndexOutputPathOriginal, bytes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getServerBundle(serverBundlePath)];
            case 1:
                _a = _b.sent(), renderModuleFn = _a.renderModuleFn, AppServerModuleDef = _a.AppServerModuleDef;
                browserIndexOutputPath = path.join(browserOutputPath, indexFile);
                indexHtml = fs.readFileSync(browserIndexOutputPath, 'utf8');
                _i = 0, routes_1 = routes;
                _b.label = 2;
            case 2:
                if (!(_i < routes_1.length)) return [3 /*break*/, 5];
                route = routes_1[_i];
                renderOpts = {
                    document: indexHtml + '<!-- This page was prerendered with Angular Universal -->',
                    url: route
                };
                return [4 /*yield*/, renderModuleFn(AppServerModuleDef, renderOpts)];
            case 3:
                html = _b.sent();
                outputFolderPath = path.join(browserOutputPath, route);
                outputIndexPath = path.join(outputFolderPath, 'index.html');
                // This case happens when we are prerendering "/".
                if (browserIndexOutputPath === outputIndexPath) {
                    browserIndexOutputPathOriginal = path.join(browserOutputPath, 'index.original.html');
                    fs.writeFileSync(browserIndexOutputPathOriginal, indexHtml);
                }
                try {
                    fs.mkdirSync(outputFolderPath, { recursive: true });
                    fs.writeFileSync(outputIndexPath, html);
                    bytes = Buffer.byteLength(html).toFixed(0);
                    if (process.send) {
                        process.send({ success: true, outputIndexPath: outputIndexPath, bytes: bytes });
                    }
                }
                catch (e) {
                    if (process.send) {
                        process.send({ success: false, error: e.message, outputIndexPath: outputIndexPath });
                    }
                }
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); })().then()["catch"]();
