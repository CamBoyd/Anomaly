import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { AnomalyAstType, Person } from './generated/ast.js';
import type { AnomalyServices } from './anomaly-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: AnomalyServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.AnomalyValidator;
    const checks: ValidationChecks<AnomalyAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class AnomalyValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
