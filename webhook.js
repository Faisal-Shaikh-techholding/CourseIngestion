/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 31:
/***/ ((module) => {

"use strict";
module.exports = require("sequelize");

/***/ }),

/***/ 85:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const paymentMethod_1 = __importDefault(__webpack_require__(955));
const transaction_1 = __importDefault(__webpack_require__(264));
const userGroupMember_1 = __importDefault(__webpack_require__(604));
const userPaymentConfig_1 = __importDefault(__webpack_require__(221));
const programUserMember_1 = __importDefault(__webpack_require__(833));
const userGroup_1 = __importDefault(__webpack_require__(422));
const program_1 = __importDefault(__webpack_require__(968));
const account_1 = __importDefault(__webpack_require__(483));
class User extends sequelize_1.Model {
}
User.init({
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    securityQuestion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    mobileNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'User',
    tableName: 'user',
    timestamps: true
});
transaction_1.default.belongsTo(User, { foreignKey: 'userID', as: 'user' });
transaction_1.default.belongsTo(User, { foreignKey: 'paidBy', as: 'payer' });
User.hasMany(paymentMethod_1.default, { foreignKey: 'userID', onDelete: 'CASCADE' });
User.hasMany(userPaymentConfig_1.default, { foreignKey: 'userID', onDelete: 'CASCADE' });
User.hasMany(userGroupMember_1.default, { foreignKey: 'userID', as: 'userGroupMembers' });
User.belongsToMany(userGroup_1.default, { through: userGroupMember_1.default, foreignKey: 'userID', otherKey: 'userGroupID', as: 'userGroups' });
User.belongsToMany(program_1.default, { through: programUserMember_1.default, foreignKey: 'userID', otherKey: 'programID', as: 'programs' });
User.hasOne(account_1.default, { foreignKey: 'userID' });
exports["default"] = User;


/***/ }),

/***/ 95:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getInvoiceRemainingPayableAmount = exports.invoiceStatuses = void 0;
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const invoiceItem_1 = __importDefault(__webpack_require__(940));
const invoiceTransaction_1 = __importDefault(__webpack_require__(451));
const paymentSchedule_1 = __importDefault(__webpack_require__(755));
const school_1 = __importDefault(__webpack_require__(906));
const transaction_1 = __importDefault(__webpack_require__(264));
const user_1 = __importDefault(__webpack_require__(85));
const invoiceFee_1 = __importDefault(__webpack_require__(111));
const cortexExternalUserProgramEnrollment_1 = __importDefault(__webpack_require__(415));
const program_1 = __importDefault(__webpack_require__(968));
class Invoice extends sequelize_1.Model {
}
exports.invoiceStatuses = ['PENDING', 'PAID', 'FAILED', 'DUE', 'REFUNDED', 'PAST_DUE', 'PARTIALLY_PAID'];
Invoice.init({
    invoiceID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    schoolID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    programID: {
        type: sequelize_1.DataTypes.INTEGER
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: exports.invoiceStatuses,
        allowNull: false,
        defaultValue: 'PENDING'
    },
    dueDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    isProcessing: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    isCustom: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    studentExternalProgramEnrolmentID: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Invoice',
    tableName: 'invoice',
    timestamps: true
});
Invoice.belongsToMany(paymentSchedule_1.default, {
    through: invoiceItem_1.default,
    foreignKey: 'invoiceID',
    otherKey: 'paymentScheduleID'
});
paymentSchedule_1.default.belongsToMany(Invoice, {
    through: invoiceItem_1.default,
    foreignKey: 'paymentScheduleID',
    otherKey: 'invoiceID'
});
Invoice.belongsTo(school_1.default, {
    foreignKey: 'schoolID',
    onDelete: 'CASCADE'
});
Invoice.belongsToMany(transaction_1.default, {
    through: invoiceTransaction_1.default,
    as: 'Transaction',
    foreignKey: 'invoiceID',
    otherKey: 'transactionID'
});
transaction_1.default.belongsToMany(Invoice, {
    through: invoiceTransaction_1.default,
    foreignKey: 'transactionID',
    otherKey: 'invoiceID'
});
Invoice.belongsTo(user_1.default, { foreignKey: 'userID', as: 'user' });
user_1.default.hasMany(Invoice, { foreignKey: 'userID', onDelete: 'CASCADE' });
Invoice.hasMany(invoiceFee_1.default, { foreignKey: 'invoiceID' });
Invoice.hasMany(invoiceItem_1.default, { foreignKey: 'invoiceID' });
invoiceTransaction_1.default.belongsTo(Invoice, { foreignKey: 'invoiceID' });
Invoice.belongsTo(cortexExternalUserProgramEnrollment_1.default, { foreignKey: 'studentExternalProgramEnrolmentID' });
Invoice.belongsTo(program_1.default, { foreignKey: 'programID' });
exports["default"] = Invoice;
const getInvoiceRemainingPayableAmount = async (invoiceIDs) => {
    const invoiceData = await Invoice.findAll({
        where: { invoiceID: invoiceIDs },
        attributes: [
            'invoiceID',
            [
                sequelize_1.Sequelize.literal('SUM(`PaymentSchedules`.`totalAmount` + `PaymentSchedules`.`invoiceFee` - `PaymentSchedules`.`paidAmount`)'),
                'remainingAmountToBePaid'
            ]
        ],
        include: [{
                model: paymentSchedule_1.default,
                attributes: [],
                as: 'PaymentSchedules',
                through: { attributes: [] }
            }],
        order: [
            ['dueDate', 'ASC'],
            [sequelize_1.Sequelize.literal('`PaymentSchedules`.`isInstallment`'), 'ASC']
        ],
        group: ['Invoice.invoiceID']
    });
    return invoiceData;
};
exports.getInvoiceRemainingPayableAmount = getInvoiceRemainingPayableAmount;


/***/ }),

/***/ 99:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.handler = void 0;
const sqs_1 = __importDefault(__webpack_require__(752));
const logger_js_1 = __webpack_require__(187);
const app_js_1 = __webpack_require__(901);
const handler = async ({ Records }) => {
    const { TRANSACTION_WEBHOOK_HANDLER_QUEUE_URL = '' } = process.env;
    for (const record of Records) {
        try {
            await (0, app_js_1.processMessage)(record);
            await sqs_1.default.deleteMessage(TRANSACTION_WEBHOOK_HANDLER_QUEUE_URL, record.receiptHandle);
        }
        catch (e) {
            logger_js_1.logger.error(e);
            throw e;
        }
    }
};
exports.handler = handler;


/***/ }),

/***/ 111:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.invoiceFeeStatuses = void 0;
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const transaction_1 = __importDefault(__webpack_require__(264));
class InvoiceFee extends sequelize_1.Model {
}
exports.invoiceFeeStatuses = ['LATE', 'DECLINED', 'CANCELLED', 'NSF'];
InvoiceFee.init({
    invoiceFeeID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    invoiceID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2),
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM,
        values: exports.invoiceFeeStatuses
    },
    transactionID: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'InvoiceFee',
    tableName: 'invoiceFee',
    timestamps: false
});
InvoiceFee.removeAttribute('id');
InvoiceFee.belongsTo(transaction_1.default, { foreignKey: 'transactionID' });
exports["default"] = InvoiceFee;


/***/ }),

/***/ 115:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const paymentGateway_1 = __importDefault(__webpack_require__(842));
const cardknox_1 = __importDefault(__webpack_require__(985));
const errors_1 = __webpack_require__(238);
class PaymentService {
    gateway;
    async initialize() {
        const { PAYMENT_GATEWAY_API_KEY: paymentGatewayApiKey = '' } = process.env;
        const paymentGateway = await paymentGateway_1.default.findOne({ where: { isActive: true } });
        if (paymentGateway === null || paymentGateway === undefined) {
            throw new errors_1.PaymentGatewayError('Active payment gateway not found');
        }
        const gatewayName = paymentGateway.dataValues.name.toLowerCase();
        switch (gatewayName) {
            case 'cardknox':
                this.gateway = new cardknox_1.default(paymentGatewayApiKey);
                break;
            default:
                throw new errors_1.PaymentGatewayError(`Unsupported payment gateway: ${gatewayName}`);
        }
    }
    async createCustomer(customerDetails) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.createCustomer(customerDetails);
    }
    async createPaymentMethod(paymentMethodDetails) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.createPaymentMethod(paymentMethodDetails);
    }
    async getPaymentMethod(getPaymentMethodParams) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.getPaymentMethod(getPaymentMethodParams);
    }
    async updatePaymentMethod(updatePaymentMethodParams) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        await this.gateway.updatePaymentMethod(updatePaymentMethodParams);
    }
    async deletePaymentMethod(deletePaymentMethodParams) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        await this.gateway.deletePaymentMethod(deletePaymentMethodParams);
    }
    async charge(chargeDetails) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        await this.gateway.charge(chargeDetails);
    }
    async sale(saleDetails) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.sale(saleDetails);
    }
    async void(voidDetails) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.void(voidDetails);
    }
    async capture(captureDetails) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.capture(captureDetails);
    }
    async refund(transactionDetails) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.refund(transactionDetails);
    }
    async getTierNames(apiKey) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.getTierNames(apiKey);
    }
    async submitGoApp(submitGoAppData) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.submitGoApp(submitGoAppData);
    }
    async attachWebhook(apiKey, webhookData) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.attachWebhook(apiKey, webhookData);
    }
    async fetchTransactionReport(params) {
        if (this.gateway == null || this.gateway === undefined) {
            throw new errors_1.PaymentGatewayError('Payment gateway not initialized');
        }
        return await this.gateway.fetchTransactionReport(params);
    }
}
exports["default"] = PaymentService;


/***/ }),

/***/ 187:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logger = void 0;
const pino_1 = __webpack_require__(552);
const { LOG_LEVEL = 'info', NODE_ENV } = process.env;
const opts = {
    level: NODE_ENV === 'test' ? 'silent' : LOG_LEVEL
};
exports.logger = (0, pino_1.pino)(opts);


/***/ }),

/***/ 191:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const db_config_1 = __importDefault(__webpack_require__(479));
const logger_1 = __webpack_require__(187);
const sequelize = new sequelize_1.Sequelize({
    ...db_config_1.default["production" ?? 0],
    logging: "production" !== 'test',
    benchmark: true,
    pool: {
        max: 15,
        min: 1
    }
});
async function testConnection() {
    try {
        await sequelize.authenticate();
        logger_1.logger.info({ msg: 'Connected to MySQL' });
    }
    catch (error) {
        logger_1.logger.error({ msg: 'Unable to connect to MySQL', error });
    }
}
void (async () => {
    await testConnection();
})();
exports["default"] = sequelize;


/***/ }),

/***/ 221:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const paymentGateway_1 = __importDefault(__webpack_require__(842));
class UserPaymentConfig extends sequelize_1.Model {
}
UserPaymentConfig.init({
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    customerID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    paymentGatewayID: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'UserPaymentConfig',
    tableName: 'userPaymentConfig',
    timestamps: true
});
UserPaymentConfig.removeAttribute('id');
UserPaymentConfig.belongsTo(paymentGateway_1.default, { foreignKey: 'paymentGatewayID' });
exports["default"] = UserPaymentConfig;


/***/ }),

/***/ 238:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InternalError = exports.InvalidPermissionsError = exports.PaymentGatewayError = exports.ResourcesNotFoundError = exports.ConstraintViolationError = exports.InvalidParametersError = exports.MissingParametersError = exports.ValidationErrors = exports.BaseError = void 0;
class BaseError extends Error {
    code;
    statusCode;
    shortname;
    description;
    fields;
}
exports.BaseError = BaseError;
class ValidationErrors extends BaseError {
    errors;
    constructor(errors) {
        super();
        this.message = 'Validation failed: One or more fields are not valid.';
        this.errors = errors;
        this.statusCode = 400;
    }
}
exports.ValidationErrors = ValidationErrors;
class MissingParametersError extends BaseError {
    constructor(fields) {
        super();
        this.code = 4001;
        this.statusCode = 400;
        this.shortname = 'MissingParameters';
        this.description = 'Required parameters are missing';
        this.fields = fields.flatMap(field => Array.isArray(field) ? [field.join('.')] : [field]);
    }
}
exports.MissingParametersError = MissingParametersError;
class InvalidParametersError extends BaseError {
    constructor(fields) {
        super();
        this.code = 4002;
        this.statusCode = 400;
        this.shortname = 'InvalidParameters';
        this.description = 'Parameters values are invalid';
        this.fields = fields;
    }
}
exports.InvalidParametersError = InvalidParametersError;
class ConstraintViolationError extends BaseError {
    constructor(fields, message) {
        super();
        this.code = 4003;
        this.statusCode = 400;
        this.shortname = 'ConstraintViolation';
        this.message = message ?? 'A constraint violation';
        this.fields = fields;
    }
}
exports.ConstraintViolationError = ConstraintViolationError;
class ResourcesNotFoundError extends BaseError {
    constructor(fields) {
        super();
        this.code = 4041;
        this.statusCode = 404;
        this.shortname = 'ResourceNotFound';
        this.message = 'Resource doesn\'t exist';
        this.fields = fields;
    }
}
exports.ResourcesNotFoundError = ResourcesNotFoundError;
class PaymentGatewayError extends BaseError {
    errors;
    constructor(message, errors, statusCode = 400, errorCode = 4004) {
        super();
        this.code = errorCode;
        this.statusCode = statusCode;
        this.shortname = 'PaymentGatewayError';
        this.message = message;
        this.errors = errors;
    }
}
exports.PaymentGatewayError = PaymentGatewayError;
class InvalidPermissionsError extends BaseError {
    constructor(options) {
        super();
        this.code = options.code ?? 4011;
        this.statusCode = options.status ?? 401;
        this.shortname = 'InvalidPermissions';
        this.message = options.description ?? 'Invalid permissions';
    }
}
exports.InvalidPermissionsError = InvalidPermissionsError;
class InternalError extends BaseError {
    constructor(message) {
        super();
        this.code = 5001;
        this.statusCode = 500;
        this.shortname = 'Internal';
        this.message = message ?? 'A server error occurred';
    }
}
exports.InternalError = InternalError;


/***/ }),

/***/ 264:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.offlinePaymentTypes = exports.transactionStatuses = exports.transactionTypes = void 0;
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const program_1 = __importDefault(__webpack_require__(968));
class Transaction extends sequelize_1.Model {
}
exports.transactionTypes = ['charge', 'refund', 'cash', 'auth', 'capture', 'void', 'cheque', 'other'];
exports.transactionStatuses = ['PAID', 'FAILED', 'REFUNDED', 'DECLINED', 'PROCESSING', 'VOIDED'];
exports.offlinePaymentTypes = ['cash', 'cheque', 'other'];
Transaction.init({
    transactionID: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    parentTransactionID: {
        type: sequelize_1.DataTypes.UUID
    },
    schoolID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    programID: {
        type: sequelize_1.DataTypes.INTEGER
    },
    transactionMappingID: {
        type: sequelize_1.DataTypes.STRING
    },
    type: {
        type: sequelize_1.DataTypes.ENUM,
        values: exports.transactionTypes,
        allowNull: false
    },
    totalAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2),
        allowNull: false
    },
    paymentDate: {
        type: sequelize_1.DataTypes.DATE
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(3),
        defaultValue: 'USD'
    },
    isAutoPaid: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: exports.transactionStatuses,
        allowNull: false
    },
    transactionDetail: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    },
    feeAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2)
    },
    feePercentage: {
        type: sequelize_1.DataTypes.FLOAT(5, 2)
    },
    reference: {
        type: sequelize_1.DataTypes.STRING
    },
    paidBy: {
        type: sequelize_1.DataTypes.INTEGER
    },
    finalStatus: {
        type: sequelize_1.DataTypes.INTEGER
    },
    amountReceivedByMerchant: {
        type: sequelize_1.DataTypes.FLOAT(8, 2)
    },
    studentExternalProgramEnrolmentID: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Transaction',
    tableName: 'paymentTransaction',
    timestamps: true
});
Transaction.belongsTo(program_1.default, { foreignKey: 'programID' });
Transaction.belongsTo(Transaction, { foreignKey: 'parentTransactionID', as: 'parentTransaction' });
exports["default"] = Transaction;


/***/ }),

/***/ 320:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sortPaymentSchedules = void 0;
const sortPaymentSchedules = (paymentSchedules, paymentScheduleID) => {
    const index = paymentSchedules.findIndex((schedule) => schedule.dataValues.paymentScheduleID === paymentScheduleID);
    const paymentSchedulesBefore = paymentSchedules.slice(0, index);
    paymentSchedules = paymentSchedules.slice(index);
    return paymentSchedules.concat(paymentSchedulesBefore);
};
exports.sortPaymentSchedules = sortPaymentSchedules;


/***/ }),

/***/ 324:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
class SchoolPaymentConfig extends sequelize_1.Model {
    getProcessingFee(amount, paymentType = 'cc') {
        let feePercentage = 0;
        if (paymentType.toLowerCase() === 'cc') {
            feePercentage = this.dataValues.ccFee;
        }
        else if (paymentType.toLowerCase() === 'check') {
            feePercentage = this.dataValues.achFee;
        }
        const feeAmount = [0, null].includes(feePercentage) ? 0 : Number(((amount * feePercentage) / 100).toFixed(2));
        return { feePercentage: feeAmount === 0 ? 0 : feePercentage, feeAmount };
    }
}
SchoolPaymentConfig.init({
    schoolID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    basePaymentUrl: {
        type: sequelize_1.DataTypes.STRING
    },
    apiKey: {
        type: sequelize_1.DataTypes.STRING
    },
    merchantRefNum: {
        type: sequelize_1.DataTypes.STRING
    },
    appID: {
        type: sequelize_1.DataTypes.STRING
    },
    streetAddress: {
        type: sequelize_1.DataTypes.STRING
    },
    city: {
        type: sequelize_1.DataTypes.STRING
    },
    state: {
        type: sequelize_1.DataTypes.STRING
    },
    zip: {
        type: sequelize_1.DataTypes.STRING
    },
    country: {
        type: sequelize_1.DataTypes.STRING
    },
    contactEmail: {
        type: sequelize_1.DataTypes.STRING
    },
    studentContactEmail: {
        type: sequelize_1.DataTypes.STRING
    },
    contactPhone: {
        type: sequelize_1.DataTypes.STRING
    },
    status: {
        type: sequelize_1.DataTypes.STRING
    },
    merchantData: {
        type: sequelize_1.DataTypes.JSON
    },
    allowedMissedPayment: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED
    },
    gracePeriod: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED
    },
    upcomingPaymentGracePeriod: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED
    },
    isPaymentLinkActive: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    achFee: {
        type: sequelize_1.DataTypes.FLOAT(5, 2)
    },
    ccFee: {
        type: sequelize_1.DataTypes.FLOAT(5, 2)
    },
    enableNonSufficientFundFee: {
        type: sequelize_1.DataTypes.TINYINT
    },
    nonSufficientFundFee: {
        type: sequelize_1.DataTypes.FLOAT(5, 2)
    },
    enableCancellationFee: {
        type: sequelize_1.DataTypes.TINYINT
    },
    cancellationFee: {
        type: sequelize_1.DataTypes.FLOAT(5, 2)
    },
    enableDeclinedTransactionFee: {
        type: sequelize_1.DataTypes.TINYINT
    },
    declinedTransactionFee: {
        type: sequelize_1.DataTypes.FLOAT(5, 2)
    },
    enableAutoCancelPaymentOnWithdrawal: {
        type: sequelize_1.DataTypes.TINYINT
    },
    enableOverPayment: {
        type: sequelize_1.DataTypes.TINYINT
    },
    overPaymentAllocation: {
        type: sequelize_1.DataTypes.ENUM('NEXT', 'LAST')
    },
    enableTaxRate: {
        type: sequelize_1.DataTypes.TINYINT
    },
    taxRate: {
        type: sequelize_1.DataTypes.FLOAT(4, 2)
    },
    enablePartialPayment: {
        type: sequelize_1.DataTypes.TINYINT
    },
    enableMinPartialPayment: {
        type: sequelize_1.DataTypes.TINYINT
    },
    minPartialPaymentRequired: {
        type: sequelize_1.DataTypes.FLOAT(5, 2)
    },
    enableLateFee: {
        type: sequelize_1.DataTypes.TINYINT
    },
    lateFee: {
        type: sequelize_1.DataTypes.FLOAT(5, 2)
    },
    requireSequentialPayment: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    sequentialPaymentOrder: {
        type: sequelize_1.DataTypes.JSON
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'SchoolPaymentConfig',
    tableName: 'schoolPaymentConfig',
    timestamps: false
});
SchoolPaymentConfig.removeAttribute('id');
exports["default"] = SchoolPaymentConfig;


/***/ }),

/***/ 330:
/***/ ((module) => {

"use strict";
module.exports = require("@aws-sdk/client-sqs");

/***/ }),

/***/ 376:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paymentLinkTransactionStatuses = void 0;
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const school_1 = __importDefault(__webpack_require__(906));
const user_1 = __importDefault(__webpack_require__(85));
class PaymentLinkTransaction extends sequelize_1.Model {
}
exports.paymentLinkTransactionStatuses = ['PAID', 'FAILED', 'REFUNDED', 'DECLINED', 'PENDING'];
PaymentLinkTransaction.init({
    paymentLinkTransactionID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    schoolID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(60)
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(60)
    },
    email: {
        type: sequelize_1.DataTypes.STRING
    },
    additionalEmail: {
        type: sequelize_1.DataTypes.STRING
    },
    transactionMappingID: {
        type: sequelize_1.DataTypes.STRING
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('charge', 'refund', 'cash', 'auth', 'capture', 'void'),
        allowNull: false
    },
    totalAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2),
        defaultValue: 0
    },
    paymentDate: {
        type: sequelize_1.DataTypes.DATE
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(3),
        defaultValue: 'USD'
    },
    transactionDetail: {
        type: sequelize_1.DataTypes.JSON
    },
    feeAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2)
    },
    feePercentage: {
        type: sequelize_1.DataTypes.FLOAT(5, 2)
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: exports.paymentLinkTransactionStatuses,
        allowNull: false,
        defaultValue: 'PENDING'
    },
    parentPaymentLinkTransactionID: {
        type: sequelize_1.DataTypes.INTEGER
    },
    paidBy: {
        type: sequelize_1.DataTypes.INTEGER
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'PaymentLinkTransaction',
    tableName: 'paymentLinkTransaction',
    timestamps: true
});
PaymentLinkTransaction.belongsTo(PaymentLinkTransaction, { as: 'parentPaymentLinkTransaction', foreignKey: 'parentPaymentLinkTransactionID' });
PaymentLinkTransaction.belongsTo(school_1.default, {
    foreignKey: 'schoolID',
    onDelete: 'CASCADE'
});
PaymentLinkTransaction.belongsTo(user_1.default, { foreignKey: 'paidBy', as: 'payer' });
exports["default"] = PaymentLinkTransaction;


/***/ }),

/***/ 415:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PLACEMENT_STATUS = void 0;
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const school_1 = __importDefault(__webpack_require__(906));
const user_1 = __importDefault(__webpack_require__(85));
const cortexExternalProgram_1 = __importDefault(__webpack_require__(670));
const cortexExternalProgramVersion_1 = __importDefault(__webpack_require__(520));
const enrollmentStatus_1 = __importDefault(__webpack_require__(984));
const transaction_1 = __importDefault(__webpack_require__(264));
exports.PLACEMENT_STATUS = Object.freeze({
    CURRENTLY_PLACED: 'Currently Placed',
    NOT_AVAILABLE: 'Not Available',
    NOT_YET_PLACED: 'Not Yet Placed'
});
class CortexExternalUserProgramEnrollment extends sequelize_1.Model {
}
CortexExternalUserProgramEnrollment.init({
    ckExternalUserProgramEnrollmentID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    externalUserProgramEnrollmentID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: '3rd party user program enrollment ID'
    },
    externalProgramID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        comment: '3rd party program ID, nullable since there can be enrollments without program assigned (leads)'
    },
    externalProgramVersionID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        comment: '3rd party program version ID, nullable since there can be enrollments without specific version assigned'
    },
    placementStatus: {
        type: sequelize_1.DataTypes.ENUM,
        values: Object.values(exports.PLACEMENT_STATUS),
        allowNull: false
    },
    applicationReceivedDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    enrollmentDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    originalExpectedStartDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    expectedStartDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    transferDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    dropDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    graduationDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    reenrollDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    faExitInterviewDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    exitInterviewDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    statusChangeDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    externalCreatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    externalLastModifiedDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    isPlacementWaiverSigned: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    admissionRep: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    originalExpectedGraduationDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    ipedsState: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    isIpedsTransfer: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    isStudentTransfer: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    previousEducation: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    shift: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    schoolID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    ckExternalProgramID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    ckExternalProgramVersionID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    enrollmentStatusID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'CortexExternalUserProgramEnrollment',
    tableName: 'cortexExternalUserProgramEnrollment',
    timestamps: true,
    indexes: [
        {
            name: 'userProgramEnrollment_schoolID',
            unique: true,
            fields: ['externalUserProgramEnrollmentID', 'schoolID']
        }
    ]
});
CortexExternalUserProgramEnrollment.belongsTo(cortexExternalProgram_1.default, {
    foreignKey: {
        name: 'ckExternalProgramID',
        allowNull: true
    }
});
cortexExternalProgram_1.default.hasMany(CortexExternalUserProgramEnrollment, {
    foreignKey: {
        name: 'ckExternalProgramID',
        allowNull: true
    }
});
CortexExternalUserProgramEnrollment.belongsTo(cortexExternalProgramVersion_1.default, {
    foreignKey: {
        name: 'ckExternalProgramVersionID',
        allowNull: true
    }
});
cortexExternalProgramVersion_1.default.hasMany(CortexExternalUserProgramEnrollment, {
    foreignKey: {
        name: 'ckExternalProgramVersionID',
        allowNull: true
    }
});
CortexExternalUserProgramEnrollment.belongsTo(enrollmentStatus_1.default, {
    foreignKey: {
        name: 'enrollmentStatusID',
        allowNull: false
    }
});
enrollmentStatus_1.default.hasMany(CortexExternalUserProgramEnrollment, {
    foreignKey: {
        name: 'enrollmentStatusID',
        allowNull: false
    }
});
CortexExternalUserProgramEnrollment.belongsTo(user_1.default, {
    foreignKey: {
        name: 'userID',
        allowNull: false
    }
});
user_1.default.hasMany(CortexExternalUserProgramEnrollment, {
    foreignKey: {
        name: 'userID',
        allowNull: false
    }
});
CortexExternalUserProgramEnrollment.belongsTo(school_1.default, {
    foreignKey: {
        name: 'schoolID',
        allowNull: false
    }
});
school_1.default.hasMany(CortexExternalUserProgramEnrollment, {
    foreignKey: {
        name: 'schoolID',
        allowNull: false
    }
});
transaction_1.default.belongsTo(CortexExternalUserProgramEnrollment, { foreignKey: 'studentExternalProgramEnrolmentID' });
exports["default"] = CortexExternalUserProgramEnrollment;


/***/ }),

/***/ 421:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const cortexExternalUserProgramEnrollment_1 = __importDefault(__webpack_require__(415));
const program_1 = __importDefault(__webpack_require__(968));
const programUserMember_1 = __importDefault(__webpack_require__(833));
const school_1 = __importDefault(__webpack_require__(906));
const schoolPaymentConfig_1 = __importDefault(__webpack_require__(324));
const user_1 = __importDefault(__webpack_require__(85));
class PaymentPlan extends sequelize_1.Model {
}
PaymentPlan.init({
    paymentPlanID: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    autoPay: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2)
    },
    taxAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2)
    },
    tax: {
        type: sequelize_1.DataTypes.FLOAT(8, 2)
    },
    totalAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2)
    },
    totalInstallmentAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2)
    },
    paidAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2),
        defaultValue: 0
    },
    schoolID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    programID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    isActive: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 1
    },
    enrolledBy: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    isCustom: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('CANCELLED', 'CURRENT', 'PAST_DUE', 'MISSED', 'COMPLETED'),
        defaultValue: 'CURRENT'
    },
    paymentPlanStatus: {
        type: sequelize_1.DataTypes.ENUM('COMPLETED', 'ACTIVE', 'CANCELLED'),
        defaultValue: 'ACTIVE'
    },
    studentExternalProgramEnrolmentID: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true
    },
    isAnthology: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    fundSource: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'PaymentPlan',
    tableName: 'paymentPlan',
    timestamps: true
});
PaymentPlan.belongsTo(program_1.default, { foreignKey: 'programID' });
PaymentPlan.belongsTo(school_1.default, { foreignKey: 'schoolID' });
PaymentPlan.belongsTo(programUserMember_1.default, {
    foreignKey: 'programID',
    targetKey: 'programID',
    constraints: false
});
PaymentPlan.belongsTo(school_1.default, { foreignKey: 'schoolID' });
school_1.default.hasMany(PaymentPlan, { foreignKey: 'schoolID' });
PaymentPlan.belongsTo(schoolPaymentConfig_1.default, { foreignKey: 'schoolID', targetKey: 'schoolID' });
PaymentPlan.belongsTo(user_1.default, { foreignKey: 'userID', as: 'user' });
user_1.default.hasMany(PaymentPlan, { foreignKey: 'userID', onDelete: 'CASCADE' });
PaymentPlan.belongsTo(cortexExternalUserProgramEnrollment_1.default, { foreignKey: 'studentExternalProgramEnrolmentID' });
exports["default"] = PaymentPlan;


/***/ }),

/***/ 422:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
class UserGroup extends sequelize_1.Model {
}
UserGroup.init({
    userGroupID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    color: {
        type: sequelize_1.DataTypes.STRING
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    schoolID: {
        type: sequelize_1.DataTypes.STRING
    },
    archivedAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'UserGroup',
    tableName: 'userGroup',
    timestamps: true
});
exports["default"] = UserGroup;


/***/ }),

/***/ 451:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const transaction_1 = __importDefault(__webpack_require__(264));
class InvoiceTransaction extends sequelize_1.Model {
}
InvoiceTransaction.init({
    invoiceID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    transactionID: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2),
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'InvoiceTransaction',
    tableName: 'invoiceTransaction',
    timestamps: false
});
InvoiceTransaction.removeAttribute('id');
InvoiceTransaction.belongsTo(transaction_1.default, { foreignKey: 'transactionID' });
transaction_1.default.hasMany(InvoiceTransaction, { foreignKey: 'transactionID', onDelete: 'CASCADE' });
exports["default"] = InvoiceTransaction;


/***/ }),

/***/ 469:
/***/ ((module) => {

"use strict";
module.exports = require("dotenv/config");

/***/ }),

/***/ 479:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(469)
const {
  DB_HOST_RO,
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_PORT = '3306',
  DB_POOL_MIN = '1',
  DB_POOL_MAX = '1'
} = process.env

const dbConfig = {
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  replication: {
    read: [{ host: DB_HOST_RO ?? DB_HOST }],
    write: { host: DB_HOST }
  },
  port: Number(DB_PORT),
  pool: {
    max: Number(DB_POOL_MAX),
    min: Number(DB_POOL_MIN)
  },
  dialect: 'mysql',
  migrationStorageTableName: 'paymentMigrations'
}

module.exports = {
  development: dbConfig,
  test: { ...dbConfig, database: `${DB_NAME}_test` },
  production: dbConfig
}


/***/ }),

/***/ 483:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
class Account extends sequelize_1.Model {
}
Account.init({
    accountID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER
    },
    schoolID: {
        type: sequelize_1.DataTypes.STRING
    },
    issuedID: {
        type: sequelize_1.DataTypes.STRING(30)
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Account',
    tableName: 'account',
    timestamps: true
});
exports["default"] = Account;


/***/ }),

/***/ 511:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = dateWithStartTime;
exports.dateWithEndTime = dateWithEndTime;
exports.getStartOfTodayUTC = getStartOfTodayUTC;
exports.dateFormat = dateFormat;
exports.USDateFormat = USDateFormat;
function dateWithStartTime(date) {
    const startDateTime = new Date(date);
    startDateTime.setHours(0, 0, 0, 0);
    return startDateTime.toISOString();
}
function dateWithEndTime(date) {
    const startDateTime = new Date(date);
    startDateTime.setHours(23, 59, 59, 999);
    return startDateTime.toISOString();
}
function getStartOfTodayUTC() {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    return date.toISOString().replace('T', ' ').split('.')[0];
}
function dateFormat(date, format) {
    return `${date.toLocaleDateString(format, { month: 'numeric', day: 'numeric', year: '2-digit' })}, ${date.toLocaleTimeString(format, { hour: '2-digit', minute: '2-digit', hour12: true })}`;
}
function USDateFormat(date) {
    if (date === '' || date == null || date === undefined) {
        return '';
    }
    return new Date(date).toLocaleDateString('en-US');
}


/***/ }),

/***/ 520:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const cortexExternalProgram_1 = __importDefault(__webpack_require__(670));
const UNIT_TYPES = {
    CREDIT_HOUR: 'C',
    CLOCK_HOUR: 'H'
};
const LENGTH_TYPES = {
    WEEKS: 'W',
    MONTHS: 'M',
    YEARS: 'Y'
};
class CortexExternalProgramVersion extends sequelize_1.Model {
}
CortexExternalProgramVersion.init({
    ckExternalProgramVersionID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    externalProgramVersionID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        comment: '3rd party program version ID'
    },
    externalProgramID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '3rd party program ID'
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    transcriptDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    unitType: {
        type: sequelize_1.DataTypes.ENUM,
        values: Object.values(UNIT_TYPES),
        allowNull: true
    },
    degreeName: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    academicCalendar: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    programLengthType: {
        type: sequelize_1.DataTypes.ENUM,
        values: Object.values(LENGTH_TYPES),
        allowNull: false
    },
    programLengthValue: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    creditHoursRequired: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    clockHoursRequired: { type: sequelize_1.DataTypes.FLOAT, allowNull: true },
    isActive: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: true },
    isTitleIVEligible: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    isDegreeProgram: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    externalCreatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    externalLastModifiedDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    ckExternalProgramID: { type: sequelize_1.DataTypes.INTEGER, allowNull: false }
}, {
    sequelize: sequelize_2.default,
    modelName: 'CortexExternalProgramVersion',
    tableName: 'cortexExternalProgramVersion',
    indexes: [
        {
            name: 'externalProgram_externalProgramVersion',
            unique: true,
            fields: ['externalProgramVersionID', 'ckExternalProgramID']
        }
    ]
});
CortexExternalProgramVersion.belongsTo(cortexExternalProgram_1.default, {
    foreignKey: {
        name: 'ckExternalProgramID',
        allowNull: false
    }
});
cortexExternalProgram_1.default.hasMany(CortexExternalProgramVersion, {
    foreignKey: {
        name: 'ckExternalProgramID',
        allowNull: false
    }
});
exports["default"] = CortexExternalProgramVersion;


/***/ }),

/***/ 552:
/***/ ((module) => {

"use strict";
module.exports = require("pino");

/***/ }),

/***/ 604:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const userGroup_1 = __importDefault(__webpack_require__(422));
class UserGroupMember extends sequelize_1.Model {
}
UserGroupMember.init({
    userGroupMemberID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    userGroupID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'UserGroupMember',
    tableName: 'userGroupMember',
    timestamps: true
});
UserGroupMember.belongsTo(userGroup_1.default, { foreignKey: 'userGroupID', as: 'userGroup' });
exports["default"] = UserGroupMember;


/***/ }),

/***/ 644:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseQueryString = parseQueryString;
function parseQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}


/***/ }),

/***/ 646:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setStatusesOfPaymentPlan = void 0;
const sequelize_1 = __webpack_require__(31);
const logger_1 = __webpack_require__(187);
const paymentPlan_1 = __importDefault(__webpack_require__(421));
const setStatusesOfPaymentPlan = async (paymentPlanID) => {
    try {
        logger_1.logger.debug({ msg: 'Updating payment plan status for: ', paymentPlanID });
        await paymentPlan_1.default.update({
            status: sequelize_1.Sequelize.literal(`
          CASE
            WHEN isActive = 1 AND (
              SELECT SUM(totalAmount + invoiceFee)
              FROM paymentSchedule
              WHERE paymentPlanID = '${paymentPlanID}'
            ) - paidAmount <= 0 THEN 'COMPLETED'
            WHEN isActive = 0 THEN 'CANCELLED'
            ELSE CASE
              WHEN NOT EXISTS (
                SELECT 1
                FROM invoice i
                JOIN invoiceItem ii ON i.invoiceID = ii.invoiceID
                JOIN paymentSchedule ps ON ii.paymentScheduleID = ps.paymentScheduleID
                WHERE ps.paymentPlanID = '${paymentPlanID}' AND i.status = 'PAST_DUE'
              ) THEN 'CURRENT'
              WHEN EXISTS (
                SELECT 1
                FROM invoice i
                JOIN invoiceItem ii ON i.invoiceID = ii.invoiceID
                JOIN paymentSchedule ps ON ii.paymentScheduleID = ps.paymentScheduleID
                WHERE ps.paymentPlanID = '${paymentPlanID}' AND i.status = 'PAST_DUE'
                HAVING COUNT(*) = 1
              ) THEN 'MISSED'
              ELSE 'PAST_DUE'
            END
          END
        `),
            paymentPlanStatus: sequelize_1.Sequelize.literal(`
          CASE
            WHEN isActive = 0 THEN 'CANCELLED'
            WHEN isActive = 1 AND (
              SELECT SUM(totalAmount + invoiceFee)
              FROM paymentSchedule
              WHERE paymentPlanID = '${paymentPlanID}'
            ) - paidAmount <= 0 THEN 'COMPLETED'
            WHEN isActive = 1 AND (
              SELECT SUM(totalAmount + invoiceFee)
              FROM paymentSchedule
              WHERE paymentPlanID = '${paymentPlanID}'
            ) - paidAmount > 0 THEN 'ACTIVE'
            ELSE ''
          END
        `)
        }, {
            where: { paymentPlanID }
        });
        logger_1.logger.info({ msg: 'Payment plan status updated successfully', paymentPlanID });
    }
    catch (error) {
        logger_1.logger.error({ msg: 'Error updating payment plan status', error });
    }
};
exports.setStatusesOfPaymentPlan = setStatusesOfPaymentPlan;


/***/ }),

/***/ 658:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPaymentMethodInfo = exports.extractPaymentMethodInfo = exports.formatToDBTimestamp = void 0;
const logger_1 = __webpack_require__(187);
const formatToDBTimestamp = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
};
exports.formatToDBTimestamp = formatToDBTimestamp;
const extractPaymentMethodInfo = (transactionDetailString, status) => {
    logger_1.logger.debug({ msg: 'Extracting payment method info', transactionDetailString, status });
    const extractedData = {};
    const transactionDetail = new URLSearchParams(transactionDetailString);
    if (['FAILED', 'DECLINED'].includes(status))
        extractedData.failureReason = transactionDetail.get('xError') ?? transactionDetail.get('xResponseError');
    const cardType = transactionDetail.get('xCardType');
    if (cardType === 'Unknown' || cardType === null) {
        extractedData.cardType = 'Bank';
        extractedData.lastFourDigit = transactionDetail.get('xMaskedAccountNum') ?? transactionDetail.get('xMaskedAccountNumber');
    }
    else {
        extractedData.cardType = cardType;
        extractedData.lastFourDigit = transactionDetail.get('xMaskedCardNumber');
    }
    extractedData.lastFourDigit = extractedData.lastFourDigit?.slice(-4);
    logger_1.logger.debug({ msg: 'Extracted payment method info', extractedData });
    return extractedData;
};
exports.extractPaymentMethodInfo = extractPaymentMethodInfo;
const getPaymentMethodInfo = (transactionDetail, transactionType, transactionReference) => {
    switch (transactionType) {
        case 'cash':
            return 'Cash';
        case 'cheque':
            return `Check${transactionReference != null ? ` (${transactionReference})` : ''}`;
        case 'other':
            return `Other${transactionReference != null ? ` (${transactionReference})` : ''}`;
        default: {
            if (transactionDetail != null) {
                const transactionDetailInfo = new URLSearchParams(transactionDetail);
                const cardType = transactionDetailInfo.get('xCardType');
                const cardLastFour = transactionDetailInfo.get('xCardLastFour');
                if (cardType !== 'Unknown' && cardType !== null && cardLastFour != null && cardLastFour.length > 0) {
                    return `${cardType} (...${cardLastFour})`;
                }
                else if ((cardType === 'Unknown' || cardType == null) && cardLastFour != null && cardLastFour.length > 0) {
                    return `Bank (...${cardLastFour})`;
                }
                else {
                    return '-';
                }
            }
            else {
                return '-';
            }
        }
    }
};
exports.getPaymentMethodInfo = getPaymentMethodInfo;


/***/ }),

/***/ 670:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const school_1 = __importDefault(__webpack_require__(906));
class CortexExternalProgram extends sequelize_1.Model {
}
CortexExternalProgram.init({
    ckExternalProgramID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    externalProgramID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        comment: '3rd party ID'
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    cipCode: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    isActive: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: true },
    externalCreatedAt: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    externalLastModifiedDate: { type: sequelize_1.DataTypes.DATE, allowNull: false },
    schoolID: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, {
    sequelize: sequelize_2.default,
    modelName: 'CortexExternalProgram',
    tableName: 'cortexExternalProgram',
    indexes: [
        {
            name: 'schoolID_externalProgramID',
            unique: true,
            fields: ['schoolID', 'externalProgramID']
        }
    ]
});
CortexExternalProgram.belongsTo(school_1.default, {
    foreignKey: {
        name: 'schoolID',
        allowNull: false
    }
});
school_1.default.hasMany(CortexExternalProgram, {
    foreignKey: {
        name: 'schoolID',
        allowNull: false
    }
});
exports["default"] = CortexExternalProgram;


/***/ }),

/***/ 752:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const client_sqs_1 = __webpack_require__(330);
const logger_js_1 = __webpack_require__(187);
const { AWS_REGION = 'us-west-2' } = process.env;
const sqs = new client_sqs_1.SQSClient({ region: AWS_REGION });
const sendBatchMessages = async (messages, queueUrl, delaySeconds) => {
    let currentSubArray = [];
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (message === undefined) {
            continue;
        }
        const messageParam = {
            Id: i.toString(),
            MessageBody: JSON.stringify(message),
            ...(delaySeconds != null && { DelaySeconds: delaySeconds })
        };
        currentSubArray.push(messageParam);
        if (currentSubArray.length === 10 || i === messages.length - 1) {
            const command = new client_sqs_1.SendMessageBatchCommand({ QueueUrl: queueUrl, Entries: currentSubArray });
            const res = await sqs.send(command);
            logger_js_1.logger.debug({ sqs: res, Entries: currentSubArray });
            currentSubArray = [];
        }
    }
};
const deleteMessage = async (QueueUrl, ReceiptHandle) => {
    try {
        const command = new client_sqs_1.DeleteMessageCommand({ QueueUrl, ReceiptHandle });
        await sqs.send(command);
    }
    catch (err) {
        if (err instanceof Error) {
            logger_js_1.logger.error({ error: err.message, stack: err.stack });
        }
    }
};
exports["default"] = { sendBatchMessages, deleteMessage };


/***/ }),

/***/ 755:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const invoiceItem_1 = __importDefault(__webpack_require__(940));
const paymentPlan_1 = __importDefault(__webpack_require__(421));
class PaymentSchedule extends sequelize_1.Model {
}
PaymentSchedule.init({
    paymentScheduleID: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    paymentPlanID: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2),
        allowNull: false
    },
    taxAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2)
    },
    totalAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2),
        allowNull: false
    },
    paidAmount: {
        type: sequelize_1.DataTypes.FLOAT(8, 2),
        defaultValue: 0
    },
    invoiceFee: {
        type: sequelize_1.DataTypes.FLOAT(8, 2),
        defaultValue: 0
    },
    isInstallment: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    dueDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('UPCOMING', 'PAID', 'DUE', 'PAST_DUE', 'REFUNDED', 'PARTIALLY_PAID'),
        defaultValue: 'UPCOMING',
        allowNull: false
    },
    isDownPayment: {
        type: sequelize_1.DataTypes.TINYINT,
        defaultValue: 0
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'PaymentSchedule',
    tableName: 'paymentSchedule',
    timestamps: true
});
PaymentSchedule.hasOne(invoiceItem_1.default, {
    foreignKey: 'paymentScheduleID',
    onDelete: 'CASCADE',
    as: 'items'
});
invoiceItem_1.default.belongsTo(PaymentSchedule, { foreignKey: 'paymentScheduleID' });
PaymentSchedule.belongsTo(paymentPlan_1.default, { foreignKey: 'paymentPlanID' });
paymentPlan_1.default.hasMany(PaymentSchedule, { foreignKey: 'paymentPlanID', onDelete: 'CASCADE' });
exports["default"] = PaymentSchedule;


/***/ }),

/***/ 812:
/***/ ((module) => {

"use strict";
module.exports = require("moment-timezone");

/***/ }),

/***/ 816:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
class UsersToSchools extends sequelize_1.Model {
}
UsersToSchools.init({
    usersToSchoolsID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    schoolID: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'UsersToSchools',
    tableName: 'usersToSchools',
    timestamps: false
});
UsersToSchools.removeAttribute('id');
exports["default"] = UsersToSchools;


/***/ }),

/***/ 833:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.programPlacementStatuss = exports.programStatus = void 0;
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const program_1 = __importDefault(__webpack_require__(968));
class ProgramUserMember extends sequelize_1.Model {
}
exports.programStatus = ['Active', 'Dropped', 'Graduated', 'Future Start', 'Canceled', 'LOA'];
exports.programPlacementStatuss = ['Not Yet Placed', 'Not Available', 'Waiver Signed', 'Currently Placed'];
ProgramUserMember.init({
    programUserMemberID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    programID: {
        type: sequelize_1.DataTypes.INTEGER
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER
    },
    lastModification: {
        type: sequelize_1.DataTypes.DATE
    },
    lastStatusChange: {
        type: sequelize_1.DataTypes.DATE
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE
    },
    endDate: {
        type: sequelize_1.DataTypes.DATE
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: exports.programStatus
    },
    placementStatus: {
        type: sequelize_1.DataTypes.ENUM,
        values: exports.programPlacementStatuss
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'ProgramUserMember',
    tableName: 'requirementsTrackerProgramUserMember',
    timestamps: true
});
ProgramUserMember.belongsTo(program_1.default, { foreignKey: 'programID', as: 'program' });
exports["default"] = ProgramUserMember;


/***/ }),

/***/ 842:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const errors_1 = __webpack_require__(238);
class PaymentGateway extends sequelize_1.Model {
    static async getActivePaymentGatewayID() {
        const paymentGateway = await PaymentGateway.findOne({ where: { isActive: true } });
        if (paymentGateway === null) {
            throw new errors_1.PaymentGatewayError('Active payment gateway not found');
        }
        return paymentGateway.dataValues.paymentGatewayID;
    }
}
PaymentGateway.init({
    paymentGatewayID: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'PaymentGateway',
    tableName: 'paymentGateway',
    timestamps: false
});
PaymentGateway.removeAttribute('id');
exports["default"] = PaymentGateway;


/***/ }),

/***/ 901:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.processMessage = void 0;
const moment_timezone_1 = __importDefault(__webpack_require__(812));
const sequelize_1 = __webpack_require__(31);
const errors_1 = __webpack_require__(238);
const invoice_1 = __importStar(__webpack_require__(95));
const invoiceTransaction_1 = __importDefault(__webpack_require__(451));
const paymentPlan_1 = __importDefault(__webpack_require__(421));
const paymentSchedule_1 = __importDefault(__webpack_require__(755));
const school_1 = __importDefault(__webpack_require__(906));
const schoolPaymentConfig_1 = __importDefault(__webpack_require__(324));
const transaction_1 = __importDefault(__webpack_require__(264));
const user_1 = __importDefault(__webpack_require__(85));
const paymentLinkTransaction_1 = __importDefault(__webpack_require__(376));
const paymentGateway_1 = __importDefault(__webpack_require__(115));
const sqs_1 = __importDefault(__webpack_require__(752));
const helpers_1 = __webpack_require__(658);
const logger_1 = __webpack_require__(187);
const paymentPlanStatusSetter_1 = __webpack_require__(646);
const dateHelper_1 = __webpack_require__(511);
const sequelize_2 = __importDefault(__webpack_require__(191));
const invoiceItem_1 = __importDefault(__webpack_require__(940));
const queryParser_1 = __webpack_require__(644);
const paymentScheduleHelper_1 = __webpack_require__(320);
const { SOFTWARE_NAME = 'CourseKey', SOFTWARE_VERSION = '1.0.0', CARDKNOX_VERISON = '5.0.0', NOTIFICATION_QUEUE_URL = '', PUSHNOTIFICATION_QUEUE_URL = '', SMS_QUEUE_URL = '' } = process.env;
var ResponseResult;
(function (ResponseResult) {
    ResponseResult["Approved"] = "Approved";
    ResponseResult["Declined"] = "Declined";
    ResponseResult["Error"] = "Error";
})(ResponseResult || (ResponseResult = {}));
const updateInvoiceStatus = async (invoiceID, transactionID, amountToBeSettled) => {
    const invoiceData = await invoice_1.default.findOne({
        where: { invoiceID },
        attributes: [
            'status',
            [
                sequelize_2.default.literal('SUM(`PaymentSchedules`.`totalAmount` + `PaymentSchedules`.`invoiceFee` - `PaymentSchedules`.`paidAmount`)'),
                'remainingAmountToBePaid'
            ]
        ],
        include: [{
                model: paymentSchedule_1.default,
                attributes: [
                    'totalAmount', 'paidAmount', 'invoiceFee'
                ],
                as: 'PaymentSchedules',
                through: { attributes: [] }
            }]
    });
    if (invoiceData == null) {
        logger_1.logger.info({ msg: 'No invoice found', invoiceID });
        return;
    }
    const invoice = invoiceData.dataValues;
    const newInvoiceStatus = Number((invoice.remainingAmountToBePaid).toFixed(2)) <= 0 ? 'PAID' : (['DUE', 'PAST_DUE'].includes(invoice.status) ? invoice.status : 'PARTIALLY_PAID');
    await invoice_1.default.update({ status: newInvoiceStatus }, { where: { invoiceID } });
    await invoiceTransaction_1.default.create({ invoiceID, transactionID, amount: amountToBeSettled });
};
const updateInvoicesAndSchedules = async (fieldsToUpdate) => {
    const { invoiceIDs, invoiceData: invoice, status, amount = 0, overPaymentAllocation = 'NEXT', transactionID, userID, schoolID, programID } = fieldsToUpdate;
    const invoiceStatus = status === 'PAID' ? 'PAID' : 'FAILED';
    if (invoiceIDs.length === 0)
        return;
    logger_1.logger.debug({ msg: 'Updating invoices', invoiceIDs, status, invoiceStatus });
    if (status === 'PAID') {
        let transactionAmount = amount;
        const invoiceRemainingAmountToBePaid = Number(invoice.PaymentSchedules.reduce((sum, paymentSchedule) => sum + paymentSchedule.dataValues.remainingAmountToBePaid, 0).toFixed(2));
        const newInvoiceStatus = transactionAmount >= invoiceRemainingAmountToBePaid ? 'PAID' : (['DUE', 'PAST_DUE'].includes(invoice.status) ? invoice.status : 'PARTIALLY_PAID');
        await invoice_1.default.update({ status: newInvoiceStatus }, { where: { invoiceID: invoice.invoiceID } });
        logger_1.logger.debug({ msg: `Updating payment schedule for invoice: ${invoice.invoiceID}` });
        for (const invoicePaymentSchedule of invoice.PaymentSchedules) {
            const paymentSchedule = invoicePaymentSchedule.dataValues;
            const status = paymentSchedule.status;
            const paymentScheduleStatus = transactionAmount >= paymentSchedule.remainingAmountToBePaid ? 'PAID' : (status === 'PAST_DUE' ? status : 'PARTIALLY_PAID');
            const paymentSchedulePaidAmount = transactionAmount >= paymentSchedule.remainingAmountToBePaid ? paymentSchedule.totalAmountWithFee : Number(paymentSchedule.paidAmount + Number(transactionAmount.toFixed(2)));
            await paymentSchedule_1.default.update({ status: paymentScheduleStatus, paidAmount: paymentSchedulePaidAmount }, { where: { paymentScheduleID: paymentSchedule.paymentScheduleID } });
            transactionAmount -= (paymentSchedulePaidAmount - paymentSchedule.paidAmount);
            if (transactionAmount <= 0)
                break;
        }
        if (transactionAmount > 0) {
            const paymentPlanID = invoice.PaymentSchedules[0].dataValues.paymentPlanID;
            const order = overPaymentAllocation === 'NEXT' ? 'ASC' : 'DESC';
            let futurePaymentSchedules = await paymentSchedule_1.default.findAll({
                attributes: {
                    include: [
                        [
                            sequelize_2.default.literal('totalAmount + invoiceFee - paidAmount'),
                            'remainingAmountToBePaid'
                        ],
                        [
                            sequelize_2.default.literal('totalAmount + invoiceFee'),
                            'totalAmountWithFee'
                        ]
                    ]
                },
                where: { paymentPlanID },
                include: [{
                        model: invoice_1.default,
                        through: { attributes: [] }
                    }],
                order: [
                    ['isInstallment', order], ['isDownPayment', order], ['dueDate', order], ['createdAt', order]
                ]
            });
            if (overPaymentAllocation === 'NEXT') {
                futurePaymentSchedules = (0, paymentScheduleHelper_1.sortPaymentSchedules)(futurePaymentSchedules, invoice.PaymentSchedules[0].dataValues.paymentScheduleID);
            }
            for (const paymentSchedule of futurePaymentSchedules) {
                const { paidAmount, status, paymentScheduleID, remainingAmountToBePaid, totalAmountWithFee, dueDate } = paymentSchedule.dataValues;
                const remainingAmount = transactionAmount - remainingAmountToBePaid;
                if (remainingAmount !== transactionAmount) {
                    const paymentScheduleStatus = remainingAmount >= 0 ? 'PAID' : (['PAST_DUE', 'DUE'].includes(status) ? status : 'PARTIALLY_PAID');
                    const paymentSchedulePaidAmount = remainingAmount >= 0 ? totalAmountWithFee : paidAmount + transactionAmount;
                    logger_1.logger.debug({ msg: `Updating payment schedule for paymentScheduleID: ${paymentScheduleID}` });
                    await paymentSchedule_1.default.update({ status: paymentScheduleStatus, paidAmount: paymentSchedulePaidAmount }, { where: { paymentScheduleID } });
                    const amountToBeSettled = remainingAmount >= 0 ? remainingAmountToBePaid : remainingAmountToBePaid - Math.abs(remainingAmount);
                    if (paymentSchedule.dataValues.Invoices.length > 0) {
                        const invoiceID = paymentSchedule.dataValues.Invoices[0].dataValues.invoiceID;
                        await updateInvoiceStatus(invoiceID, transactionID, amountToBeSettled);
                        logger_1.logger.debug({ msg: `Invoice updated for invoiceID: ${invoiceID}` });
                    }
                    else {
                        const invoice = await invoice_1.default.create({
                            userID,
                            programID,
                            schoolID,
                            dueDate,
                            status: ['PAID', 'PARTIALLY_PAID'].includes(paymentScheduleStatus) ? paymentScheduleStatus : 'PENDING'
                        });
                        await invoiceItem_1.default.create({
                            invoiceID: invoice.dataValues.invoiceID,
                            paymentScheduleID
                        });
                        await invoiceTransaction_1.default.create({
                            invoiceID: invoice.dataValues.invoiceID,
                            transactionID,
                            amount: amountToBeSettled
                        });
                    }
                    transactionAmount -= amountToBeSettled;
                    if (transactionAmount <= 0)
                        break;
                }
            }
        }
        const paymentPlanID = invoice.PaymentSchedules[0].dataValues.paymentPlanID;
        const paymentSchedules = await paymentSchedule_1.default.findAll({ where: { paymentPlanID } });
        const totalPaidAmount = paymentSchedules.reduce((sum, paymentSchedule) => sum + paymentSchedule.dataValues.paidAmount, 0);
        logger_1.logger.debug({ msg: 'Updating payment plan', paymentPlanID, totalPaidAmount });
        await paymentPlan_1.default.update({ paidAmount: totalPaidAmount }, { where: { paymentPlanID } });
        try {
            await (0, paymentPlanStatusSetter_1.setStatusesOfPaymentPlan)(paymentPlanID);
        }
        catch (e) {
            logger_1.logger.error({ msg: `Failed to update payment plan status: ${paymentPlanID}`, error: e });
        }
    }
    else {
        await invoice_1.default.update({ status: invoiceStatus }, { where: { invoiceID: { [sequelize_1.Op.in]: invoiceIDs }, status: { [sequelize_1.Op.notIn]: ['PARTIALLY_PAID', 'DUE', 'PAST_DUE'] } } });
    }
    logger_1.logger.debug({ msg: 'Invoices updated', invoiceIDs, status, invoiceStatus });
};
const createInvoiceTransactions = async (invoiceIDs, transactionID, amount) => {
    const invoices = await (0, invoice_1.getInvoiceRemainingPayableAmount)(invoiceIDs);
    let paidAmount = amount;
    for (const invoice of invoices) {
        const remainingAmount = invoice.dataValues.remainingAmountToBePaid;
        const amountToBePaid = paidAmount >= remainingAmount ? remainingAmount : paidAmount;
        await invoiceTransaction_1.default.create({ invoiceID: invoice.dataValues.invoiceID, transactionID, amount: Number(amountToBePaid.toFixed(2)) });
        paidAmount -= amountToBePaid;
        if (paidAmount <= 0)
            break;
    }
};
const handleTransactionCreation = async (invoiceIDs, transactionDetails) => {
    logger_1.logger.debug({ msg: 'Creating new transaction for CC:AuthOnly' });
    const transaction = await transaction_1.default.create(transactionDetails);
    const amount = transactionDetails.totalAmount - transactionDetails.feeAmount;
    await createInvoiceTransactions(invoiceIDs, transaction.dataValues.transactionID, Number(amount.toFixed(2)));
    logger_1.logger.debug({ msg: `Transaction created for CC:AuthOnly with transactionID: ${transaction.dataValues.transactionID}` });
    return transaction.dataValues.transactionID;
};
const getStatus = (status) => {
    switch (status) {
        case 'Approved':
            return 'PAID';
        case 'Declined':
            return 'DECLINED';
        default:
            return 'FAILED';
    }
};
const getPaymentPlanID = async (invoiceID) => {
    const invoice = await invoice_1.default.findOne({
        where: { invoiceID },
        include: [{
                model: paymentSchedule_1.default,
                as: 'PaymentSchedules',
                through: { attributes: [] }
            }]
    });
    if (invoice === null) {
        throw new errors_1.ResourcesNotFoundError(['invoiceID']);
    }
    const paymentPlanID = invoice?.dataValues?.PaymentSchedules?.[0]?.dataValues?.paymentPlanID;
    return paymentPlanID;
};
const sendPushNotification = async (notificationData) => {
    try {
        const { status, userID, schoolID, amount, paidAt, invoiceID } = notificationData;
        const notificationMessage = {
            settings: {
                schoolID
            },
            extra: {
                title: 'Payment Successful',
                message: `Thank you for your payment of $${Number(amount).toFixed(2)} that was completed on ${paidAt}.`,
                route: 'invoice',
                extra: {
                    invoiceID,
                    paymentPlanID: await getPaymentPlanID(invoiceID) ?? ''
                }
            },
            userIDs: [userID],
            action: 'paymentNotification'
        };
        if (status === 'FAILED' || status === 'DECLINED') {
            notificationMessage.extra.title = 'Payment Failed';
            notificationMessage.extra.message = `Your payment of $${Number(amount).toFixed(2)} has failed, please log in to your CourseKey account to resubmit your payment.`;
        }
        logger_1.logger.debug({ msg: 'Sending push notification', notificationMessage });
        await sqs_1.default.sendBatchMessages([notificationMessage], PUSHNOTIFICATION_QUEUE_URL);
        logger_1.logger.debug({ msg: 'Sent push notification', notificationMessage });
    }
    catch (error) {
        logger_1.logger.error({ msg: 'Error while sending push notification', error });
    }
};
const sendNotification = async (schoolID, userID, transactionID, xAmount, status, payee, contactInfo = '', xInvoice, invoiceDueDate) => {
    logger_1.logger.debug({ msg: 'Sending Email', userID });
    try {
        const school = await school_1.default.findOne({
            where: { schoolID },
            attributes: ['name']
        });
        if (school === null) {
            throw new errors_1.ResourcesNotFoundError(['schoolID']);
        }
        const user = await user_1.default.findOne({ where: { userID }, attributes: ['firstName', 'lastName', 'email'] });
        if (user === null) {
            throw new errors_1.ResourcesNotFoundError(['userID']);
        }
        const { email, firstName, lastName } = user.dataValues;
        const getTransaction = await transaction_1.default.findOne({ where: { transactionID } });
        if (getTransaction === null) {
            throw new errors_1.ResourcesNotFoundError(['transactionID']);
        }
        const transactionData = getTransaction.dataValues;
        const transactionDate = transactionData.updatedAt;
        const date = new Date(transactionDate);
        const paidAt = (0, moment_timezone_1.default)(date).format('MM/DD/YYYY');
        const schoolName = school.dataValues.name;
        const amount = Number(xAmount).toFixed(2);
        const studentName = `${firstName} ${lastName ?? ''}`;
        const { cardType, lastFourDigit } = (0, helpers_1.extractPaymentMethodInfo)(transactionData.transactionDetail, transactionData.status);
        let extractedFailureReason;
        if (status === 'FAILED' || status === 'DECLINED') {
            logger_1.logger.debug({ msg: 'Extracting Failure Reason' });
            const { failureReason } = (0, helpers_1.extractPaymentMethodInfo)(transactionData.transactionDetail, transactionData.status);
            extractedFailureReason = failureReason;
        }
        const channelType = payee.split('|')[0];
        const payeeInfo = payee.split('|')[1];
        if (payeeInfo === '' || payeeInfo === undefined || payeeInfo === null) {
            logger_1.logger.debug({ msg: 'Payee not found' });
            return;
        }
        if (status === 'PAID') {
            if (channelType === 'email') {
                const payer = [email, payeeInfo].filter(Boolean).join(',');
                logger_1.logger.debug({ msg: 'Sending email to payer', payer });
                const emailData = {
                    channel: 'EMAIL',
                    data: {
                        type: 'PAYMENT_LINK_COMPLETE_PAYMENT_TEMPLATE_WITH_RECEIPT',
                        email: payer,
                        dynamic_template_data: {
                            studentName,
                            schoolName,
                            transactionID,
                            invoiceDueDate: (0, dateHelper_1.dateFormat)(new Date(invoiceDueDate), 'en-US') ?? '',
                            paidAt,
                            invoiceID: xInvoice,
                            paymentMethod: `${cardType} (...${lastFourDigit})`,
                            amount: Number(amount).toFixed(2),
                            status,
                            contactInfo,
                            ...(extractedFailureReason != null && { failureReason: extractedFailureReason })
                        }
                    }
                };
                await sqs_1.default.sendBatchMessages([emailData], NOTIFICATION_QUEUE_URL);
                logger_1.logger.debug({ msg: 'Email sent', userID, payeeInfo });
            }
            else if (channelType === 'phone') {
                const smsData = {
                    phoneNumber: payeeInfo,
                    message: `Your payment for ${studentName} to ${schoolName} has been received. Thank you for your payment`,
                    type: 'TRANSACTIONAL'
                };
                await sqs_1.default.sendBatchMessages([smsData], `${SMS_QUEUE_URL}`);
                logger_1.logger.debug({ msg: 'SMS sent', userID, payeeInfo });
            }
            else {
                logger_1.logger.debug({ msg: 'Invalid channel type' });
            }
            await sendPushNotification({ status, userID: Number(userID), schoolID: schoolID ?? '', amount: Number(amount), paidAt, invoiceID: xInvoice });
        }
        else {
            logger_1.logger.debug({ msg: 'Payment was unsuccessful' });
        }
    }
    catch (error) {
        logger_1.logger.error({ msg: 'Error while sending email', error });
    }
};
const calculateProcessingFee = (schoolPaymentConfig, xAmount, xCommand) => {
    const paymentType = xCommand?.split(':')?.[0]?.toLowerCase();
    let feePercentage = 0;
    if (paymentType === 'cc') {
        feePercentage = schoolPaymentConfig.dataValues.ccFee;
    }
    else if (paymentType === 'check') {
        feePercentage = schoolPaymentConfig.dataValues.achFee;
    }
    if ([0, null].includes(feePercentage))
        return { feePercentage: 0, feeAmount: 0 };
    const amount = xAmount / (1 + feePercentage / 100);
    const feeAmount = Number((xAmount - amount).toFixed(2));
    return { feePercentage, feeAmount };
};
const sendNotificationForPaymentLinkTransaction = async (paymentLinkTransactionID, contactInfo, schoolID, amount, notificationType, xShipEmail, studentName) => {
    try {
        let templateData;
        let payer;
        const school = await school_1.default.findOne({
            where: { schoolID },
            attributes: ['name']
        });
        if (school === null) {
            throw new errors_1.ResourcesNotFoundError(['schoolID']);
        }
        const paymentLinkTransaction = await paymentLinkTransaction_1.default.findOne({ where: { paymentLinkTransactionID } });
        if (paymentLinkTransaction === null) {
            const schoolName = school.dataValues.name;
            payer = xShipEmail;
            templateData = {
                studentName,
                schoolName,
                contactInfo
            };
        }
        else {
            const { transactionDetail, paymentDate, status: paymentLinkTransactionStatus, firstName, lastName, email, additionalEmail, totalAmount } = paymentLinkTransaction.dataValues;
            const schoolName = school.dataValues.name;
            const transactionDate = paymentDate;
            const status = paymentLinkTransactionStatus;
            const date = new Date(transactionDate);
            const paidAt = (0, moment_timezone_1.default)(date).format('MM/DD/YYYY');
            const studentName = `${firstName} ${lastName}`;
            payer = [email, additionalEmail].filter(Boolean).join(',');
            const differenceAmount = Number(totalAmount - amount).toFixed(2);
            let extractedFailureReason;
            if (status === 'FAILED' || status === 'DECLINED') {
                logger_1.logger.debug({ msg: 'Extracting Failure Reason' });
                const { failureReason } = (0, helpers_1.extractPaymentMethodInfo)(transactionDetail, paymentLinkTransactionStatus);
                extractedFailureReason = failureReason;
            }
            templateData = {
                studentName,
                invoiceID: paymentLinkTransactionID.toString(),
                schoolName,
                paidAt,
                dueAmount: totalAmount,
                differenceAmount: Number(differenceAmount),
                amount: Number(amount).toFixed(2),
                status,
                contactInfo,
                ...(extractedFailureReason != null && { failureReason: extractedFailureReason })
            };
        }
        const emailData = {
            channel: 'EMAIL',
            data: {
                type: notificationType,
                email: payer,
                dynamic_template_data: templateData
            }
        };
        await sqs_1.default.sendBatchMessages([emailData], NOTIFICATION_QUEUE_URL);
        logger_1.logger.debug({ msg: 'Email sent', payer });
    }
    catch (error) {
        logger_1.logger.error({ msg: 'Error while sending email', error });
    }
};
const capturePayment = async (paymentService, transactionAPIDetails) => {
    transactionAPIDetails.xCommand = 'cc:Capture';
    const captureResponse = await paymentService.capture(transactionAPIDetails);
    logger_1.logger.debug({ msg: 'Transaction captured', captureResponse });
    return { captureResponse, captureStatus: getStatus(captureResponse.xStatus) };
};
const voidPayment = async (parmas) => {
    const { transactionID, transactionAPIDetails, paymentService } = parmas;
    transactionAPIDetails.xCommand = 'cc:voidrelease';
    const voidResponse = await paymentService.void(transactionAPIDetails);
    logger_1.logger.debug({ msg: 'Transaction voided', voidResponse });
    if (transactionID != null)
        await transaction_1.default.update({ status: voidResponse.xStatus === 'Approved' ? 'VOIDED' : 'FAILED', type: 'void' }, { where: { transactionID } });
};
const processPaymentLinkTransaction = async (xInvoice, xAmount, xResponseResult, requestBody, xRefNum, feeAmount, schoolID, xShipEmail, studentName) => {
    const paymentLinkTransactionID = Number(xInvoice);
    const schoolPaymentConfig = await schoolPaymentConfig_1.default.findOne({ where: { schoolID } });
    const xKey = schoolPaymentConfig?.dataValues?.apiKey;
    const contactInfo = schoolPaymentConfig?.dataValues?.contactEmail;
    const paymentService = new paymentGateway_1.default();
    await paymentService.initialize();
    const transactionAPIDetails = {
        xKey,
        xVersion: CARDKNOX_VERISON,
        xSoftwareName: SOFTWARE_NAME,
        xSoftwareVersion: SOFTWARE_VERSION,
        xCommand: '',
        xAmount,
        xRefNum,
        ...(feeAmount !== 0 ? { xCustom07: feeAmount } : {})
    };
    try {
        const status = xResponseResult === ResponseResult.Approved ? 'PAID' : xResponseResult === ResponseResult.Declined ? 'DECLINED' : 'FAILED';
        if (schoolPaymentConfig === null) {
            await voidPayment({ transactionAPIDetails, paymentService });
            throw new errors_1.ResourcesNotFoundError(['schoolPaymentConfigID']);
        }
        const paymentLinkTransaction = await paymentLinkTransaction_1.default.findOne({ where: { paymentLinkTransactionID } });
        if (paymentLinkTransaction === null) {
            logger_1.logger.debug({ msg: `PaymentLinkTransaction not found for paymentLinkTransactionID ${paymentLinkTransactionID}` });
            await voidPayment({ transactionAPIDetails, paymentService });
            await sendNotificationForPaymentLinkTransaction(paymentLinkTransactionID, contactInfo, schoolID, Number(xAmount), 'QUICK_PAY_PAYMENT_LINK_EXPIRED_TEMPLATE', xShipEmail, studentName);
            throw new errors_1.ResourcesNotFoundError(['paymentLinkTransactionID']);
        }
        const { totalAmount, status: paymentLinkTransactionStatus } = paymentLinkTransaction.dataValues;
        if (paymentLinkTransactionStatus === 'PAID') {
            if (status === 'PAID') {
                logger_1.logger.debug({ msg: `Payment has already been made id: ${paymentLinkTransactionID}` });
                await voidPayment({ transactionAPIDetails, paymentService });
                logger_1.logger.debug({ msg: `Transaction voided successfully for paymentLinkTransactionID: ${paymentLinkTransactionID}` });
                await sendNotificationForPaymentLinkTransaction(paymentLinkTransactionID, contactInfo, schoolID, Number(xAmount), 'PAYMENT_HAS_ALREADY_BEEN_MADE_TEMPLATE');
                return;
            }
            logger_1.logger.debug({ msg: `PaymentLinkTransaction already paid for paymentLinkTransactionID: ${paymentLinkTransactionID}` });
        }
        else {
            if (['FAILED', 'DECLINED'].includes(status)) {
                logger_1.logger.debug({ msg: 'CC: AuthOnly transaction failed', paymentLinkTransactionID, paymentInfo: requestBody.toString() });
                await paymentLinkTransaction_1.default.update({ status, transactionMappingID: xRefNum, transactionDetail: requestBody, paymentDate: new Date().toISOString() }, { where: { paymentLinkTransactionID } });
                await sendNotificationForPaymentLinkTransaction(paymentLinkTransactionID, contactInfo, schoolID, Number(xAmount), 'QUICK_PAY_PAYMENT_FAIL_TEMPLATE');
                return;
            }
            if (Number(totalAmount) !== Number(xAmount)) {
                await voidPayment({ transactionAPIDetails, paymentService });
                logger_1.logger.debug({ msg: `Amount mismatch detected for paymentLinkTransactionID: ${paymentLinkTransactionID}. Expected amount: ${totalAmount}, but received: ${xAmount}.` });
                await sendNotificationForPaymentLinkTransaction(paymentLinkTransactionID, contactInfo, schoolID, Number(xAmount), 'PAYMENT_AMOUNT_MISMATCH_TEMPLATE');
                return;
            }
            logger_1.logger.debug({ msg: `Capturing transaction for paymentLinkTransactionID ${paymentLinkTransactionID}, Amount ${xAmount}` });
            const { captureResponse, captureStatus } = await capturePayment(paymentService, transactionAPIDetails);
            const parsedObject = (0, queryParser_1.parseQueryString)(requestBody);
            parsedObject['xError'] = captureResponse.xError;
            const transactionDetail = new URLSearchParams(parsedObject).toString();
            await paymentLinkTransaction_1.default.update({ type: 'capture', status: captureStatus, transactionMappingID: xRefNum, transactionDetail, paymentDate: new Date().toISOString() }, { where: { paymentLinkTransactionID: xInvoice } });
            if (captureStatus === 'PAID') {
                logger_1.logger.debug({ msg: 'Sending confirmation email for payment link transaction', paymentLinkTransactionID, captureStatus });
                await sendNotificationForPaymentLinkTransaction(paymentLinkTransactionID, contactInfo, schoolID, Number(xAmount), 'PAYMENT_CONFIRMATION_TEMPLATE');
            }
            else {
                logger_1.logger.debug({ msg: 'Voiding transaction for paymentLinkTransactionID', paymentLinkTransactionID });
                await voidPayment({ transactionAPIDetails, paymentService });
                logger_1.logger.debug({ msg: 'Sending failure email for payment link transaction', paymentLinkTransactionID, captureStatus });
                await sendNotificationForPaymentLinkTransaction(paymentLinkTransactionID, contactInfo, schoolID, Number(xAmount), 'QUICK_PAY_PAYMENT_FAIL_TEMPLATE');
            }
        }
    }
    catch (error) {
        logger_1.logger.error({ msg: `Payment Handling failed for paymentLinkTransactionID ${paymentLinkTransactionID}, paymentInfo: ${requestBody}`, error });
        await voidPayment({ transactionAPIDetails, paymentService });
        throw error;
    }
};
const processMessage = async (record) => {
    const transactionData = JSON.parse(record.body);
    logger_1.logger.debug({ msg: 'Processing message', transactionData });
    const requestBody = new URLSearchParams(transactionData);
    const xCommand = requestBody.get('xCommand') ?? '';
    const xResponseResult = requestBody.get('xResponseResult') ?? '';
    const xInvoice = requestBody.get('xInvoice') ?? '';
    const xAmount = requestBody.get('xAmount') ?? '';
    const invoiceIDs = xInvoice.split(',');
    const xCardType = requestBody.get('xCardType') ?? '';
    const xCustom01 = requestBody.get('xCustom01') ?? '';
    const xCustom02 = requestBody.get('xCustom02') ?? '';
    const xCustom03 = requestBody.get('xCustom03') ?? undefined;
    const xCustom04 = requestBody.get('xCustom04') ?? undefined;
    const xCustom05 = requestBody.get('xCustom05');
    const xCustom06 = requestBody.get('xCustom06') ?? '';
    const xRefNum = requestBody.get('xRefNum') ?? '';
    logger_1.logger.debug({ msg: 'webhook decoded params', xCommand, xResponseResult, invoiceIDs, xAmount, xCustom01, xCustom02, xCustom03, xCustom04, xCustom05, xCustom06, xRefNum });
    if (xCommand === 'CC:AuthOnly' && xCustom03 === undefined && xCustom04 === undefined) {
        const response = requestBody.toString();
        const xShipEmail = requestBody.get('xEmail') ?? '';
        const studentName = requestBody.get('xName') ?? '';
        const feeAmount = Number(requestBody.get('xCustom07')) ?? 0;
        logger_1.logger.debug({ msg: 'PaymentLinkTransaction webhook received', xInvoice, xAmount, xResponseResult, response, xRefNum, feeAmount });
        const invoiceID = xInvoice.replace('quickpay-', '');
        const schoolID = xCustom05;
        await processPaymentLinkTransaction(invoiceID, xAmount, xResponseResult, response, xRefNum, feeAmount, schoolID, xShipEmail, studentName);
        return;
    }
    try {
        if (!['CC:Sale', 'Check:Sale', 'CC:AuthOnly'].includes(xCommand)) {
            logger_1.logger.debug({ msg: `${xCommand} is not handled`, requestBody: requestBody.toString() });
            return;
        }
        const schoolPaymentConfig = await schoolPaymentConfig_1.default.findOne({ where: { schoolID: xCustom05 } });
        if (schoolPaymentConfig === null) {
            throw new errors_1.ResourcesNotFoundError(['schoolPaymentConfigID']);
        }
        const { feePercentage, feeAmount } = calculateProcessingFee(schoolPaymentConfig, Number(xAmount), xCommand);
        const paymentDate = new Date().toISOString();
        const userID = xCustom03;
        const programID = xCustom04;
        const schoolID = xCustom05;
        const transactionDetails = {
            transactionDetail: requestBody.toString(),
            transactionMappingID: xRefNum,
            type: xCommand === 'CC:AuthOnly' ? 'auth' : 'charge',
            totalAmount: parseFloat(xAmount),
            feeAmount,
            feePercentage,
            paymentDate,
            currency: 'USD',
            status: 'PROCESSING',
            userID,
            programID,
            schoolID
        };
        if (xCommand === 'CC:Sale' || xCommand === 'Check:Sale') {
            const status = xResponseResult === ResponseResult.Approved ? 'PAID' : xResponseResult === ResponseResult.Declined ? 'DECLINED' : 'FAILED';
            transactionDetails.status = status;
            await transaction_1.default.update({ status, transactionDetail: requestBody.toString(), paymentDate, transactionMappingID: xRefNum }, { where: { transactionID: xCustom02 } });
        }
        else if (xCommand === 'CC:AuthOnly') {
            logger_1.logger.debug({ msg: 'Retrieving all invoices', invoiceIDs });
            const paymentService = new paymentGateway_1.default();
            await paymentService.initialize();
            const xKey = schoolPaymentConfig?.dataValues?.apiKey;
            const contactInfo = schoolPaymentConfig?.dataValues?.studentContactEmail;
            const transactionAPIDetails = {
                xKey,
                xVersion: CARDKNOX_VERISON,
                xSoftwareName: SOFTWARE_NAME,
                xSoftwareVersion: SOFTWARE_VERSION,
                xCommand: '',
                xAmount,
                xRefNum,
                ...(feeAmount !== 0 ? { xCustom07: feeAmount } : {})
            };
            const requireSequentialPayment = schoolPaymentConfig.dataValues.requireSequentialPayment;
            if (requireSequentialPayment === 1) {
                await voidPayment({ transactionAPIDetails, paymentService });
                logger_1.logger.debug({ msg: 'Sequential payment required, voiding transaction', transactionAPIDetails });
                return;
            }
            try {
                const invoiceData = await invoice_1.default.findOne({
                    where: sequelize_2.default.where(sequelize_2.default.cast(sequelize_2.default.col('invoiceID'), 'CHAR'), invoiceIDs[0]),
                    attributes: [
                        'invoiceID', 'status', 'programID', 'createdAt', 'updatedAt'
                    ],
                    include: [{
                            model: paymentSchedule_1.default,
                            attributes: [
                                'paymentScheduleID', 'paymentPlanID', 'description', 'amount', 'taxAmount', 'totalAmount',
                                'status', 'paidAmount', 'invoiceFee',
                                [
                                    sequelize_2.default.literal('`PaymentSchedules`.`totalAmount` + `PaymentSchedules`.`invoiceFee` - `PaymentSchedules`.`paidAmount`'),
                                    'remainingAmountToBePaid'
                                ],
                                [
                                    sequelize_2.default.literal('(`PaymentSchedules`.`totalAmount`) + (`PaymentSchedules`.`invoiceFee`)'),
                                    'totalAmountWithFee'
                                ]
                            ],
                            as: 'PaymentSchedules',
                            through: { attributes: [] }
                        }]
                });
                logger_1.logger.debug({ msg: 'Retrieved invoice', invoiceIDs, invoiceData });
                if (invoiceData == null) {
                    logger_1.logger.info({ msg: 'No invoice found', invoiceIDs });
                    await voidPayment({ transactionAPIDetails, paymentService });
                    return;
                }
                const paymentPlanID = invoiceData?.dataValues?.PaymentSchedules?.[0]?.dataValues?.paymentPlanID;
                const paymentPlan = await paymentPlan_1.default.findOne({
                    where: { paymentPlanID },
                    attributes: [
                        [sequelize_2.default.literal('SUM(`PaymentSchedules`.`totalAmount` + `PaymentSchedules`.`invoiceFee` - `PaymentSchedules`.`paidAmount`)'), 'remainingAmountToBePaid']
                    ],
                    include: [{
                            model: paymentSchedule_1.default,
                            attributes: ['totalAmount', 'paidAmount', 'invoiceFee']
                        }]
                });
                const amountToBeSettledInSchedules = Number((Number(xAmount) - feeAmount).toFixed(2));
                let isOverPaid = false;
                if (Number(paymentPlan?.dataValues.remainingAmountToBePaid.toFixed(2)) < amountToBeSettledInSchedules) {
                    isOverPaid = true;
                }
                const transactionID = await handleTransactionCreation(invoiceIDs, transactionDetails);
                if (xResponseResult === ResponseResult.Approved) {
                    const invoice = (await invoice_1.default.findOne({ where: { invoiceID: xInvoice } }))?.dataValues;
                    if (invoice === undefined) {
                        logger_1.logger.debug({ msg: `Invoice not found for invoiceID ${xInvoice}` });
                        await voidPayment({ transactionID, transactionAPIDetails, paymentService });
                        return;
                    }
                    const invoiceDueDate = invoice.dueDate;
                    if (invoice.status === 'PAID' || isOverPaid) {
                        isOverPaid
                            ? logger_1.logger.debug({ msg: 'Payment amount exceeds current outstanding balance, voiding transaction' })
                            : logger_1.logger.debug({ msg: `Invoice already paid for invoiceID ${xInvoice}, voiding transaction` });
                        transactionAPIDetails.xCommand = (xCardType === '' ? 'check:Void' : 'cc:voidrelease');
                        const { xStatus } = await paymentService.void(transactionAPIDetails);
                        await transaction_1.default.update({ status: xStatus === 'Approved' ? 'VOIDED' : 'FAILED', type: 'void' }, { where: { transactionID } });
                        logger_1.logger.debug({ msg: `Transaction voided for invoiceID ${xInvoice}, transactionID: ${transactionID}` });
                    }
                    else if (xCardType !== '') {
                        logger_1.logger.debug({ msg: `Invoice not paid for invoiceID ${xInvoice}, capturing transaction` });
                        transactionAPIDetails.xCommand = 'cc:Capture';
                        const { xStatus } = await paymentService.capture(transactionAPIDetails);
                        const status = getStatus(xStatus);
                        await sendNotification(xCustom05, xCustom03, transactionID, xAmount, status, xCustom06, contactInfo, xInvoice, invoiceDueDate);
                        if (status === 'PAID') {
                            await transaction_1.default.update({ status, type: 'capture' }, { where: { transactionID } });
                        }
                        else {
                            await voidPayment({ transactionID, transactionAPIDetails, paymentService });
                        }
                        await updateInvoicesAndSchedules({ invoiceIDs, invoiceData: invoiceData.dataValues, status, amount: amountToBeSettledInSchedules, overPaymentAllocation: schoolPaymentConfig?.dataValues?.overPaymentAllocation, transactionID, userID, schoolID, programID });
                        logger_1.logger.debug({ msg: `Transaction captured for invoiceID ${xInvoice}, transactionID: ${transactionID}` });
                    }
                    else {
                        logger_1.logger.debug({ msg: `Invoice not paid for invoiceID ${xInvoice}, voiding transaction` });
                        await voidPayment({ transactionID, transactionAPIDetails, paymentService });
                    }
                }
                else {
                    logger_1.logger.debug({ msg: `CC: AuthOnly transaction failed, paymentInfo: ${requestBody.toString()}` });
                    await transaction_1.default.update({ status: 'FAILED' }, { where: { transactionID } });
                    await updateInvoicesAndSchedules({ invoiceIDs, invoiceData: invoiceData.dataValues, status: 'FAILED', transactionID, userID, schoolID, programID });
                }
                logger_1.logger.debug({ message: `Payment Handling successful for invoiceIDS: ${invoiceIDs.join(', ')}, transactionID ${xCustom02}` });
            }
            catch (error) {
                await voidPayment({ transactionAPIDetails, paymentService });
                throw error;
            }
        }
    }
    catch (error) {
        logger_1.logger.error({ msg: `Payment Handling failed for transactionID ${xCustom02}, paymentInfo: ${requestBody.toString()}`, error });
        throw error;
    }
};
exports.processMessage = processMessage;


/***/ }),

/***/ 906:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const schoolPaymentConfig_1 = __importDefault(__webpack_require__(324));
const user_1 = __importDefault(__webpack_require__(85));
const usersToSchools_1 = __importDefault(__webpack_require__(816));
const transaction_1 = __importDefault(__webpack_require__(264));
const program_1 = __importDefault(__webpack_require__(968));
class School extends sequelize_1.Model {
}
School.init({
    schoolID: {
        type: sequelize_1.DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false
    },
    acronym: {
        type: sequelize_1.DataTypes.STRING(7),
        allowNull: false
    },
    isCareer: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false
    },
    timezone: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false
    },
    textAimSchoolID: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    hasCortex: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false
    },
    hasComplianceReports: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'School',
    tableName: 'school',
    timestamps: true
});
School.hasMany(program_1.default, { foreignKey: 'schoolID' });
program_1.default.belongsTo(School, { foreignKey: 'schoolID' });
School.hasOne(schoolPaymentConfig_1.default, {
    foreignKey: 'schoolID',
    as: 'paymentSiteConfig'
});
School.belongsToMany(user_1.default, {
    through: usersToSchools_1.default,
    foreignKey: 'schoolID',
    otherKey: 'userID'
});
transaction_1.default.belongsTo(School, { foreignKey: 'schoolID' });
exports["default"] = School;


/***/ }),

/***/ 940:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
class InvoiceItem extends sequelize_1.Model {
}
InvoiceItem.init({
    paymentScheduleID: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    invoiceID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'InvoiceItem',
    tableName: 'invoiceItem',
    timestamps: false
});
InvoiceItem.removeAttribute('id');
exports["default"] = InvoiceItem;


/***/ }),

/***/ 955:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.paymentMethodTypes = void 0;
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const paymentGateway_1 = __importDefault(__webpack_require__(842));
const errors_1 = __webpack_require__(238);
class PaymentMethod extends sequelize_1.Model {
    static async getDefaultPaymentMethod(userID) {
        const defaultPaymentMethod = await PaymentMethod.findOne({
            where: {
                userID,
                isDefault: 1,
                paymentGatewayID: await paymentGateway_1.default.getActivePaymentGatewayID()
            }
        });
        if (defaultPaymentMethod === null) {
            throw new errors_1.ConstraintViolationError([], 'Default payment method not found');
        }
        return defaultPaymentMethod;
    }
}
exports.paymentMethodTypes = ['card', 'bank'];
PaymentMethod.init({
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    paymentGatewayID: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    paymentMethodMappingID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING
    },
    token: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    tokenType: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false
    },
    method: {
        type: sequelize_1.DataTypes.ENUM,
        values: exports.paymentMethodTypes,
        allowNull: false
    },
    cardType: {
        type: sequelize_1.DataTypes.STRING(30)
    },
    cardExpiry: {
        type: sequelize_1.DataTypes.STRING(6)
    },
    maskedNumber: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    accountType: {
        type: sequelize_1.DataTypes.STRING(20)
    },
    isDefault: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'PaymentMethod',
    tableName: 'paymentMethod',
    timestamps: true
});
PaymentMethod.removeAttribute('id');
PaymentMethod.belongsTo(paymentGateway_1.default, { foreignKey: 'paymentGatewayID' });
exports["default"] = PaymentMethod;


/***/ }),

/***/ 968:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
class Program extends sequelize_1.Model {
}
Program.init({
    programID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    schoolID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    programCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'Program',
    tableName: 'requirementsTrackerProgram',
    timestamps: true
});
exports["default"] = Program;


/***/ }),

/***/ 984:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sequelize_1 = __webpack_require__(31);
const sequelize_2 = __importDefault(__webpack_require__(191));
const school_1 = __importDefault(__webpack_require__(906));
const SYSTEM_STATUS = {
    ACTIVE: 'Active',
    APPLICATION_RECEIVED: 'Application Received',
    CANCELED: 'Canceled',
    DROPPED: 'Dropped',
    FUTURE_START: 'Future Start',
    GRADUATED: 'Graduated',
    LEAD: 'Lead',
    LOA: 'LOA',
    NEVER_ATTENDED: 'Never Attended',
    PENDING_APPLICANT: 'Pending Applicant',
    PROBATION: 'Probation',
    RE_ENTRY: 'Re-entry',
    CREATED: 'Created'
};
class EnrollmentStatus extends sequelize_1.Model {
}
EnrollmentStatus.init({
    enrollmentStatusID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false
    },
    systemStatus: {
        type: sequelize_1.DataTypes.ENUM,
        values: Object.values(SYSTEM_STATUS),
        allowNull: false
    },
    schoolID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize: sequelize_2.default,
    modelName: 'EnrollmentStatus',
    tableName: 'enrollmentStatus',
    indexes: [
        {
            name: 'IDX_status_systemStatus_schoolID',
            unique: true,
            fields: ['schoolID', 'status', 'systemStatus']
        }
    ]
});
EnrollmentStatus.belongsTo(school_1.default, {
    foreignKey: {
        name: 'schoolID',
        allowNull: true
    }
});
school_1.default.hasMany(EnrollmentStatus, {
    foreignKey: {
        name: 'schoolID'
    }
});
exports["default"] = EnrollmentStatus;


/***/ }),

/***/ 985:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const errors_1 = __webpack_require__(238);
const logger_1 = __webpack_require__(187);
class Cardknox {
    CARDKNOX_CUSTOMER_API_URL = 'https://api.cardknox.com/v2';
    CARDKNOX_TRANSACTION_API_URL = 'https://x1.cardknox.com/gatewayjson';
    CARDKNOX_REPORT_API_URL = 'https://x1.cardknox.com/reportjson';
    CARDKNOX_MERCHANT_API_URL = 'https://psapi.cardknox.com/boarding/v1';
    CARDKNOX_SETTINGS_API_URL = 'https://us-west-2.settings.cardknox.com/v1';
    X_RECURRING_API_VERSION = '2.1';
    TRANSACTION_HEADERS;
    CUSTOMER_HEADERS;
    constructor(apiKey) {
        this.TRANSACTION_HEADERS = {
            'Content-Type': 'application/json'
        };
        this.CUSTOMER_HEADERS = {
            'Content-Type': 'application/json',
            'X-Recurring-Api-Version': `${this.X_RECURRING_API_VERSION}`,
            Authorization: apiKey
        };
    }
    async createCustomer(customerDetails) {
        const response = await fetch(`${this.CARDKNOX_CUSTOMER_API_URL}/CreateCustomer`, {
            method: 'POST',
            headers: this.CUSTOMER_HEADERS,
            body: JSON.stringify(customerDetails)
        });
        const data = (await response.json());
        if (data.Error !== '') {
            throw new errors_1.PaymentGatewayError(data.Error);
        }
        return { id: data.CustomerId };
    }
    async createPaymentMethodToken(paymentMethodTokenDetails) {
        logger_1.logger.debug({ msg: 'Request sent to create payment token', paymentMethodTokenDetails });
        const response = await fetch(`${this.CARDKNOX_TRANSACTION_API_URL}`, {
            method: 'POST',
            headers: this.TRANSACTION_HEADERS,
            body: JSON.stringify(paymentMethodTokenDetails)
        });
        const data = (await response.json());
        logger_1.logger.debug({ msg: 'Response from create payment token', data });
        if (['01670', '99999'].includes(data.xErrorCode)) {
            if (paymentMethodTokenDetails.xCommand === 'cc:Save') {
                throw new errors_1.ValidationErrors([new errors_1.InvalidParametersError(['cardToken', 'cvvToken'])]);
            }
            else {
                throw new errors_1.ValidationErrors([new errors_1.InvalidParametersError(['achToken'])]);
            }
        }
        else if (data.xErrorCode === '01208') {
            throw new errors_1.ValidationErrors([new errors_1.InvalidParametersError(['xKey'])]);
        }
        else if (data.xError !== '') {
            throw new errors_1.PaymentGatewayError(data.xError);
        }
        return {
            token: data.xToken,
            maskedNumber: data.xMaskedAccountNumber ?? data.xMaskedCardNumber,
            cardType: data.xCardType
        };
    }
    async createPaymentMethod(paymentMethodDetails) {
        const { tokenDetails, ...paymentMethodParams } = { ...paymentMethodDetails };
        logger_1.logger.debug({ msg: 'Request sent to create payment method', paymentMethodParams });
        const tokenData = await this.createPaymentMethodToken(tokenDetails);
        if (paymentMethodDetails.tokenOnly === true) {
            return tokenData;
        }
        paymentMethodParams.Token = tokenData.token;
        const response = await fetch(`${this.CARDKNOX_CUSTOMER_API_URL}/CreatePaymentMethod`, {
            method: 'POST',
            headers: this.CUSTOMER_HEADERS,
            body: JSON.stringify(paymentMethodParams)
        });
        const data = (await response.json());
        logger_1.logger.debug({ msg: 'Response from create payment method', data });
        if (data.Error === 'Invalid gateway key (Access Denied)') {
            throw new errors_1.ValidationErrors([new errors_1.InvalidParametersError(['apiKey'])]);
        }
        else if (data.Error !== '') {
            throw new errors_1.PaymentGatewayError(data.Error);
        }
        return { id: data.PaymentMethodId, token: tokenData.token, maskedNumber: tokenData.maskedNumber, cardType: tokenData.cardType };
    }
    async getPaymentMethod(getPaymentMethodParams) {
        const response = await fetch(`${this.CARDKNOX_CUSTOMER_API_URL}/GetPaymentMethod`, {
            method: 'POST',
            headers: this.CUSTOMER_HEADERS,
            body: JSON.stringify(getPaymentMethodParams)
        });
        const data = (await response.json());
        if (data.Error !== '') {
            throw new errors_1.PaymentGatewayError(data.Error);
        }
        const { RefNum, Result, Error: err, Issuer, MaskedCardNumber, CreatedDate, ...respData } = data;
        return respData;
    }
    async updatePaymentMethod(updateParams) {
        const resp = await fetch(`${this.CARDKNOX_CUSTOMER_API_URL}/UpdatePaymentMethod`, {
            method: 'POST',
            headers: this.CUSTOMER_HEADERS,
            body: JSON.stringify(updateParams)
        });
        const data = (await resp.json());
        if (data.Error !== '') {
            throw new errors_1.PaymentGatewayError(data.Error);
        }
    }
    async deletePaymentMethod(params) {
        const resp = await fetch(`${this.CARDKNOX_CUSTOMER_API_URL}/DeletePaymentMethod`, {
            method: 'POST',
            headers: this.CUSTOMER_HEADERS,
            body: JSON.stringify(params)
        });
        const data = (await resp.json());
        if (data.Error !== '') {
            throw new errors_1.PaymentGatewayError(data.Error);
        }
    }
    async charge(chargeDetails) {
        const response = await fetch(`${this.CARDKNOX_CUSTOMER_API_URL}/ProcessTransaction`, {
            method: 'POST',
            headers: this.CUSTOMER_HEADERS,
            body: JSON.stringify(chargeDetails)
        });
        const data = (await response.json());
        if (!['Approved', 'Success'].includes(data.GatewayStatus)) {
            throw new errors_1.PaymentGatewayError(`${data.Error}${data.GatewayErrorMessage}`);
        }
    }
    async sale(saleDetails) {
        logger_1.logger.debug({ msg: 'Request sent to sale', saleDetails });
        const response = await fetch(`${this.CARDKNOX_TRANSACTION_API_URL}`, {
            method: 'POST',
            headers: this.TRANSACTION_HEADERS,
            body: JSON.stringify(saleDetails)
        });
        const data = (await response.json());
        logger_1.logger.debug({ msg: 'Response from sale', data });
        return data;
    }
    async void(voidDetails) {
        logger_1.logger.debug({ msg: 'Request sent to void', voidDetails });
        const response = await fetch(`${this.CARDKNOX_TRANSACTION_API_URL}`, {
            method: 'POST',
            headers: this.TRANSACTION_HEADERS,
            body: JSON.stringify(voidDetails)
        });
        const data = (await response.json());
        logger_1.logger.debug({ msg: 'Response from void', data });
        return data;
    }
    async capture(captureDetails) {
        logger_1.logger.debug({ msg: 'Request sent to capture', captureDetails });
        const response = await fetch(`${this.CARDKNOX_TRANSACTION_API_URL}`, {
            method: 'POST',
            headers: this.TRANSACTION_HEADERS,
            body: JSON.stringify(captureDetails)
        });
        const data = (await response.json());
        logger_1.logger.debug({ msg: 'Response from capture', data });
        return data;
    }
    async refund(transactionDetails) {
        logger_1.logger.debug({ msg: 'Request sent to refund', transactionDetails });
        const response = await fetch(`${this.CARDKNOX_TRANSACTION_API_URL}`, {
            method: 'POST',
            body: JSON.stringify(transactionDetails)
        });
        const data = await response.json();
        if (data.xError !== '') {
            throw new errors_1.PaymentGatewayError(data.xError);
        }
        logger_1.logger.debug({ msg: 'Response from refund', data });
        return { refNum: data.xRefNum, amount: data.xAuthAmount, currency: data.xCurrency, date: data.xDate, xStatus: data.xStatus, xError: data.xError };
    }
    async getTierNames(apiKey) {
        const response = await fetch(`${this.CARDKNOX_MERCHANT_API_URL}/GetTierNames`, {
            method: 'POST',
            headers: this.TRANSACTION_HEADERS,
            body: JSON.stringify({ apiKey })
        });
        const data = await response.json();
        if (data.status === 0 || data.status === 'Error') {
            if (data.error.errorMessages.length > 0) {
                throw new errors_1.PaymentGatewayError(data.error.errorCode, data.error.errorMessages);
            }
            else {
                throw new errors_1.PaymentGatewayError('An error occurred while retrieving tier information. Please try again later.');
            }
        }
        return { refnum: data.refnum, tiers: data.tiers };
    }
    async submitGoApp(submitGoAppData) {
        const response = await fetch(`${this.CARDKNOX_MERCHANT_API_URL}/SubmitGoApp`, {
            method: 'POST',
            headers: this.TRANSACTION_HEADERS,
            body: JSON.stringify(submitGoAppData)
        });
        const data = await response.json();
        if (data.status === 0 || data.status === 'Error') {
            if (data.error.errorMessages.length > 0) {
                throw new errors_1.PaymentGatewayError(data.error.errorCode, data.error.errorMessages);
            }
            else {
                throw new errors_1.PaymentGatewayError('An error occurred while submitting the merchant application. Please try again later.');
            }
        }
        return data;
    }
    async attachWebhook(apiKey, webhookData) {
        const response = await fetch(`${this.CARDKNOX_SETTINGS_API_URL}/UpdateCardknoxSettings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: apiKey
            },
            body: JSON.stringify(webhookData)
        });
        return await response.json();
    }
    async fetchTransactionReport(params) {
        logger_1.logger.debug({ msg: 'Request sent to fetch transaction report', params });
        const response = await fetch(`${this.CARDKNOX_REPORT_API_URL}`, {
            method: 'POST',
            headers: this.TRANSACTION_HEADERS,
            body: JSON.stringify(params)
        });
        const data = await response.json();
        logger_1.logger.debug({ msg: 'Response from fetch transaction report', response });
        if (data.xError !== '' && data.xError !== 'Invalid xRefNum') {
            throw new errors_1.PaymentGatewayError(data.xError);
        }
        return data;
    }
}
exports["default"] = Cardknox;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(99);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;