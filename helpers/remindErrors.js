class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = 'ValidationError';
	}
}

class ReminderDeniedValidationError extends ValidationError {
	constructor(message, toSend) {
		super(message);
		this.name = 'ReminderDeniedValidationError';
		this.toSend = toSend;
	}
}

class MonthLengthValidationError extends ValidationError {
	constructor(message, month, days) {
		super(message);
		this.name = 'MonthLengthValidationError';
		this.month = month;
		this.days = days;
	}
}

class NonmatchingInputValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NonmatchingInputValidationError';
	}
}

module.exports.ValidationError = ValidationError;
module.exports.ReminderDeniedValidationError = ReminderDeniedValidationError;
module.exports.MonthLengthValidationError = MonthLengthValidationError;
module.exports.NonmatchingInputValidationError = NonmatchingInputValidationError;